# Builder

The Builder Pattern is a creational design pattern aimed at separating the construction process of a complex object from its representation, so that the same construction process can create different representations. It is primarily used to create complex objects by abstracting the object creation process into an interface, with the specific creation details hidden within the concrete builder.

### Use cases of the Builder Pattern
- When the algorithm for creating a complex object should be independent of the object's components and how they are assembled.
- When the construction process must allow the constructed object to have different representations.

### Structure of the Builder Pattern
- **Builder**: Specifies an abstract interface for creating the parts of a Product object.
- **ConcreteBuilder**: Implements the Builder interface, constructing and assembling each part.
- **Director**: Constructs an object that uses the Builder interface.
- **Product**: Represents the complex object being constructed. ConcreteBuilder creates the internal representation of the product and defines its assembly process.

### Sample code

#### C++
```cpp
#include <iostream>
#include <string>

// Product
class Product {
public:
    void setPartA(const std::string& part) { partA = part; }
    void setPartB(const std::string& part) { partB = part; }
    void setPartC(const std::string& part) { partC = part; }
    void showProduct() {
        std::cout << "Product Parts: " << partA << ", " << partB << ", " << partC << std::endl;
    }

private:
    std::string partA;
    std::string partB;
    std::string partC;
};

// Abstract Builder
class Builder {
public:
    virtual ~Builder() {}
    virtual void buildPartA() = 0;
    virtual void buildPartB() = 0;
    virtual void buildPartC() = 0;
    virtual Product* getResult() = 0;
};

// Concrete Builder
class ConcreteBuilder : public Builder {
public:
    ConcreteBuilder() { product = new Product(); }
    // The Builder owns the Product; it is released uniformly in the destructor. Clients must not delete the pointer returned by getResult()
    ~ConcreteBuilder() override { delete product; }
    void buildPartA() override { product->setPartA("PartA1"); }
    void buildPartB() override { product->setPartB("PartB1"); }
    void buildPartC() override { product->setPartC("PartC1"); }
    Product* getResult() override { return product; }

private:
    Product* product;
};

// Director
class Director {
public:
    void setBuilder(Builder* b) { builder = b; }
    void construct() {
        builder->buildPartA();
        builder->buildPartB();
        builder->buildPartC();
    }

private:
    Builder* builder;
};

int main() {
    Director director;
    ConcreteBuilder builder;
    director.setBuilder(&builder);
    director.construct();
    Product* product = builder.getResult(); // Ownership still belongs to the builder, which releases it in its destructor
    product->showProduct();
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Product
type Product struct {
    PartA string
    PartB string
    PartC string
}

func (p *Product) ShowProduct() {
    fmt.Println("Product Parts:", p.PartA, p.PartB, p.PartC)
}

// Builder interface
type Builder interface {
    BuildPartA()
    BuildPartB()
    BuildPartC()
    GetResult() *Product
}

// Concrete Builder
type ConcreteBuilder struct {
    product *Product
}

func NewConcreteBuilder() *ConcreteBuilder {
    return &ConcreteBuilder{product: &Product{}}
}

func (b *ConcreteBuilder) BuildPartA() {
    b.product.PartA = "PartA1"
}

func (b *ConcreteBuilder) BuildPartB() {
    b.product.PartB = "PartB1"
}

func (b *ConcreteBuilder) BuildPartC() {
    b.product.PartC = "PartC1"
}

func (b *ConcreteBuilder) GetResult() *Product {
    return b.product
}

// Director
type Director struct {
    builder Builder
}

func (d *Director) SetBuilder(b Builder) {
    d.builder = b
}

func (d *Director) Construct() {
    d.builder.BuildPartA()
    d.builder.BuildPartB()
    d.builder.BuildPartC()
}

func main() {
    director := &Director{}
    builder := NewConcreteBuilder()
    director.SetBuilder(builder)
    director.Construct()
    product := builder.GetResult()
    product.ShowProduct()
}
```

#### Java
```java
// Product
class Product {
    private String partA;
    private String partB;
    private String partC;

    public void setPartA(String partA) { this.partA = partA; }
    public void setPartB(String partB) { this.partB = partB; }
    public void setPartC(String partC) { this.partC = partC; }

    public void showProduct() {
        System.out.println("Product Parts: " + partA + ", " + partB + ", " + partC);
    }
}

// Abstract Builder
abstract class Builder {
    protected Product product = new Product();

    public abstract void buildPartA();
    public abstract void buildPartB();
    public abstract void buildPartC();
    public Product getResult() { return product; }
}

// Concrete Builder
class ConcreteBuilder extends Builder {
    public void buildPartA() { product.setPartA("PartA1"); }
    public void buildPartB() { product.setPartB("PartB1"); }
    public void buildPartC() { product.setPartC("PartC1"); }
}

// Director
class Director {
    private Builder builder;

    public void setBuilder(Builder builder) { this.builder = builder; }
    public void construct() {
        builder.buildPartA();
        builder.buildPartB();
        builder.buildPartC();
    }
}

public class Main {
    public static void main(String[] args) {
        Director director = new Director();
        ConcreteBuilder builder = new ConcreteBuilder();
        director.setBuilder(builder);
        director.construct();
        Product product = builder.getResult();
        product.showProduct();
    }
}
```

These examples show how to implement the Builder Pattern in C++, Go, and Java. Each example defines a product, an abstract builder, a concrete builder, and a director, and demonstrates how to use these components to create complex objects.

## Sources

- [S1] GoF creational catalog (Chapter 3), the original source of this pattern.
- [Wikipedia · Builder pattern](https://en.wikipedia.org/wiki/Builder_pattern)
- [Refactoring.Guru · Builder](https://refactoring.guru/design-patterns/builder)

<!-- BACKLINKS-AUTO -->
## Related pages

- [anemic-domain-model](/anti-patterns/anemic-domain-model.md)
- [overview](overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
