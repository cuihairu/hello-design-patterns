# Work Stealing

Work stealing gives each thread a local deque: tasks enter your own back end, and your own thread takes from the front end; when a thread runs idle, it goes to another thread's back end and "steals" a task into its own queue for execution. It addresses two extremes of fixed partitioning: too few tasks waste cores, too many incur large synchronization overhead. The JDK's `ForkJoinPool` is the standard reference for this pattern [S19]; Cilk, TBB, and many coroutine schedulers use the same structure.

## What it solves

A fixed-block partitioning either needs to know the task count in advance (if unknown, it cannot partition well), or it lets all threads contend for the same global queue (lock contention rises with thread count). Work stealing disperses the contention:

- **The local queue is lock-free**: only the owning thread writes to its own queue; taking from its own front end requires no synchronization.
- **Stealing happens only when idle**: load imbalance is automatically compensated, busy threads are not interrupted, and idle threads find work on their own.
- **Partitioning is adaptive**: tasks can be recursively split very finely, because the cost of splitting only falls on the moment when a steal actually happens.

The cost is that stealing requires accessing someone else's data, and back-end operations plus cache-line ping-pong are real overhead; as well as poor reproducibility -- which path a given execution takes is not fixed, and debugging relies on logging rather than re-running.

## Structure

1. Each worker thread gets a deque supporting three-end operations: own-end in, own-end out (LIFO, preserving locality), and far-end out (FIFO, stealing the oldest, which is usually the largest task).
2. The owning thread takes from the front end using LIFO: the most recently pushed task is most likely still in cache.
3. Stealing takes from the back end; what is stolen is usually the earliest enqueued, not-yet-split large task, so one steal can yield a longer amount of work.
4. When a task is stolen, both sides hand it off per an agreed synchronization method (CAS or segmented locking); on failure, retry or switch to the next victim.

## Examples

Java: `ForkJoinPool` bakes this structure into the library, and task classes are written following "if small enough, compute directly; otherwise split in two."

```java
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class SumTask extends RecursiveTask<Long> {
    private static final int THRESHOLD = 10_000;
    private final long[] data;
    private final int lo, hi;

    SumTask(long[] data, int lo, int hi) {
        this.data = data;
        this.lo = lo;
        this.hi = hi;
    }

    @Override
    protected Long compute() {
        if (hi - lo <= THRESHOLD) {          // small enough: compute directly, don't split further
            long sum = 0;
            for (int i = lo; i < hi; i++) sum += data[i];
            return sum;
        }
        int mid = (lo + hi) >>> 1;
        SumTask left = new SumTask(data, lo, mid);
        SumTask right = new SumTask(data, mid, hi);
        left.fork();                          // left goes to its own queue, right executes inline
        long r = right.compute();
        return r + left.join();               // while joining, this thread may go steal other work
    }

    public static void main(String[] args) {
        long[] data = new long[1_000_000];
        System.out.println(ForkJoinPool.commonPool().invoke(new SumTask(data, 0, data.length)));
    }
}
```

The distinction between `fork/join` and `invokeAll` lies here: the right branch computes inline, the left branch goes to the queue, and while waiting for the result the thread is free to be occupied by work stolen from elsewhere.

The Go standard library has no work-stealing pool; a self-implementation uses "a slice per thread as a deque + a mutex during stealing"; more commonly, the goroutine scheduler does it for you (the GMP scheduler's runq and stolen logic is isomorphic [S21]), and business code simply spawns goroutines.

## When to use it

- Tasks can be recursively bisected and subtasks are independent of each other -> use it; the benefit is direct (merge sort, tree traversal, batch summation).
- Tasks have dependencies and must run in order -> do not use it; splitting breaks ordering, see [Producer-Consumer](/concurrency/producer-consumer).
- Task granularity is I/O waiting -> do not use it; what is being awaited is an external event, and thread count should be determined by connection count, see [Thread Pool](/concurrency/thread-pool).
- Single core, or a fixed core count with even task volume -> do not use it; simple blocking plus a barrier is cheaper.

The `THRESHOLD` determines split depth: too small and scheduling overhead eats the benefit, too large and stealing is uneven. The approach is to set it first so "a task stays within tens of microseconds," then tune via load testing, watching the ratio of steal count to total time.

## Related articles

- [Thread Pool](/concurrency/thread-pool): work stealing is a task-allocation strategy for a thread pool.
- [Producer-Consumer](/concurrency/producer-consumer): another way to organize a task stream, suitable for I/O-intensive work.
- [Future](/concurrency/future): using `join()` to obtain a subtask's result is one use of a Future.
- [Active Object](/concurrency/active-object): queues calls to a separate thread for execution, at a different layer than stealing scheduling.

## Sources

- [S19] Java SE API `java.util.concurrent.ForkJoinPool` documentation.
- [S9] POSA Volume 2, concurrency structures in the task-pool and active-object family.
- [S21] Go official documentation and blog, goroutine scheduling and pipelines.

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [thread-pool](thread-pool.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
