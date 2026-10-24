# Adapter

The Adapter Pattern is a structural design pattern that enables classes that cannot work together due to interface incompatibility to cooperate. By inserting an adapter between the client and an existing interface, the pattern converts the interface of one class into another interface that clients expect, so that originally incompatible interfaces can work together.

### Use cases of the Adapter pattern
- The system needs to use existing classes whose interfaces do not meet the system's requirements.
- You want to create a reusable class that can work with some classes that have little relationship to each other, or that are incompatible.
- You need to integrate the interfaces of multiple classes into one unified interface.

### Structure of the Adapter pattern
- **Target**: The target interface required by the client.
- **Adapter**: The adapter class, which implements the target interface and composes with the existing class.
- **Adaptee**: The existing class that needs to be adapted.
- **Client**: The client that uses the target interface.

### Example code

#### C++
```cpp
#include <iostream>
#include <string>

// Target interface
class Target {
public:
    virtual ~Target() {}
    virtual void request() const = 0;
};

// The class to be adapted
class Adaptee {
public:
    void specificRequest() const {
        std::cout << "Adaptee's specific request" << std::endl;
    }
};

// Adapter class
class Adapter : public Target {
public:
    Adapter(Adaptee* adaptee) : adaptee_(adaptee) {}

    void request() const override {
        adaptee_->specificRequest();
    }

private:
    Adaptee* adaptee_;
};

// Client code
void clientCode(const Target* target) {
    target->request();
}

int main() {
    Adaptee* adaptee = new Adaptee();
    Target* adapter = new Adapter(adaptee);
    clientCode(adapter);

    delete adaptee;
    delete adapter;
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Target interface
type Target interface {
    Request()
}

// The class to be adapted
type Adaptee struct{}

func (a *Adaptee) SpecificRequest() {
    fmt.Println("Adaptee's specific request")
}

// Adapter class
type Adapter struct {
    adaptee *Adaptee
}

func (a *Adapter) Request() {
    a.adaptee.SpecificRequest()
}

// Client code
func clientCode(target Target) {
    target.Request()
}

func main() {
    adaptee := &Adaptee{}
    adapter := &Adapter{adaptee}
    clientCode(adapter)
}
```

#### Java
```java
// Target interface
interface Target {
    void request();
}

// The class to be adapted
class Adaptee {
    void specificRequest() {
        System.out.println("Adaptee's specific request");
    }
}

// Adapter class
class Adapter implements Target {
    private Adaptee adaptee;

    public Adapter(Adaptee adaptee) {
        this.adaptee = adaptee;
    }

    @Override
    public void request() {
        adaptee.specificRequest();
    }
}

// Client code
public class Main {
    public static void main(String[] args) {
        Adaptee adaptee = new Adaptee();
        Target adapter = new Adapter(adaptee);
        adapter.request();
    }
}
```

These examples show how to implement the Adapter pattern in C++, Go, and Java. Each example defines a target interface, the class to be adapted, and an adapter class, and then uses client code to call the target interface's method; the adapter forwards these calls to the corresponding method on the adaptee class.

## Sources

- [S1] The GoF structural patterns catalog (Chapter 4), the original source of this pattern.
- [Wikipedia · Adapter pattern](https://en.wikipedia.org/wiki/Adapter_pattern)
- [Refactoring.Guru · Adapter](https://refactoring.guru/design-patterns/adapter)

<!-- BACKLINKS-AUTO -->
## Related pages

- [golden-hammer](/anti-patterns/golden-hammer.md)
- [composition-over-inheritance](/evolution/composition-over-inheritance.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [message-translator](/integration/message-translator.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
- [overview](overview.md)
