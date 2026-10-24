# Active Object

The Active Object pattern is a concurrency programming pattern used to separate method calls from their actual execution, allowing method calls to be executed on an independent thread. This pattern is especially useful when handling multiple concurrent tasks while keeping code clear and maintainable.

#### Main components

1. **Proxy**:
    - Provides the same interface as the active object.
    - Responsible for receiving client requests and forwarding them to the scheduler.

2. **Method Request**:
    - Represents a method call that needs to be executed within the active object.
    - Encapsulates the method call and its parameters.

3. **Scheduler**:
    - Manages the method request queue.
    - Hands method requests off to an independent thread for execution.

4. **Servant**:
    - The object that actually executes method calls.
    - Contains the concrete business logic implementation.

5. **Future**:
    - Used to obtain the result of a method call.
    - Clients can query the asynchronously executed result through the future.

#### Workflow

1. The client calls a method through the proxy object.
2. The proxy object wraps the method call into a method request object and submits it to the scheduler.
3. The scheduler places the method request object into the request queue, where it is processed by an independent thread.
4. The servant object executes the method request.
5. The future returns the result once the method execution completes.

### Code implementation

The following are implementation examples of the Active Object pattern in C++, Go, and Java.

#### C++ implementation

```cpp
#include <iostream>
#include <thread>
#include <queue>
#include <functional>
#include <future>
#include <memory>

class MethodRequest {
public:
    virtual ~MethodRequest() = default;
    virtual void call() = 0;
};

class Scheduler {
public:
    void enqueue(std::unique_ptr<MethodRequest> request) {
        std::lock_guard<std::mutex> lock(mtx_);
        requestQueue_.push(std::move(request));
        cv_.notify_one();
    }

    // Notify the scheduler thread to exit, ensuring the program can terminate normally
    void stop() {
        {
            std::lock_guard<std::mutex> lock(mtx_);
            stopping_ = true;
        }
        cv_.notify_all();
    }

    void run() {
        while (true) {
            std::unique_ptr<MethodRequest> request;
            {
                std::unique_lock<std::mutex> lock(mtx_);
                cv_.wait(lock, [this] { return !requestQueue_.empty() || stopping_; });
                if (requestQueue_.empty()) {
                    return; // stop signal received and queue is empty
                }
                request = std::move(requestQueue_.front());
                requestQueue_.pop();
            }
            request->call();
        }
    }

private:
    std::queue<std::unique_ptr<MethodRequest>> requestQueue_;
    std::mutex mtx_;
    std::condition_variable cv_;
    bool stopping_ = false;
};

class Servant {
public:
    int do_work(int x, int y) {
        return x + y;
    }
};

class DoWorkRequest : public MethodRequest {
public:
    DoWorkRequest(Servant& servant, int x, int y, std::promise<int>&& promise)
        : servant_(servant), x_(x), y_(y), promise_(std::move(promise)) {}

    void call() override {
        int result = servant_.do_work(x_, y_);
        promise_.set_value(result);
    }

private:
    Servant& servant_;
    int x_, y_;
    std::promise<int> promise_;
};

class Proxy {
public:
    Proxy(Scheduler& scheduler, Servant& servant)
        : scheduler_(scheduler), servant_(servant) {}

    std::future<int> do_work(int x, int y) {
        std::promise<int> promise;
        auto future = promise.get_future();
        auto request = std::make_unique<DoWorkRequest>(servant_, x, y, std::move(promise));
        scheduler_.enqueue(std::move(request));
        return future;
    }

private:
    Scheduler& scheduler_;
    Servant& servant_;
};

int main() {
    Servant servant;
    Scheduler scheduler;
    Proxy proxy(scheduler, servant);

    std::thread schedulerThread(&Scheduler::run, &scheduler);

    auto future = proxy.do_work(3, 4);
    std::cout << "Result: " << future.get() << std::endl;

    scheduler.stop();       // notify the scheduler thread to exit
    schedulerThread.join(); // wait for it to finish before destroying the mutex/condition_variable
    return 0;
}
```

