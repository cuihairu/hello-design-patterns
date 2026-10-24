# Thread Pool

A thread pool pre-creates a batch of worker threads, hands tasks to a queue, and threads repeatedly pull tasks from the queue for execution. It trades the creation overhead of "spinning up a new thread for every task" and the resource exhaustion from unlimited thread creation for a controlled degree of concurrency. Java's `ThreadPoolExecutor` is the standard reference for this pattern [S19].

## What it solves

1. **Creation overhead**: Thread creation and destruction go through the kernel, taking tens of microseconds each time; when a task itself takes only a few microseconds, the overhead exceeds the work.
2. **Uncontrolled concurrency**: Opening a thread for each request means 100,000 in-flight requests become 100,000 threads, exhausting stack memory first (the default stack is 1 MB per thread, so 10,000 threads mean 10 GB).
3. **Peak shaving**: When tasks arrive faster than they are processed, the queue smooths out the surge while the thread count remains constant.

One category it does not suit is long-blocking tasks that wait on each other: a thread pool has a limited size, so once the threads in the pool are saturated, new tasks queue up, and mutual waiting can deadlock (see the parameters section below).

## How to set the parameters

Of `ThreadPoolExecutor`'s seven parameters, the four that actually need to be decided are:

| Parameter | Purpose | How to set |
| --- | --- | --- |
| Core thread count | Resident threads | For CPU-intensive tasks, use around the number of CPU cores; for I/O-intensive, use `cores × (1 + wait time / compute time)`; calculate first, then tune via load testing |
| Max thread count | Temporary expansion after the queue is full | Do not make it unbounded; it is only a buffer between the core count and the surge |
| Queue capacity | Where tasks wait | Bounded and on the smaller side. An unbounded queue renders the max thread count moot: all tasks pile up in the queue and latency creeps up quietly |
| Rejection policy | When both the queue and threads are full | Four common options: drop, drop oldest, the submitter runs it itself, throw an exception. Financial tasks generally use "the submitter runs it itself" or throw an exception; silent drops need monitoring |

Three rules of thumb:

- **Unbounded queue + large thread count** is a common misconfiguration: the thread count can never grow (the queue absorbs everything first), memory blows up first, and the pool looks "idle."
- **Tasks that wait on each other** (task A waits for task B's result) can saturate the pool and deadlock. The fix is to turn waiting into callbacks or split to another pool; see [Future](/concurrency/future).
- **The pool needs graceful shutdown**: `shutdown()` stops accepting new tasks without rejecting, waiting for existing work to finish; calling `shutdownNow()` directly will interrupt running tasks.

## Examples

Java: explicitly set the four key parameters, avoiding factory shortcuts like `Executors.newFixedThreadPool` (whose queues or thread counts are often unbounded).

```java
import java.util.concurrent.*;

public class PoolExample {
    public static void main(String[] args) {
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
                8,                                  // core threads
                32,                                 // max threads
                30, TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(200),      // bounded queue
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.CallerRunsPolicy()  // when full, the submitter runs it itself; natural backpressure
        );

        for (int i = 0; i < 1000; i++) {
            pool.execute(() -> System.out.println(Thread.currentThread().getName()));
        }

        pool.shutdown();                            // no new tasks, wait for existing ones to finish
        try {
            pool.awaitTermination(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            pool.shutdownNow();
        }
    }
}
```

Go has no thread pool class; the equivalent is "a fixed number of goroutines pulling tasks from the same channel":

```go
func workerPool(jobs <-chan Job, workers int) {
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            for job := range jobs {   // auto-exit after the channel is closed
                job.run(id)
            }
        }(i)
    }
    wg.Wait()
}
```

Here the concurrency ceiling is the number of goroutines, the queue is the channel's buffer, and once it is full the sender blocks, corresponding to the Java version's CallerRunsPolicy backpressure. The C++ equivalent is `std::thread` plus a task queue, or C++20's `std::jthread` combined with `std::stop_token` for graceful stop.

## Metrics to watch

- Queue depth keeps growing: processing speed cannot keep up with submission speed; check whether thread count or per-task time is the constraint.
- Active threads are persistently at the max thread count: either tasks are too heavy, or the queue is too large so threads keep getting preempted.
- Rejections > 0: backpressure is starting to take effect. This is a signal, not a failure, but it must be visible.

## Related articles

- [Producer-Consumer](/concurrency/producer-consumer): the thread pool's internals are an instance of this structure.
- [Object Pool](/creational/object-pool): the general form of pooled reuse; the thread pool is one of its resources.
- [Future](/concurrency/future): a handle for getting back results after submitting tasks.
- [Semaphore](/concurrency/semaphore): controls concurrency via permit count; a different rate-limiting mechanism from the thread pool.
- [Read-Write Lock](/concurrency/read-write-lock): the locking choice for shared state within a task.
- [Work Stealing](/concurrency/work-stealing): the scheduling approach when a thread pool handles CPU-intensive partitioned tasks.

## Sources

- [S19] Java SE API `java.util.concurrent` package documentation, `ThreadPoolExecutor` parameters and semantics.
- [S21] Go official documentation, goroutine and channel idioms.
- [S9] POSA Volume 2, concurrency structures related to thread pools and half-sync/half-async.

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [read-write-lock](read-write-lock.md)
- [work-stealing](work-stealing.md)
- [bulkhead](/evolution/bulkhead.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
- [official-docs](/research/official-docs.md)
