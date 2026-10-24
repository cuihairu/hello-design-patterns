# Semaphore

#### Overview
The Semaphore pattern is a concurrent design pattern used to control access to shared resources. A semaphore is a counter that allows a certain number of threads to access a resource. When the counter is greater than zero, a thread can access the resource and decrements the counter by one. When the counter equals zero, the thread is blocked until the counter becomes greater than zero.

#### Use cases
- **Limiting resource access**: Control access to limited resources, such as database connection pools and thread pools.
- **Implementing synchronization**: Used for synchronization between threads, ensuring safe access to shared resources.
- **Traffic control**: In high-concurrency systems, used to control request traffic and avoid system overload.

#### Pros
- **Control resource access**: Effectively limits the number of concurrent accesses to shared resources.
- **Improved system stability**: Prevents resource exhaustion, ensuring stable system operation.
- **Flexibility**: The semaphore value can be adjusted dynamically to adapt to different concurrency needs.

#### Cons
- **Complexity**: The semaphore value must be managed carefully to avoid deadlocks and resource starvation.
- **Difficult debugging**: Debugging and troubleshooting concurrent issues is relatively complex.

#### Example code

##### Java example
Java's `java.util.concurrent.Semaphore` provides support for semaphores.

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;

public class SemaphoreExample {
    private static final int MAX_CONCURRENT_THREADS = 3;
    private static final Semaphore semaphore = new Semaphore(MAX_CONCURRENT_THREADS);

    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(10);

        for (int i = 0; i < 10; i++) {
            executor.submit(() -> {
                boolean acquired = false;
                try {
                    semaphore.acquire();
                    acquired = true;
                    System.out.println(Thread.currentThread().getName() + " acquired a permit.");
                    Thread.sleep(2000); // Simulate task execution
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    // Only release if acquire succeeded; otherwise the interruption path
                    // would increase the permit count out of nowhere.
                    if (acquired) {
                        System.out.println(Thread.currentThread().getName() + " released a permit.");
                        semaphore.release();
                    }
                }
            });
        }

        executor.shutdown();
    }
}
```

##### Python example
Python's `threading` module provides support for semaphores.

```python
import threading
import time

def task(semaphore):
    with semaphore:
        print(f"{threading.current_thread().name} acquired a permit.")
        time.sleep(2)  # Simulate task execution
        print(f"{threading.current_thread().name} released a permit.")

semaphore = threading.Semaphore(3)

threads = []
for i in range(10):
    thread = threading.Thread(target=task, args=(semaphore,))
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()
```

##### C++ example
The standard library from C++20 onward provides `std::counting_semaphore` for semaphores.

```cpp
#include <iostream>
#include <thread>
#include <vector>
#include <semaphore>

std::counting_semaphore<3> semaphore(3); // Initialize the semaphore to 3

void task() {
    semaphore.acquire();
    std::cout << std::this_thread::get_id() << " acquired a permit." << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(2)); // Simulate task execution
    std::cout << std::this_thread::get_id() << " released a permit." << std::endl;
    semaphore.release();
}

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 10; ++i) {
        threads.emplace_back(task);
    }
    for (auto& thread : threads) {
        thread.join();
    }
    return 0;
}
```

##### Go example
Go's standard library has no ready-made semaphore type; the idiomatic approach is to implement one with a buffered channel (the example below uses this approach); `sync.WaitGroup` is used to wait for a group of tasks to complete.

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func task(id int, semaphore chan struct{}, wg *sync.WaitGroup) {
    defer wg.Done()
    semaphore <- struct{}{}
    fmt.Printf("Goroutine %d acquired a permit.\n", id)
    time.Sleep(2 * time.Second) // Simulate task execution
    fmt.Printf("Goroutine %d released a permit.\n", id)
    <-semaphore
}

func main() {
    const maxConcurrentThreads = 3
    semaphore := make(chan struct{}, maxConcurrentThreads)
    var wg sync.WaitGroup

    for i := 0; i < 10; i++ {
        wg.Add(1)
        go task(i, semaphore, &wg)
    }

    wg.Wait()
}
```

### Summary

The Semaphore pattern is very effective at controlling concurrent access to shared resources. By limiting the number of threads accessing a resource simultaneously, it can avoid resource contention and system overload, thereby improving system stability and performance. However, the semaphore value must be managed carefully to avoid complex concurrency issues.

## Sources

- [Wikipedia · Semaphore](https://en.wikipedia.org/wiki/Semaphore_%28programming%29)
- [man7 · sem_overview](https://man7.org/linux/man-pages/man7/sem_overview.7.html) (POSIX semaphores)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [read-write-lock](read-write-lock.md)
- [thread-pool](thread-pool.md)
- [bulkhead](/evolution/bulkhead.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [official-docs](/research/official-docs.md)
