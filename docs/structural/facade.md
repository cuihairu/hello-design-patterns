# Facade

The Facade Pattern is a structural design pattern that provides a unified interface for accessing a group of interfaces within a subsystem. It defines a high-level interface that makes the subsystem easier to use.

### Use cases
- When you want to provide a simple interface for a complex subsystem.
- When many classes need to be invoked in a simplified way.
- When you want to decouple the subsystem from its clients.

### Structure
- **Facade**: The facade class, which provides a high-level interface to simplify calls to the subsystem.
- **Subsystem Classes**: The subsystem classes that perform the actual work of the subsystem.

### Example code

#### C++
```cpp
#include <iostream>

// Subsystem Classes
class SubsystemA {
public:
    void operationA() const {
        std::cout << "SubsystemA operationA\n";
    }
};

class SubsystemB {
public:
    void operationB() const {
        std::cout << "SubsystemB operationB\n";
    }
};

class SubsystemC {
public:
    void operationC() const {
        std::cout << "SubsystemC operationC\n";
    }
};

// Facade
class Facade {
private:
    SubsystemA subsystemA;
    SubsystemB subsystemB;
    SubsystemC subsystemC;

public:
    void operation1() {
        std::cout << "Facade operation1\n";
        subsystemA.operationA();
        subsystemB.operationB();
    }

    void operation2() {
        std::cout << "Facade operation2\n";
        subsystemB.operationB();
        subsystemC.operationC();
    }
};

int main() {
    Facade facade;
    facade.operation1();
    facade.operation2();
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Subsystem Classes
type SubsystemA struct{}

func (s *SubsystemA) OperationA() {
    fmt.Println("SubsystemA OperationA")
}

type SubsystemB struct{}

func (s *SubsystemB) OperationB() {
    fmt.Println("SubsystemB OperationB")
}

type SubsystemC struct{}

func (s *SubsystemC) OperationC() {
    fmt.Println("SubsystemC OperationC")
}

// Facade
type Facade struct {
    subsystemA *SubsystemA
    subsystemB *SubsystemB
    subsystemC *SubsystemC
}

func NewFacade() *Facade {
    return &Facade{
        subsystemA: &SubsystemA{},
        subsystemB: &SubsystemB{},
        subsystemC: &SubsystemC{},
    }
}

func (f *Facade) Operation1() {
    fmt.Println("Facade Operation1")
    f.subsystemA.OperationA()
    f.subsystemB.OperationB()
}

func (f *Facade) Operation2() {
    fmt.Println("Facade Operation2")
    f.subsystemB.OperationB()
    f.subsystemC.OperationC()
}

func main() {
    facade := NewFacade()
    facade.Operation1()
    facade.Operation2()
}
```

#### Java
```java
// Subsystem Classes
class SubsystemA {
    public void operationA() {
        System.out.println("SubsystemA operationA");
    }
}

class SubsystemB {
    public void operationB() {
        System.out.println("SubsystemB operationB");
    }
}

class SubsystemC {
    public void operationC() {
        System.out.println("SubsystemC operationC");
    }
}

// Facade
class Facade {
    private SubsystemA subsystemA;
    private SubsystemB subsystemB;
    private SubsystemC subsystemC;

    public Facade() {
        this.subsystemA = new SubsystemA();
        this.subsystemB = new SubsystemB();
        this.subsystemC = new SubsystemC();
    }

    public void operation1() {
        System.out.println("Facade operation1");
        subsystemA.operationA();
        subsystemB.operationB();
    }

    public void operation2() {
        System.out.println("Facade operation2");
        subsystemB.operationB();
        subsystemC.operationC();
    }
}

// Client code
public class Main {
    public static void main(String[] args) {
        Facade facade = new Facade();
        facade.operation1();
        facade.operation2();
    }
}
```

### Advantages and disadvantages of the Facade pattern

#### Advantages
- Simplifies client calls and reduces coupling between the client and the subsystem.
- By introducing the Facade pattern, changes to subsystem components can be hidden from clients, so that internal changes to subsystem components do not affect the clients that call them.
- The facade class encapsulates the subsystem classes' interfaces, making them easier to use.

#### Disadvantages
- Adds an extra layer, which increases system complexity to some extent.
- If poorly designed, it may increase dependencies between system classes, making the subsystem harder to reuse independently.

The Facade pattern is particularly well suited for simplifying calls, decoupling, and shielding internal changes in complex systems. In practice, it is commonly used to build higher-level interfaces that provide a simple, unified interface over underlying complex operations.

## Sources

- [S1] The GoF structural patterns catalog (Chapter 4), the original source of this pattern.
- [Wikipedia · Facade pattern](https://en.wikipedia.org/wiki/Facade_pattern)
- [Refactoring.Guru · Facade](https://refactoring.guru/design-patterns/facade)

<!-- BACKLINKS-AUTO -->
## Related pages

- [god-object](/anti-patterns/god-object.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
- [overview](overview.md)
- [remote-facade](remote-facade.md)
- [remote-proxy](remote-proxy.md)