#### Go implementation

```go
package main

import (
	"fmt"
)

type MethodRequest struct {
	method func() int
	result chan int
}

type Scheduler struct {
	requestQueue chan MethodRequest
}

func NewScheduler() *Scheduler {
	scheduler := &Scheduler{
		requestQueue: make(chan MethodRequest, 10),
	}
	go scheduler.run()
	return scheduler
}

func (s *Scheduler) Enqueue(request MethodRequest) {
	s.requestQueue <- request
}

func (s *Scheduler) run() {
	for request := range s.requestQueue {
		result := request.method()
		request.result <- result
	}
}

type Servant struct{}

func (s *Servant) DoWork(x, y int) int {
	return x + y
}

type Proxy struct {
	scheduler *Scheduler
	servant   *Servant
}

func NewProxy(scheduler *Scheduler, servant *Servant) *Proxy {
	return &Proxy{
		scheduler: scheduler,
		servant:   servant,
	}
}

func (p *Proxy) DoWork(x, y int) <-chan int {
	result := make(chan int)
	methodRequest := MethodRequest{
		method: func() int {
			return p.servant.DoWork(x, y)
		},
		result: result,
	}
	p.scheduler.Enqueue(methodRequest)
	return result
}

func main() {
	servant := &Servant{}
	scheduler := NewScheduler()
	proxy := NewProxy(scheduler, servant)

	resultChan := proxy.DoWork(3, 4)
	fmt.Println("Result:", <-resultChan)
}
```

#### Java implementation

```java
import java.util.concurrent.*;

class MethodRequest {
    private Callable<Integer> method;
    private CompletableFuture<Integer> future;

    public MethodRequest(Callable<Integer> method, CompletableFuture<Integer> future) {
        this.method = method;
        this.future = future;
    }

    public void call() {
        try {
            future.complete(method.call());
        } catch (Exception e) {
            future.completeExceptionally(e);
        }
    }

    public CompletableFuture<Integer> getFuture() {
        return future;
    }
}

class Scheduler {
    private BlockingQueue<MethodRequest> requestQueue = new LinkedBlockingQueue<>();

    public Scheduler() {
        Thread schedulerThread = new Thread(this::run, "active-object-scheduler");
        schedulerThread.setDaemon(true); // daemon thread: the JVM can still exit when the scheduler thread is blocked on take()
        schedulerThread.start();
    }

    public void enqueue(MethodRequest request) {
        requestQueue.add(request);
    }

    private void run() {
        while (true) {
            try {
                MethodRequest request = requestQueue.take();
                request.call();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}

class Servant {
    public int doWork(int x, int y) {
        return x + y;
    }
}

class Proxy {
    private Scheduler scheduler;
    private Servant servant;

    public Proxy(Scheduler scheduler, Servant servant) {
        this.scheduler = scheduler;
        this.servant = servant;
    }

    public CompletableFuture<Integer> doWork(int x, int y) {
        CompletableFuture<Integer> future = new CompletableFuture<>();
        MethodRequest request = new MethodRequest(() -> servant.doWork(x, y), future);
        scheduler.enqueue(request);
        return future;
    }
}

public class ActiveObjectPattern {
    public static void main(String[] args) throws Exception {
        Servant servant = new Servant();
        Scheduler scheduler = new Scheduler();
        Proxy proxy = new Proxy(scheduler, servant);

        CompletableFuture<Integer> future = proxy.doWork(3, 4);
        // Block until the result is available, guaranteeing the print completes before the main thread exits
        System.out.println("Result: " + future.get());
    }
}
```

### Summary

The Active Object pattern simplifies the complexity of concurrent programming by separating method calls from their execution. By introducing a proxy, scheduler, method requests, and futures, clients can call methods asynchronously and obtain results. The C++, Go, and Java implementation examples demonstrate how the Active Object pattern can be applied in different programming languages.

## Sources

- [Wikipedia · Active object](https://en.wikipedia.org/wiki/Active_object)
- [S9] The original table of contents for POSA Volume 2.

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [work-stealing](work-stealing.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
