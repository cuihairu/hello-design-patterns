# Abstract Factory
The Abstract Factory Pattern is a creational design pattern that provides a way to encapsulate a set of factory classes with the same theme without specifying their concrete classes. It allows clients to create families of related or interdependent objects through abstract interfaces, without needing to specify their concrete implementation classes.

### Use cases of the Abstract Factory Pattern
- When the system should be independent of how its products are created, assembled, and represented.
- When the system should be configured with one of several families of products.
- When instances of construction classes can only be created by one of several factory classes.
- When you want to design a library of product classes and defer their instantiation to subclasses.

### Structure of the Abstract Factory Pattern
- **AbstractFactory**: Declares an interface for operations that create abstract product objects.
- **ConcreteFactory**: Implements the operations that create concrete product objects.
- **AbstractProduct**: Declares an interface for a type of product object.
- **ConcreteProduct**: Defines a product object that will be created by the corresponding ConcreteFactory, implementing the `AbstractProduct` interface.
- **Client**: Uses only the interfaces declared by the `AbstractFactory` and `AbstractProduct` classes.

### Sample code

#### C++
```cpp
#include <iostream>
#include <string>

// Abstract Product A
class AbstractProductA {
public:
    virtual std::string getName() const = 0;
};

// Concrete Product A1
class ProductA1 : public AbstractProductA {
public:
    std::string getName() const override {
        return "ProductA1";
    }
};

// Concrete Product A2
class ProductA2 : public AbstractProductA {
public:
    std::string getName() const override {
        return "ProductA2";
    }
};

// Abstract Product B
class AbstractProductB {
public:
    virtual std::string getName() const = 0;
};

// Concrete Product B1
class ProductB1 : public AbstractProductB {
public:
    std::string getName() const override {
        return "ProductB1";
    }
};

// Concrete Product B2
class ProductB2 : public AbstractProductB {
public:
    std::string getName() const override {
        return "ProductB2";
    }
};

// Abstract Factory
class AbstractFactory {
public:
    virtual AbstractProductA* createProductA() const = 0;
    virtual AbstractProductB* createProductB() const = 0;
};

// Concrete Factory 1
class ConcreteFactory1 : public AbstractFactory {
public:
    AbstractProductA* createProductA() const override {
        return new ProductA1();
    }
    AbstractProductB* createProductB() const override {
        return new ProductB1();
    }
};

// Concrete Factory 2
class ConcreteFactory2 : public AbstractFactory {
public:
    AbstractProductA* createProductA() const override {
        return new ProductA2();
    }
    AbstractProductB* createProductB() const override {
        return new ProductB2();
    }
};

int main() {
    AbstractFactory* factory1 = new ConcreteFactory1();
    AbstractProductA* productA1 = factory1->createProductA();
    AbstractProductB* productB1 = factory1->createProductB();
    std::cout << productA1->getName() << " and " << productB1->getName() << std::endl;

    AbstractFactory* factory2 = new ConcreteFactory2();
    AbstractProductA* productA2 = factory2->createProductA();
    AbstractProductB* productB2 = factory2->createProductB();
    std::cout << productA2->getName() << " and " << productB2->getName() << std::endl;

    delete productA1;
    delete productB1;
    delete productA2;
    delete productB2;
    delete factory1;
    delete factory2;
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Abstract Product A
type AbstractProductA interface {
    GetName() string
}

// Concrete Product A1
type ProductA1 struct{}

func (p *ProductA1) GetName() string {
    return "ProductA1"
}

// Concrete Product A2
type ProductA2 struct{}

func (p *ProductA2) GetName() string {
    return "ProductA2"
}

// Abstract Product B
type AbstractProductB interface {
    GetName() string
}

// Concrete Product B1
type ProductB1 struct{}

func (p *ProductB1) GetName() string {
    return "ProductB1"
}

// Concrete Product B2
type ProductB2 struct{}

func (p *ProductB2) GetName() string {
    return "ProductB2"
}

// Abstract Factory
type AbstractFactory interface {
    CreateProductA() AbstractProductA
    CreateProductB() AbstractProductB
}

// Concrete Factory 1
type ConcreteFactory1 struct{}

func (f *ConcreteFactory1) CreateProductA() AbstractProductA {
    return &ProductA1{}
}

func (f *ConcreteFactory1) CreateProductB() AbstractProductB {
    return &ProductB1{}
}

// Concrete Factory 2
type ConcreteFactory2 struct{}

func (f *ConcreteFactory2) CreateProductA() AbstractProductA {
    return &ProductA2{}
}

func (f *ConcreteFactory2) CreateProductB() AbstractProductB {
    return &ProductB2{}
}

func main() {
    factory1 := &ConcreteFactory1{}
    productA1 := factory1.CreateProductA()
    productB1 := factory1.CreateProductB()
    fmt.Println(productA1.GetName(), "and", productB1.GetName())

    factory2 := &ConcreteFactory2{}
    productA2 := factory2.CreateProductA()
    productB2 := factory2.CreateProductB()
    fmt.Println(productA2.GetName(), "and", productB2.GetName())
}
```

#### Java
```java
// Abstract Product A
interface AbstractProductA {
    String getName();
}

// Concrete Product A1
class ProductA1 implements AbstractProductA {
    public String getName() {
        return "ProductA1";
    }
}

// Concrete Product A2
class ProductA2 implements AbstractProductA {
    public String getName() {
        return "ProductA2";
    }
}

// Abstract Product B
interface AbstractProductB {
    String getName();
}

// Concrete Product B1
class ProductB1 implements AbstractProductB {
    public String getName() {
        return "ProductB1";
    }
}

// Concrete Product B2
class ProductB2 implements AbstractProductB {
    public String getName() {
        return "ProductB2";
    }
}

// Abstract Factory
interface AbstractFactory {
    AbstractProductA createProductA();
    AbstractProductB createProductB();
}

// Concrete Factory 1
class ConcreteFactory1 implements AbstractFactory {
    public AbstractProductA createProductA() {
        return new ProductA1();
    }
    public AbstractProductB createProductB() {
        return new ProductB1();
    }
}

// Concrete Factory 2
class ConcreteFactory2 implements AbstractFactory {
    public AbstractProductA createProductA() {
        return new ProductA2();
    }
    public AbstractProductB createProductB() {
        return new ProductB2();
    }
}

public class Main {
    public static void main(String[] args) {
        AbstractFactory factory1 = new ConcreteFactory1();
        AbstractProductA productA1 = factory1.createProductA();
        AbstractProductB productB1 = factory1.createProductB();
        System.out.println(productA1.getName() + " and " + productB1.getName());

        AbstractFactory factory2 = new ConcreteFactory2();
        AbstractProductA productA2 = factory2.createProductA();
        AbstractProductB productB2 = factory2.createProductB();
        System.out.println(productA2.getName() + " and " + productB2.getName());
    }
}
```

These examples show how to implement the Abstract Factory Pattern in C++, Go, and Java. Each example defines abstract products, concrete products, an abstract factory, and concrete factories, and demonstrates how to use these factories to create different product objects.

## Sources

- [S1] GoF creational catalog (Chapter 3), the original source of this pattern.
- [Wikipedia · Abstract factory pattern](https://en.wikipedia.org/wiki/Abstract_factory_pattern)
- [Refactoring.Guru · Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
