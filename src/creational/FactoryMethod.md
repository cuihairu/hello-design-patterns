# 工厂方法模式
工厂方法模式（Factory Method Pattern）是一种创建型设计模式，它提供了一种将对象的实例化延迟到子类的方式，从而实现了解耦和代码的可扩展性。

### 工厂方法模式的组成

1. **抽象产品（Product）**：定义了产品的接口或抽象类。
2. **具体产品（ConcreteProduct）**：实现了抽象产品接口的具体类。
3. **抽象工厂（Creator）**：声明了工厂方法，返回一个抽象产品。
4. **具体工厂（ConcreteCreator）**：实现了工厂方法，返回具体产品实例。

### 使用场景

1. 当一个类无法预期它所必须创建的对象的类时。
2. 当一个类希望由它的子类来指定它所创建的对象时。
3. 当类将创建对象的职责委托给多个帮助子类中的某一个，并且希望将哪一个帮助子类是代理者这一信息局部化时。

### 示例代码

#### Java 实现

**产品接口：**

```java
public interface Product {
    void use();
}
```

**具体产品类：**

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

**抽象工厂类：**

```java
public abstract class Creator {
    public abstract Product factoryMethod();
    
    public void useProduct() {
        Product product = factoryMethod();
        product.use();
    }
}
```

**具体工厂类：**

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

**客户端代码：**

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

#### Go 实现

**产品接口：**

```go
package main

import "fmt"

type Product interface {
    Use()
}
```

**具体产品类：**

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

**抽象工厂类：**

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

**具体工厂类：**

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

**客户端代码：**

```go
package main

func main() {
    creatorA := &ConcreteCreatorA{}
    UseProduct(creatorA)

    creatorB := &ConcreteCreatorB{}
    UseProduct(creatorB)
}
```

### 总结

工厂方法模式通过定义一个创建对象的接口，让子类决定实例化哪一个类，从而实现了对象创建的解耦和扩展。这种模式非常适合需要生成复杂对象或者需要灵活选择生成对象的场景。