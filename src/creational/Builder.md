# 建造者模式

建造者模式（Builder Pattern）是一种创建型设计模式，旨在将一个复杂对象的构建过程与其表示分离，使得同样的构建过程可以创建不同的表示。它主要用于创建复杂的对象，将对象的创建过程抽象为一个接口，使具体的创建过程实现细节隐藏在具体的建造者中。

### 建造者模式的使用场景
- 当创建复杂对象的算法应该独立于该对象的组成部分以及它们的装配方式时。
- 当构造过程必须允许被构造的对象有不同的表示时。

### 建造者模式的结构
- **Builder**：为创建一个产品对象的各个部件指定抽象接口。
- **ConcreteBuilder**：实现Builder接口，构造和装配各个部件。
- **Director**：构造一个使用Builder接口的对象。
- **Product**：表示被构造的复杂对象。ConcreteBuilder创建该产品的内部表示并定义它的装配过程。

### 示例代码

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
    ~ConcreteBuilder() { delete product; }
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
    Product* product = builder.getResult();
    product->showProduct();
    delete product;
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

这些例子展示了如何在 C++、Go 和 Java 中实现建造者模式。每个例子都定义了产品、抽象建造者、具体建造者和指挥者，并演示了如何使用这些组件来创建复杂对象。