# Decorator

The Decorator Pattern is a structural design pattern that allows new functionality to be added to an existing object without changing its structure. The Decorator pattern wraps the original class in a decorator class and enhances or changes the object's behavior while keeping the class interface intact.

### Use cases
- You need to dynamically add functionality to an object without modifying the original class file and without using inheritance.
- You need to extend the functionality of a group of sibling classes.

### Structure
- **Component**: Defines an object interface; responsibilities can be dynamically added to these objects.
- **ConcreteComponent**: Defines a concrete object; some responsibilities can also be added to this object.
- **Decorator**: An abstract decorator class that extends Component, used to extend the functionality of Component from the outside. The Component does not need to know that a Decorator exists.
- **ConcreteDecorator**: A concrete decorator object that adds responsibilities to Component.

### Example code

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

// Client code
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

These examples show how to implement the Decorator pattern in C++, Go, and Java. Each example defines a base component interface and a concrete component class, and then uses decorator classes to dynamically add functionality while keeping the component interface intact.

## Sources

- [S1] The GoF structural patterns catalog (Chapter 4), the original source of this pattern.
- [Wikipedia · Decorator pattern](https://en.wikipedia.org/wiki/Decorator_pattern)
- [Refactoring.Guru · Decorator](https://refactoring.guru/design-patterns/decorator)

<!-- BACKLINKS-AUTO -->
## Related pages

- [circuit-breaker](/evolution/circuit-breaker.md)
- [composition-over-inheritance](/evolution/composition-over-inheritance.md)
- [overview](/evolution/overview.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
- [overview](overview.md)
