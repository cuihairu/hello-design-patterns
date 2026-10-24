# Virtual Proxy

The Virtual Proxy Pattern is a structural design pattern primarily used for lazy loading and optimizing resource usage. A virtual proxy takes on the role of the real object before that object is actually created. It can defer the creation of the real object until it is truly needed.

### Main components of the virtual proxy pattern

1. **Proxy**: provides the same interface as the real object and is responsible for creating the real object when needed.
2. **RealSubject**: the proxied object, containing the actual business logic.
3. **Client**: accesses the real object indirectly through the proxy.

### Advantages of the virtual proxy pattern

1. **Lazy creation of objects**: the real object is created only when needed, reducing resource consumption.
2. **Access control**: access to the real object can be controlled, allowing extra operations such as permission checks.
3. **Improved performance**: avoids unnecessary object creation, improving system performance.

### Use cases

1. **Lazy loading of large objects**: instantiating large objects is costly and they are not always needed every time.
2. **Remote proxying**: controlling access to remote objects.
3. **Caching proxy**: caching request results to reduce repeated computation.

### Example code

Below are implementation examples of the virtual proxy pattern in C++, Go, and Java.

#### C++ implementation

```cpp
#include <iostream>
#include <memory>

// Subject
class Subject {
public:
    virtual void request() = 0;
};

// Real subject
class RealSubject : public Subject {
public:
    void request() override {
        std::cout << "RealSubject: Handling request." << std::endl;
    }
};

// Virtual proxy
class Proxy : public Subject {
public:
    Proxy() : realSubject(nullptr) {}

    void request() override {
        if (!realSubject) {
            realSubject = std::make_unique<RealSubject>();
        }
        realSubject->request();
    }

private:
    std::unique_ptr<RealSubject> realSubject;
};

// Client code
int main() {
    Proxy proxy;
    proxy.request(); // The real subject is created only here
    proxy.request();
    return 0;
}
```

#### Go implementation

```go
package main

import "fmt"

// Subject abstract interface
type Subject interface {
	Request()
}

// RealSubject real object
type RealSubject struct{}

func (rs *RealSubject) Request() {
	fmt.Println("RealSubject: Handling request.")
}

// Proxy virtual proxy
type Proxy struct {
	realSubject *RealSubject
}

func (p *Proxy) Request() {
	if p.realSubject == nil {
		p.realSubject = &RealSubject{}
	}
	p.realSubject.Request()
}

// Client code
func main() {
	proxy := &Proxy{}
	proxy.Request() // The real object is created only here
	proxy.Request()
}
```

#### Java implementation

```java
// Subject
interface Subject {
    void request();
}

// Real subject
class RealSubject implements Subject {
    @Override
    public void request() {
        System.out.println("RealSubject: Handling request.");
    }
}

// Virtual proxy
class Proxy implements Subject {
    private RealSubject realSubject;

    @Override
    public void request() {
        if (realSubject == null) {
            realSubject = new RealSubject();
        }
        realSubject.request();
    }
}

// Client code
public class VirtualProxyPattern {
    public static void main(String[] args) {
        Subject proxy = new Proxy();
        proxy.request(); // The real subject is created only here
        proxy.request();
    }
}
```

### Summary

The virtual proxy pattern uses a proxy object to control access to the real object, deferring the creation of the real object until it is truly needed before instantiating it. This optimizes system performance and reduces unnecessary resource consumption. The examples above show how to implement the virtual proxy pattern in C++, Go, and Java.

## Sources

- [Wikipedia · Proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern) (see that entry for variant terminology).
- [Refactoring.Guru · Proxy](https://refactoring.guru/design-patterns/proxy)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [introduction](/introduction.md)
- [reference](/reference.md)
- [overview](overview.md)
