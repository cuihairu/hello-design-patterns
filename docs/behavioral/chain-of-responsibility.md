# Chain of Responsibility

The Chain of Responsibility pattern is a behavioral design pattern that lets multiple objects have a chance to handle a request, thereby avoiding a coupling between the sender and the receiver of the request. These objects are linked together into a chain, and the request is passed along the chain until some object handles it.

### Use cases
- There are multiple objects that can handle the request, but the specific handler is decided at runtime.
- You need to dynamically specify the object that handles a request.
- You need to submit a request to multiple objects without explicitly specifying the handler.

### Structure
- **Handler**: The interface for handling requests; it defines the method for handling a request and the method for setting the next handler.
- **ConcreteHandler**: A concrete handler that handles the requests it is responsible for and can access its successor.
- **Client**: The object that sends requests and submits them to a concrete handler on the chain.

### Example code

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

### Advantages
- **Reduced coupling**: The sender and the receiver of the request are decoupled.
- **High flexibility**: Different handlers can be composed dynamically.
- **Division of responsibility**: Each class only needs to handle the work it is responsible for, making each one's scope of responsibility clear.

### Disadvantages
- **Performance issues**: When the chain is too long, handling a request may involve multiple handler objects, which affects performance.
- **Difficult to debug**: It is not easy to determine which object ultimately handles a request, making debugging more complex.

The Chain of Responsibility pattern is suitable for situations that require multiple objects to handle requests, especially when the handler for a request is unclear or needs to be specified dynamically. By passing requests along the chain, the Chain of Responsibility pattern provides a flexible way of handling requests.

## Sources

- [S1] GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · Chain-of-responsibility pattern](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern)
- [Refactoring.Guru · Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility)

<!-- BACKLINKS-AUTO -->
## Related pages

- [spaghetti-code](/anti-patterns/spaghetti-code.md)
- [overview](overview.md)
- [overview](/evolution/overview.md)
- [glossary](/glossary.md)
- [message-router](/integration/message-router.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
