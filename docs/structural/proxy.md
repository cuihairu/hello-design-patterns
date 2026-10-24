# Proxy

The Proxy Pattern is a structural design pattern that provides a surrogate for another object to control access to that object. The Proxy pattern is commonly used in scenarios such as lazy loading, access control, and logging. The proxy object acts as an intermediary between the client and the target object: the client accesses the target object through the proxy, and the proxy can perform additional operations before or after calling the target object's methods.

### Use cases
- **Remote proxy**: Provides a local surrogate for an object in a different address space. For example, it hides the fact that an object exists in a different address space.
- **Virtual proxy**: Creates expensive objects on demand. For example, if an object takes a long time to create, it is created only when the client actually needs it.
- **Protection proxy**: Controls access to the original object. For example, a proxy is placed in front of the object and used to control access to the original object.
- **Smart pointer**: Replaces simple pointers; it performs some additional operations when accessing an object.

### Structure
- **Subject**: Defines the common interface of RealSubject and Proxy, so that a Proxy can be used anywhere a RealSubject is used.
- **RealSubject**: Defines the real entity that the Proxy represents.
- **Proxy**: Holds a reference so that the proxy can access the real entity, and provides an interface identical to that of Subject.

### Example code

#### C++
```cpp
#include <iostream>

// Subject
class Subject {
public:
    virtual void request() const = 0;
    virtual ~Subject() = default;
};

// RealSubject
class RealSubject : public Subject {
public:
    void request() const override {
        std::cout << "RealSubject: Handling request.\n";
    }
};

// Proxy
class Proxy : public Subject {
private:
    RealSubject* realSubject;

public:
    Proxy() : realSubject(new RealSubject()) {}

    ~Proxy() {
        delete realSubject;
    }

    void request() const override {
        std::cout << "Proxy: Checking access prior to firing a real request.\n";
        realSubject->request();
    }
};

int main() {
    Subject* subject = new Proxy();
    subject->request();
    delete subject;
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Subject
type Subject interface {
    Request()
}

// RealSubject
type RealSubject struct{}

func (rs *RealSubject) Request() {
    fmt.Println("RealSubject: Handling request.")
}

// Proxy
type Proxy struct {
    realSubject *RealSubject
}

func NewProxy() *Proxy {
    return &Proxy{realSubject: &RealSubject{}}
}

func (p *Proxy) Request() {
    fmt.Println("Proxy: Checking access prior to firing a real request.")
    p.realSubject.Request()
}

func main() {
    var subject Subject = NewProxy()
    subject.Request()
}
```

#### Java
```java
// Subject
interface Subject {
    void request();
}

// RealSubject
class RealSubject implements Subject {
    public void request() {
        System.out.println("RealSubject: Handling request.");
    }
}

// Proxy
class Proxy implements Subject {
    private RealSubject realSubject;

    public Proxy() {
        this.realSubject = new RealSubject();
    }

    @Override
    public void request() {
        System.out.println("Proxy: Checking access prior to firing a real request.");
        realSubject.request();
    }
}

// Client code
public class Main {
    public static void main(String[] args) {
        Subject subject = new Proxy();
        subject.request();
    }
}
```

These examples show how to implement the Proxy pattern in C++, Go, and Java. In each example, the proxy class implements the same interface as the target object; the client accesses the target object's methods through the proxy, and the proxy performs additional operations before or after calling those methods.

## Sources

- [S1] The GoF structural patterns catalog (Chapter 4), the original source of this pattern.
- [Wikipedia · Proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern)
- [Refactoring.Guru · Proxy](https://refactoring.guru/design-patterns/proxy)

<!-- BACKLINKS-AUTO -->
## Related pages

- [circuit-breaker](/evolution/circuit-breaker.md)
- [composition-over-inheritance](/evolution/composition-over-inheritance.md)
- [overview](/evolution/overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
- [overview](overview.md)
