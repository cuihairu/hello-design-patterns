# Factory Method
The Factory Method Pattern is a creational design pattern that provides a way to defer the instantiation of objects to subclasses, thereby achieving decoupling and code extensibility.

### Components of the Factory Method Pattern

1. **Product**: Defines the interface or abstract class of the product.
2. **ConcreteProduct**: A concrete class that implements the Product interface.
3. **Creator**: Declares the factory method, which returns a Product.
4. **ConcreteCreator**: Implements the factory method and returns a ConcreteProduct instance.

### Use cases

1. When a class cannot anticipate the classes of objects it must create.
2. When a class wants its subclasses to specify the objects it creates.
3. When a class delegates the responsibility of creating objects to one of several helper subclasses, and wants to localize which helper subclass is the delegate.

### Sample code

#### Java Implementation

**Product interface:**

```java
public interface Product {
    void use();
}
```

**Concrete product classes:**

```java
public class ConcreteProductA implements Product {
    @Override
    public void use() {
        System.out.println("Using Product A");
    }
}

public class ConcreteProductB implements Product {
    @Override
    public void use() {
        System.out.println("Using Product B");
    }
}
```

**Abstract factory class:**

```java
public abstract class Creator {
    public abstract Product factoryMethod();
    
    public void useProduct() {
        Product product = factoryMethod();
        product.use();
    }
}
```

**Concrete factory classes:**

```java
public class ConcreteCreatorA extends Creator {
    @Override
    public Product factoryMethod() {
        return new ConcreteProductA();
    }
}

public class ConcreteCreatorB extends Creator {
    @Override
    public Product factoryMethod() {
        return new ConcreteProductB();
    }
}
```

**Client code:**

```java
public class Client {
    public static void main(String[] args) {
        Creator creatorA = new ConcreteCreatorA();
        creatorA.useProduct();

        Creator creatorB = new ConcreteCreatorB();
        creatorB.useProduct();
    }
}
```

#### Go Implementation

**Product interface:**

```go
package main

import "fmt"

type Product interface {
    Use()
}
```

**Concrete product classes:**

```go
package main

import "fmt"

type ConcreteProductA struct{}

func (p *ConcreteProductA) Use() {
    fmt.Println("Using Product A")
}

type ConcreteProductB struct{}

func (p *ConcreteProductB) Use() {
    fmt.Println("Using Product B")
}
```

**Abstract factory class:**

```go
package main

type Creator interface {
    FactoryMethod() Product
}

func UseProduct(c Creator) {
    product := c.FactoryMethod()
    product.Use()
}
```

**Concrete factory classes:**

```go
package main

type ConcreteCreatorA struct{}

func (c *ConcreteCreatorA) FactoryMethod() Product {
    return &ConcreteProductA{}
}

type ConcreteCreatorB struct{}

func (c *ConcreteCreatorB) FactoryMethod() Product {
    return &ConcreteProductB{}
}
```

**Client code:**

```go
package main

func main() {
    creatorA := &ConcreteCreatorA{}
    UseProduct(creatorA)

    creatorB := &ConcreteCreatorB{}
    UseProduct(creatorB)
}
```

### Summary

The Factory Method Pattern defines an interface for creating objects, letting subclasses decide which class to instantiate, thereby decoupling and extending object creation. This pattern is well suited to scenarios that require creating complex objects or that need flexible choices about which objects to create.

## Sources

- [S1] GoF creational catalog (Chapter 3), the original source of this pattern.
- [Wikipedia · Factory method pattern](https://en.wikipedia.org/wiki/Factory_method_pattern)
- [Refactoring.Guru · Factory Method](https://refactoring.guru/design-patterns/factory-method)

<!-- BACKLINKS-AUTO -->
## Related pages

- [anemic-domain-model](/anti-patterns/anemic-domain-model.md)
- [overview](overview.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
