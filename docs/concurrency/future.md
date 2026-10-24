# Future

#### Overview
The Future pattern is a concurrent design pattern used to represent the result of an asynchronous computation. While a task is executing, the caller can continue doing other work; the result can be retrieved through the Future when needed. Network requests and file I/O are common scenarios.

#### Use cases
- **Asynchronous programming**: Do not block the main thread while executing time-consuming tasks.
- **Concurrent tasks**: Execute multiple tasks simultaneously and collect their results later.
- **Improved efficiency**: Improve system responsiveness and resource utilization.

#### Pros
- **Non-blocking**: The main thread can continue executing other tasks without waiting for the asynchronous task to complete.
- **Concurrency**: Multiple tasks can be executed simultaneously, improving system throughput.
- **Flexibility**: Callbacks can be used when a task completes, or blocking retrieval of the result can be used when needed.

#### Cons
- **Complexity**: Task lifecycle and error handling must be managed.
- **Difficult debugging**: Debugging and maintaining asynchronous code is relatively complex.

#### Example code

##### Java example
Java's `java.util.concurrent` package provides support for the Future pattern.

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class FutureExample {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newSingleThreadExecutor();

        Callable<String> callable = () -> {
            Thread.sleep(2000); // Simulate a time-consuming operation
            return "Result from Callable";
        };

        Future<String> future = executor.submit(callable);

        // You can perform other operations
        System.out.println("Doing something else...");

        try {
            // Retrieve the task result
            String result = future.get();
            System.out.println("Result: " + result);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        executor.shutdown();
    }
}
```

##### Python example
Python's `concurrent.futures` module provides similar functionality.

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def task():
    time.sleep(2)  # Simulate a time-consuming operation
    return "Result from task"

with ThreadPoolExecutor() as executor:
    future = executor.submit(task)

    # You can perform other operations
    print("Doing something else...")

    # Retrieve the task result
    result = future.result()
    print("Result:", result)
```

##### C++ example
C++11 provides `std::future` and `std::async` for asynchronous programming.

```cpp
#include <iostream>
#include <future>
#include <thread>
#include <chrono>

std::string task() {
    std::this_thread::sleep_for(std::chrono::seconds(2)); // Simulate a time-consuming operation
    return "Result from task";
}

int main() {
    std::future<std::string> future = std::async(std::launch::async, task);

    // You can perform other operations
    std::cout << "Doing something else..." << std::endl;

    // Retrieve the task result
    std::string result = future.get();
    std::cout << "Result: " << result << std::endl;

    return 0;
}
```

##### Go example
Go's goroutines and channels provide similar functionality.

```go
package main

import (
    "fmt"
    "time"
)

func task(ch chan string) {
    time.Sleep(2 * time.Second) // Simulate a time-consuming operation
    ch <- "Result from task"
}

func main() {
    ch := make(chan string)
    go task(ch)

    // You can perform other operations
    fmt.Println("Doing something else...")

    // Retrieve the task result
    result := <-ch
    fmt.Println("Result:", result)
}
```

### Summary

The Future pattern is very useful in asynchronous programming and concurrent task processing. Through the Future object, time-consuming tasks can be handled without blocking the main thread, and results can be retrieved after the task completes. This pattern is widely used in modern programming, improving program responsiveness and resource utilization.

## Sources

- [Wikipedia · Futures and promises](https://en.wikipedia.org/wiki/Futures_and_promises)
- [Java · CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html) (standard library form, [S19])

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [thread-pool](thread-pool.md)
- [work-stealing](work-stealing.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [official-docs](/research/official-docs.md)
