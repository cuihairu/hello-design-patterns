# 责任链模式

责任链模式（Chain of Responsibility Pattern）是一种行为设计模式，使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合。将这些对象连成一条链，并沿着这条链传递请求，直到有对象处理它为止。

### 使用场景
- 有多个对象可以处理请求，但具体处理者在运行时决定。
- 需要动态指定处理请求的对象。
- 需要在不明确指定请求处理者的情况下，向多个对象提交请求。

### 结构
- **Handler**：处理请求的接口，定义处理请求的方法和设置下一个处理者的方法。
- **ConcreteHandler**：具体处理者，处理它所负责的请求，可以访问它的后继者。
- **Client**：发出请求的对象，向链上的具体处理者提交请求。

### 示例代码

#### C++
```cpp
#include <iostream>
#include <memory>

// Handler Interface
class Handler {
public:
    virtual ~Handler() = default;
    void setNext(std::shared_ptr<Handler> nextHandler) {
        next = nextHandler;
    }
    virtual void handleRequest(int request) {
        if (next

```cpp
#include <iostream>
#include <memory>

// Handler Interface
class Handler {
public:
    virtual ~Handler() = default;
    void setNext(std::shared_ptr<Handler> nextHandler) {
        next = nextHandler;
    }
    virtual void handleRequest(int request) {
        if (next) {
            next->handleRequest(request);
        }
    }

protected:
    std::shared_ptr<Handler> next;
};

// Concrete Handlers
class ConcreteHandler1 : public Handler {
public:
    void handleRequest(int request) override {
        if (request < 10) {
            std::cout << "ConcreteHandler1 handles request " << request << std::endl;
        } else {
            Handler::handleRequest(request);
        }
    }
};

class ConcreteHandler2 : public Handler {
public:
    void handleRequest(int request) override {
        if (request >= 10 && request < 20) {
            std::cout << "ConcreteHandler2 handles request " << request << std::endl;
        } else {
            Handler::handleRequest(request);
        }
    }
};

class ConcreteHandler3 : public Handler {
public:
    void handleRequest(int request) override {
        if (request >= 20) {
            std::cout << "ConcreteHandler3 handles request " << request << std::endl;
        } else {
            Handler::handleRequest(request);
        }
    }
};

// Client
int main() {
    std::shared_ptr<Handler> handler1 = std::make_shared<ConcreteHandler1>();
    std::shared_ptr<Handler> handler2 = std::make_shared<ConcreteHandler2>();
    std::shared_ptr<Handler> handler3 = std::make_shared<ConcreteHandler3>();

    handler1->setNext(handler2);
    handler2->setNext(handler3);

    int requests[] = {5, 14, 22, 18, 3};
    for (int request : requests) {
        handler1->handleRequest(request);
    }

    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Handler Interface
type Handler interface {
    SetNext(handler Handler)
    HandleRequest(request int)
}

// BaseHandler
type BaseHandler struct {
    next Handler
}

func (h *BaseHandler) SetNext(handler Handler) {
    h.next = handler
}

func (h *BaseHandler) HandleRequest(request int) {
    if h.next != nil {
        h.next.HandleRequest(request)
    }
}

// Concrete Handlers
type ConcreteHandler1 struct {
    BaseHandler
}

func (h *ConcreteHandler1) HandleRequest(request int) {
    if request < 10 {
        fmt.Printf("ConcreteHandler1 handles request %d\n", request)
    } else {
        h.BaseHandler.HandleRequest(request)
    }
}

type ConcreteHandler2 struct {
    BaseHandler
}

func (h *ConcreteHandler2) HandleRequest(request int) {
    if request >= 10 && request < 20 {
        fmt.Printf("ConcreteHandler2 handles request %d\n", request)
    } else {
        h.BaseHandler.HandleRequest(request)
    }
}

type ConcreteHandler3 struct {
    BaseHandler
}

func (h *ConcreteHandler3) HandleRequest(request int) {
    if request >= 20 {
        fmt.Printf("ConcreteHandler3 handles request %d\n", request)
    } else {
        h.BaseHandler.HandleRequest(request)
    }
}

// Client
func main() {
    handler1 := &ConcreteHandler1{}
    handler2 := &ConcreteHandler2{}
    handler3 := &ConcreteHandler3{}

    handler1.SetNext(handler2)
    handler2.SetNext(handler3)

    requests := []int{5, 14, 22, 18, 3}
    for _, request := range requests {
        handler1.HandleRequest(request)
    }
}
```

#### Java
```java
// Handler Interface
interface Handler {
    void setNext(Handler handler);
    void handleRequest(int request);
}

// BaseHandler
abstract class BaseHandler implements Handler {
    protected Handler next;
    @Override
    public void setNext(Handler handler) {
        this.next = handler;
    }
    @Override
    public void handleRequest(int request) {
        if (next != null) {
            next.handleRequest(request);
        }
    }
}

// Concrete Handlers
class ConcreteHandler1 extends BaseHandler {
    @Override
    public void handleRequest(int request) {
        if (request < 10) {
            System.out.println("ConcreteHandler1 handles request " + request);
        } else {
            super.handleRequest(request);
        }
    }
}

class ConcreteHandler2 extends BaseHandler {
    @Override
    public void handleRequest(int request) {
        if (request >= 10 && request < 20) {
            System.out.println("ConcreteHandler2 handles request " + request);
        } else {
            super.handleRequest(request);
        }
    }
}

class ConcreteHandler3 extends BaseHandler {
    @Override
    public void handleRequest(int request) {
        if (request >= 20) {
            System.out.println("ConcreteHandler3 handles request " + request);
        } else {
            super.handleRequest(request);
        }
    }
}

// Client
public class Main {
    public static void main(String[] args) {
        Handler handler1 = new ConcreteHandler1();
        Handler handler2 = new ConcreteHandler2();
        Handler handler3 = new ConcreteHandler3();

        handler1.setNext(handler2);
        handler2.setNext(handler3);

        int[] requests = {5, 14, 22, 18, 3};
        for (int request : requests) {
            handler1.handleRequest(request);
        }
    }
}
```

### 优点
- **降低耦合度**：请求发送者和接收者解耦。
- **灵活性高**：可以动态组合不同的处理器。
- **责任分担**：每个类只需要处理自己该处理的工作，明确各自的责任范围。

### 缺点
- **性能问题**：链过长时，请求的处理可能涉及多个处理对象，影响性能。
- **调试困难**：不容易确定请求最终的处理者是谁，调试较复杂。

责任链模式适用于需要多个对象处理请求的情况，特别是请求的处理者不明确或需要动态指定的场景。通过将请求沿着链传递，责任链模式提供了一种灵活的请求处理方式。