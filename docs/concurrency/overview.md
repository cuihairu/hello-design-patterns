# Concurrency Patterns Overview

Concurrent patterns primarily address how to effectively and safely coordinate and manage concurrent tasks in multi-threaded or multi-process environments. They help developers write programs that run correctly, perform efficiently, and remain maintainable under concurrency. Specifically, concurrent patterns solve the following core problems:

1. **Thread safety**: Ensures safe access to shared resources in a multi-threaded environment, avoiding issues such as race conditions and deadlocks.
2. **Task allocation and coordination**: Effectively allocates and schedules concurrent tasks to ensure optimal utilization of system resources while guaranteeing the correct execution order of tasks.
3. **Performance optimization**: Improves system throughput and responsiveness through concurrent execution, minimizing lock contention and context-switching overhead.
4. **Maintainability and scalability**: Increases code maintainability and scalability by abstracting and encapsulating concurrency handling logic, reducing errors.
5. **Common patterns**: Around these problems, a set of reusable concurrent patterns has gradually evolved for practical use; this directory provides detailed explanations for each.

### Patterns in this directory

- [Producer-Consumer](/concurrency/producer-consumer): Decouples producer and consumer threads with a buffer, balancing speed differences.
- [Semaphore](/concurrency/semaphore): Controls the number of concurrent accesses to a limited resource with a counter.
- [Future](/concurrency/future): Represents the future result of an asynchronous task with a placeholder object, retrieved on demand.
- [Active Object](/concurrency/active-object): Converts method calls into tasks executed in a separate thread, separating invocation from execution.
- [Double-Checked Locking](/concurrency/double-checked-locking): Checks once before entering a synchronized block and checks again inside, balancing lazy initialization with performance.
- [Event Loop](/concurrency/event-loop): A single thread loops, waiting for and handling events, avoiding the overhead of multi-threaded context switching.
- [Reactor](/concurrency/reactor): Dispatches I/O events using a synchronous event demultiplexer, decoupling dispatching from processing.
- [Proactor](/concurrency/proactor): Triggers processing callbacks based on asynchronous I/O completion notifications, the counterpart to the Reactor.
- [Thread Pool](/concurrency/thread-pool): A fixed set of worker threads takes tasks from a queue, managing creation overhead and concurrency together.
- [Read-Write Lock](/concurrency/read-write-lock): Read locks are shared, write locks are exclusive, raising throughput when reads dominate writes.
- [Work Stealing](/concurrency/work-stealing): Each thread has a local queue; idle threads steal tasks from the tail of another's queue.

### Selection advice

- When multiple threads write shared state, choose a mutex or a [read-write lock](/concurrency/read-write-lock) according to the read/write ratio; for mere counters and flags, atomic variables are more cost-effective.
- When there are many tasks arriving quickly, use a [thread pool](/concurrency/thread-pool), and remember to bound the queue; hand CPU-intensive partitioning to [work stealing](/concurrency/work-stealing).
- Use a Future when you only need to defer retrieving a created result; use the Active Object when you need to make an entire method call asynchronous.
- For single-threaded event-driven servers, use an event loop or a Reactor; use a Proactor when the underlying system supports asynchronous completion notifications.
- Lazy initialization must always be paired with correct synchronization primitives (volatile/atomic, mutex, sync.Once) to avoid data races.

## Sources

- [S9] POSA Volume 2 *Patterns for Concurrent and Networked Objects*, the systematic catalog of concurrent patterns.
- [Java · java.util.concurrent](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html) (standard library implementation, [S19]).
- [Wikipedia · Software design pattern](https://en.wikipedia.org/wiki/Software_design_pattern)

<!-- BACKLINKS-AUTO -->
## Related pages

- [reference](/reference.md)
- [coverage](/research/coverage.md)
