# 抽象工厂模式
抽象工厂模式（Abstract Factory Pattern）是一种创建型设计模式，它提供了一种方法来封装一组具有相同主题的单个工厂类，而无需指定其具体类。抽象工厂模式允许客户端使用抽象接口来创建一系列相关或依赖的对象，而无需指定它们的具体实现类。

### 抽象工厂模式的使用场景
- 当系统要独立于其产品的创建、组合和表示时。
- 当系统要由多个产品系列中的一个来配置时。
- 当构造类的实例只能由某个工厂中的一个类完成时。
- 当你希望通过定义类来设计一个产品类的库，并希望将产品类的实例化延迟到子类中。

### 抽象工厂模式的结构
- **AbstractFactory**：声明一个创建抽象产品对象的操作接口。
- **ConcreteFactory**：实现创建具体产品对象的操作。
- **AbstractProduct**：为一类产品对象声明一个接口。
- **ConcreteProduct**：定义一个将被相应的具体工厂创建的产品对象， 实现 `AbstractProduct` 接口。
- **Client**：仅使用由 `AbstractFactory` 和 `AbstractProduct` 类声明的接口。

### 示例代码

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

这些例子展示了如何在 C++、Go 和 Java 中实现抽象工厂模式。每个例子都定义了抽象产品、具体产品、抽象工厂和具体工厂，并演示了如何使用这些工厂来创建不同的产品对象。