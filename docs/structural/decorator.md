# 装饰模式

装饰模式（Decorator Pattern）是一种结构型设计模式，它允许向一个现有的对象添加新的功能，同时又不改变其结构。装饰模式通过创建一个装饰类来包裹原始类，并在保持类接口完整的前提下增强或改变对象的行为。

### 使用场景
- 需要在不改变原类文件和不使用继承的情况下，动态地为一个对象添加功能。
- 需要为一批兄弟类进行功能的扩展。

### 结构
- **Component**：定义一个对象接口，可以给这些对象动态地添加职责。
- **ConcreteComponent**：定义一个具体的对象，也可以给这个对象添加一些职责。
- **Decorator**：装饰抽象类，继承了 Component，从外类来扩展 Component 类的功能，但对于 Component 来说，是无需知道 Decorator 的存在的。
- **ConcreteDecorator**：具体的装饰对象，起到给 Component 添加职责的功能。

### 示例代码

#### C++
```cpp
#include <iostream>
#include <string>

// Component
class Coffee {
public:
    virtual ~Coffee() {}
    virtual std::string description() const = 0;
    virtual double cost() const = 0;
};

// ConcreteComponent
class SimpleCoffee : public Coffee {
public:
    std::string description() const override {
        return "Simple coffee";
    }

    double cost() const override {
        return 5.0;
    }
};

// Decorator
class CoffeeDecorator : public Coffee {
protected:
    Coffee* decoratedCoffee;

public:
    CoffeeDecorator(Coffee* coffee) : decoratedCoffee(coffee) {}

    virtual ~CoffeeDecorator() {
        delete decoratedCoffee;
    }

    std::string description() const override {
        return decoratedCoffee->description();
    }

    double cost() const override {
        return decoratedCoffee->cost();
    }
};

// ConcreteDecorator
class Milk : public CoffeeDecorator {
public:
    Milk(Coffee* coffee) : CoffeeDecorator(coffee) {}

    std::string description() const override {
        return decoratedCoffee->description() + ", milk";
    }

    double cost() const override {
        return decoratedCoffee->cost() + 1.5;
    }
};

// ConcreteDecorator
class Sugar : public CoffeeDecorator {
public:
    Sugar(Coffee* coffee) : CoffeeDecorator(coffee) {}

    std::string description() const override {
        return decoratedCoffee->description() + ", sugar";
    }

    double cost() const override {
        return decoratedCoffee->cost() + 0.5;
    }
};

int main() {
    Coffee* myCoffee = new SimpleCoffee();
    std::cout << myCoffee->description() << " $" << myCoffee->cost() << std::endl;

    myCoffee = new Milk(myCoffee);
    std::cout << myCoffee->description() << " $" << myCoffee->cost() << std::endl;

    myCoffee = new Sugar(myCoffee);
    std::cout << myCoffee->description() << " $" << myCoffee->cost() << std::endl;

    delete myCoffee;
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Component
type Coffee interface {
    Description() string
    Cost() float64
}

// ConcreteComponent
type SimpleCoffee struct{}

func (c *SimpleCoffee) Description() string {
    return "Simple coffee"
}

func (c *SimpleCoffee) Cost() float64 {
    return 5.0
}

// Decorator
type CoffeeDecorator struct {
    coffee Coffee
}

func (c *CoffeeDecorator) Description() string {
    return c.coffee.Description()
}

func (c *CoffeeDecorator) Cost() float64 {
    return c.coffee.Cost()
}

// ConcreteDecorator
type Milk struct {
    CoffeeDecorator
}

func NewMilk(coffee Coffee) *Milk {
    return &Milk{CoffeeDecorator{coffee}}
}

func (m *Milk) Description() string {
    return m.coffee.Description() + ", milk"
}

func (m *Milk) Cost() float64 {
    return m.coffee.Cost() + 1.5
}

// ConcreteDecorator
type Sugar struct {
    CoffeeDecorator
}

func NewSugar(coffee Coffee) *Sugar {
    return &Sugar{CoffeeDecorator{coffee}}
}

func (s *Sugar) Description() string {
    return s.coffee.Description() + ", sugar"
}

func (s *Sugar) Cost() float64 {
    return s.coffee.Cost() + 0.5
}

func main() {
    var myCoffee Coffee = &SimpleCoffee{}
    fmt.Println(myCoffee.Description(), "$", myCoffee.Cost())

    myCoffee = NewMilk(myCoffee)
    fmt.Println(myCoffee.Description(), "$", myCoffee.Cost())

    myCoffee = NewSugar(myCoffee)
    fmt.Println(myCoffee.Description(), "$", myCoffee.Cost())
}
```

#### Java
```java
// Component
interface Coffee {
    String description();
    double cost();
}

// ConcreteComponent
class SimpleCoffee implements Coffee {
    @Override
    public String description() {
        return "Simple coffee";
    }

    @Override
    public double cost() {
        return 5.0;
    }
}

// Decorator
class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;

    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }

    @Override
    public String description() {
        return decoratedCoffee.description();
    }

    @Override
    public double cost() {
        return decoratedCoffee.cost();
    }
}

// ConcreteDecorator
class Milk extends CoffeeDecorator {
    public Milk(Coffee coffee) {
        super(coffee);
    }

    @Override
    public String description() {
        return decoratedCoffee.description() + ", milk";
    }

    @Override
    public double cost() {
        return decoratedCoffee.cost() + 1.5;
    }
}

// ConcreteDecorator
class Sugar extends CoffeeDecorator {
    public Sugar(Coffee coffee) {
        super(coffee);
    }

    @Override
    public String description() {
        return decoratedCoffee.description() + ", sugar";
    }

    @Override
    public double cost() {
        return decoratedCoffee.cost() + 0.5;
    }
}

// 客户端代码
public class Main {
    public static void main(String[] args) {
        Coffee myCoffee = new SimpleCoffee();
        System.out.println(myCoffee.description() + " $" + myCoffee.cost());

        myCoffee = new Milk(myCoffee);
        System.out.println(myCoffee.description() + " $" + myCoffee.cost());

        myCoffee = new Sugar(myCoffee);
        System.out.println(myCoffee.description() + " $" + myCoffee.cost());
    }
}
```

这些例子展示了如何在 C++、Go 和 Java 中实现装饰模式。每个例子都定义了一个基础的组件接口和一个具体的组件类，然后通过装饰类来动态地添加功能，同时保持组件接口的完整性。