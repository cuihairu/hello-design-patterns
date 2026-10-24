# Bridge

The Bridge Pattern is a structural design pattern that separates the abstraction from its implementation so that the two can vary independently. The core idea of the Bridge pattern is to decouple the abstraction from the implementation, allowing each to change and extend independently without affecting the other. The Bridge pattern solves the problem through composition rather than inheritance, thereby avoiding the complexity of deep inheritance hierarchies.

### Use cases
- When an object varies along multiple dimensions (for example, color and shape) and those dimensions need to vary independently.
- When you want to avoid an inheritance hierarchy that grows too large, making the system complex and hard to maintain.
- When you need to implement something across multiple platforms; the Bridge pattern avoids coupling between the platforms.

### Structure
- **Abstraction**: defines the abstract interface and maintains a reference to an `Implementor`.
- **RefinedAbstraction**: extends the abstract interface, adding new operations.
- **Implementor**: defines the interface for implementation classes; concrete implementation classes implement this interface.
- **ConcreteImplementor**: a concrete implementation class that implements the `Implementor` interface.

### Example code

#### C++
```cpp
#include <iostream>

// Implementor
class Implementor {
public:
    virtual void operationImpl() const = 0;
    virtual ~Implementor() = default;
};

// ConcreteImplementorA
class ConcreteImplementorA : public Implementor {
public:
    void operationImpl() const override {
        std::cout << "ConcreteImplementorA: operationImpl.\n";
    }
};

// ConcreteImplementorB
class ConcreteImplementorB : public Implementor {
public:
    void operationImpl() const override {
        std::cout << "ConcreteImplementorB: operationImpl.\n";
    }
};

// Abstraction
class Abstraction {
protected:
    Implementor* implementor;

public:
    Abstraction(Implementor* impl) : implementor(impl) {}

    virtual void operation() const {
        implementor->operationImpl();
    }

    virtual ~Abstraction() = default;
};

// RefinedAbstraction
class RefinedAbstraction : public Abstraction {
public:
    RefinedAbstraction(Implementor* impl) : Abstraction(impl) {}

    void operation() const override {
        std::cout << "RefinedAbstraction: operation with ";
        implementor->operationImpl();
    }
};

int main() {
    Implementor* implA = new ConcreteImplementorA();
    Abstraction* abstractionA = new RefinedAbstraction(implA);
    abstractionA->operation();

    Implementor* implB = new ConcreteImplementorB();
    Abstraction* abstractionB = new RefinedAbstraction(implB);
    abstractionB->operation();

    delete abstractionA;
    delete implA;
    delete abstractionB;
    delete implB;
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Implementor
type Implementor interface {
    OperationImpl()
}

// ConcreteImplementorA
type ConcreteImplementorA struct{}

func (c *ConcreteImplementorA) OperationImpl() {
    fmt.Println("ConcreteImplementorA: OperationImpl")
}

// ConcreteImplementorB
type ConcreteImplementorB struct{}

func (c *ConcreteImplementorB) OperationImpl() {
    fmt.Println("ConcreteImplementorB: OperationImpl")
}

// Abstraction
type Abstraction struct {
    impl Implementor
}

func (a *Abstraction) Operation() {
    a.impl.OperationImpl()
}

// RefinedAbstraction
type RefinedAbstraction struct {
    Abstraction
}

func (r *RefinedAbstraction) Operation() {
    fmt.Print("RefinedAbstraction: Operation with ")
    r.impl.OperationImpl()
}

func main() {
    implA := &ConcreteImplementorA{}
    abstractionA := &RefinedAbstraction{Abstraction{implA}}
    abstractionA.Operation()

    implB := &ConcreteImplementorB{}
    abstractionB := &RefinedAbstraction{Abstraction{implB}}
    abstractionB.Operation()
}
```

#### Java
```java
// Implementor
interface Implementor {
    void operationImpl();
}

// ConcreteImplementorA
class ConcreteImplementorA implements Implementor {
    public void operationImpl() {
        System.out.println("ConcreteImplementorA: operationImpl.");
    }
}

// ConcreteImplementorB
class ConcreteImplementorB implements Implementor {
    public void operationImpl() {
        System.out.println("ConcreteImplementorB: operationImpl.");
    }
}

// Abstraction
abstract class Abstraction {
    protected Implementor implementor;

    protected Abstraction(Implementor impl) {
        this.implementor = impl;
    }

    public abstract void operation();
}

// RefinedAbstraction
class RefinedAbstraction extends Abstraction {
    public RefinedAbstraction(Implementor impl) {
        super(impl);
    }

    public void operation() {
        System.out.print("RefinedAbstraction: operation with ");
        implementor.operationImpl();
    }
}

// Client code
public class Main {
    public static void main(String[] args) {
        Implementor implA = new ConcreteImplementorA();
        Abstraction abstractionA = new RefinedAbstraction(implA);
        abstractionA.operation();

        Implementor implB = new ConcreteImplementorB();
        Abstraction abstractionB = new RefinedAbstraction(implB);
        abstractionB.operation();
    }
}
```

These examples show how to implement the Bridge pattern in C++, Go, and Java. In each example, the abstraction and the implementation are separated through a composition relationship: the concrete implementation class (ConcreteImplementor) implements the `Implementor` interface, and the abstraction class (Abstraction) holds a reference to an object implementing `Implementor`. The concrete operation is defined in the `RefinedAbstraction` class, which achieves the separation of abstraction and implementation so that they can vary independently.

## Sources

- [S1] GoF structural patterns catalog (chapter 4), the original source of this pattern.
- [Wikipedia · Bridge pattern](https://en.wikipedia.org/wiki/Bridge_pattern)
- [Refactoring.Guru · Bridge](https://refactoring.guru/design-patterns/bridge)

<!-- BACKLINKS-AUTO -->
## Related pages

- [composition-over-inheritance](/evolution/composition-over-inheritance.md)
- [overview](/evolution/overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
- [official-docs](/research/official-docs.md)
- [overview](overview.md)
