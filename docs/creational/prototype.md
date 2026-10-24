# Prototype

The Prototype Pattern is a creational design pattern that allows one object to create another object without knowing the details of how to create it. It generates new objects by copying (cloning) existing ones, providing a fast way to create objects — especially useful when creating objects is expensive.

### Use cases of the Prototype Pattern
- When a system should be independent of how its products are created, composed, and represented.
- When the class to instantiate is specified at run time, for example through dynamic loading.
- To avoid building a hierarchy of factory classes parallel to the hierarchy of product classes.
- When instances of a class can have only one of a few different combinations of states.

### Structure of the Prototype Pattern
- **Prototype**: declares an interface for cloning itself.
- **ConcretePrototype**: implements an operation for cloning itself.
- **Client**: creates a new object by calling the clone operation on a prototype object.

### Example code

#### C++
```cpp
#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>

// Prototype
class Prototype {
public:
    virtual ~Prototype() {}
    virtual std::unique_ptr<Prototype> clone() const = 0;
    virtual void show() const = 0;
};

// Concrete Prototype
class ConcretePrototype : public Prototype {
public:
    ConcretePrototype(const std::string& name) : name_(name) {}
    std::unique_ptr<Prototype> clone() const override {
        return std::make_unique<ConcretePrototype>(*this);
    }
    void show() const override {
        std::cout << "ConcretePrototype: " << name_ << std::endl;
    }

private:
    std::string name_;
};

// Client
class PrototypeFactory {
public:
    void registerPrototype(const std::string& key, std::unique_ptr<Prototype> prototype) {
        prototypes_[key] = std::move(prototype);
    }

    std::unique_ptr<Prototype> createPrototype(const std::string& key) {
        return prototypes_[key]->clone();
    }

private:
    std::unordered_map<std::string, std::unique_ptr<Prototype>> prototypes_;
};

int main() {
    PrototypeFactory factory;

    // Register prototypes
    factory.registerPrototype("A", std::make_unique<ConcretePrototype>("PrototypeA"));
    factory.registerPrototype("B", std::make_unique<ConcretePrototype>("PrototypeB"));

    // Create clones
    auto prototypeA = factory.createPrototype("A");
    prototypeA->show();

    auto prototypeB = factory.createPrototype("B");
    prototypeB->show();

    return 0;
}
```

#### Go
```go
package main

import (
    "fmt"
)

// Prototype interface
type Prototype interface {
    Clone() Prototype
    Show()
}

// Concrete Prototype
type ConcretePrototype struct {
    name string
}

func (p *ConcretePrototype) Clone() Prototype {
    return &ConcretePrototype{name: p.name}
}

func (p *ConcretePrototype) Show() {
    fmt.Println("ConcretePrototype:", p.name)
}

// Prototype Factory
type PrototypeFactory struct {
    prototypes map[string]Prototype
}

func NewPrototypeFactory() *PrototypeFactory {
    return &PrototypeFactory{prototypes: make(map[string]Prototype)}
}

func (f *PrototypeFactory) RegisterPrototype(key string, prototype Prototype) {
    f.prototypes[key] = prototype
}

func (f *PrototypeFactory) CreatePrototype(key string) Prototype {
    return f.prototypes[key].Clone()
}

func main() {
    factory := NewPrototypeFactory()

    // Register prototypes
    factory.RegisterPrototype("A", &ConcretePrototype{name: "PrototypeA"})
    factory.RegisterPrototype("B", &ConcretePrototype{name: "PrototypeB"})

    // Create clones
    prototypeA := factory.CreatePrototype("A")
    prototypeA.Show()

    prototypeB := factory.CreatePrototype("B")
    prototypeB.Show()
}
```

#### Java
```java
import java.util.HashMap;
import java.util.Map;

// Prototype
abstract class Prototype implements Cloneable {
    public Prototype clone() throws CloneNotSupportedException {
        return (Prototype) super.clone();
    }

    public abstract void show();
}

// Concrete Prototype
class ConcretePrototype extends Prototype {
    private String name;

    public ConcretePrototype(String name) {
        this.name = name;
    }

    @Override
    public void show() {
        System.out.println("ConcretePrototype: " + name);
    }
}

// Prototype Factory
class PrototypeFactory {
    private Map<String, Prototype> prototypes = new HashMap<>();

    public void registerPrototype(String key, Prototype prototype) {
        prototypes.put(key, prototype);
    }

    public Prototype createPrototype(String key) throws CloneNotSupportedException {
        return prototypes.get(key).clone();
    }
}

public class Main {
    public static void main(String[] args) throws CloneNotSupportedException {
        PrototypeFactory factory = new PrototypeFactory();

        // Register prototypes
        factory.registerPrototype("A", new ConcretePrototype("PrototypeA"));
        factory.registerPrototype("B", new ConcretePrototype("PrototypeB"));

        // Create clones
        Prototype prototypeA = factory.createPrototype("A");
        prototypeA.show();

        Prototype prototypeB = factory.createPrototype("B");
        prototypeB.show();
    }
}
```

These examples show how to implement the Prototype Pattern in C++, Go, and Java. Each example defines a prototype interface and its concrete implementation, and uses a factory class to manage and clone these prototype instances.

## Sources

- [S1] The GoF creational catalog (Chapter 3), the original source of this pattern.
- [Wikipedia · Prototype pattern](https://en.wikipedia.org/wiki/Prototype_pattern)
- [Refactoring.Guru · Prototype](https://refactoring.guru/design-patterns/prototype)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
