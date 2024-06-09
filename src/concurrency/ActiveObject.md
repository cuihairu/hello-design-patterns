### 主动对象模式

主动对象模式（Active Object Pattern）是一种并发编程模式，用于将方法调用与其实际执行分离，从而允许方法调用在独立的线程中执行。这种模式在需要处理多个并发任务且希望保持代码清晰和可维护时特别有用。

#### 主要组成部分

1. **Proxy（代理）**:
    - 提供与主动对象相同的接口。
    - 负责接收客户端请求并将其转发给调度器。

2. **Method Request（方法请求）**:
    - 表示需要在主动对象中执行的方法调用。
    - 封装了方法调用及其参数。

3. **Scheduler（调度器）**:
    - 管理方法请求队列。
    - 将方法请求交给独立的线程执行。

4. **Servant（服务对象）**:
    - 实际执行方法调用的对象。
    - 包含具体的业务逻辑实现。

5. **Future（未来对象）**:
    - 用于获取方法调用的结果。
    - 客户端可以通过未来对象查询异步执行的结果。

#### 工作流程

1. 客户端通过代理对象调用方法。
2. 代理对象将方法调用封装为方法请求对象，并将其提交给调度器。
3. 调度器将方法请求对象放入请求队列，并由独立线程处理。
4. 服务对象执行方法请求。
5. 未来对象在方法执行完成后返回结果。

### 代码实现

以下是主动对象模式在C++、Go和Java中的实现示例。

#### C++ 实现

```cpp
#include <iostream>
#include <thread>
#include <queue>
#include <functional>
#include <future>
#include <memory>

class MethodRequest {
public:
    virtual void call() = 0;
};

class Scheduler {
public:
    void enqueue(std::unique_ptr<MethodRequest> request) {
        std::lock_guard<std::mutex> lock(mtx_);
        requestQueue_.push(std::move(request));
        cv_.notify_one();
    }

    void run() {
        while (true) {
            std::unique_ptr<MethodRequest> request;
            {
                std::unique_lock<std::mutex> lock(mtx_);
                cv_.wait(lock, [this] { return !requestQueue_.empty(); });
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

    schedulerThread.join();
    return 0;
}
```

#### Go 实现

```go
package main

import (
	"fmt"
	"sync"
)

type MethodRequest struct {
	method func() interface{}
	result chan interface{}
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
		method: func() interface{} {
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

#### Java 实现

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
        new Thread(this::run).start();
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
    public static void main(String[] args) {
        Servant servant = new Servant();
        Scheduler scheduler = new Scheduler();
        Proxy proxy = new Proxy(scheduler, servant);

        CompletableFuture<Integer> future = proxy.doWork(3, 4);
        future.thenAccept(result -> System.out.println("Result: " + result));
    }
}
```

### 总结

主动对象模式通过将方法调用与执行分离，简化了并发编程的复杂性。通过引入代理、调度器、方法请求和未来对象，客户端可以异步调用方法并获得结果。C++、Go和Java的实现示例展示了如何在不同编程语言中应用主动对象模式。