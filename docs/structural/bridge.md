# 桥接模式

桥接模式（Bridge Pattern）是一种结构型设计模式，它通过分离抽象部分和实现部分，使它们可以独立变化。桥接模式的核心思想是将抽象部分和实现部分分离开来，使它们可以独立地变化和扩展，而不会相互影响。桥接模式通过组合而不是继承来解决问题，从而避免了继承层次结构的复杂性。

### 使用场景
- 当一个对象有多个维度的变化（例如颜色和形状），并且需要独立地变化时。
- 避免类的继承层次结构过于庞大，导致系统复杂难以维护。
- 需要跨多个平台实现时，通过桥接模式可以避免平台之间的耦合。

### 结构
- **Abstraction**：定义抽象的接口，并维护一个实现 `Implementor` 的引用。
- **RefinedAbstraction**：扩展抽象接口，添加新的操作。
- **Implementor**：定义实现的接口，具体的实现类需要实现该接口。
- **ConcreteImplementor**：具体的实现类，实现 `Implementor` 接口。

### 示例代码

#### C++
```cpp
#include <iostream>

// Implementor
class Implementor {
public:
    virtual void operationImpl() const = 0;
    virtual ~Implementor() = default;
};

// ConcreteImplementorA
class ConcreteImplementorA : public Implementor {
public:
    void operationImpl() const override {
        std::cout << "ConcreteImplementorA: operationImpl.\n";
    }
};

// ConcreteImplementorB
class ConcreteImplementorB : public Implementor {
public:
    void operationImpl() const override {
        std::cout << "ConcreteImplementorB: operationImpl.\n";
    }
};

// Abstraction
class Abstraction {
protected:
    Implementor* implementor;

public:
    Abstraction(Implementor* impl) : implementor(impl) {}

    virtual void operation() const {
        implementor->operationImpl();
    }

    virtual ~Abstraction() = default;
};

// RefinedAbstraction
class RefinedAbstraction : public Abstraction {
public:
    RefinedAbstraction(Implementor* impl) : Abstraction(impl) {}

    void operation() const override {
        std::cout << "RefinedAbstraction: operation with ";
        implementor->operationImpl();
    }
};

int main() {
    Implementor* implA = new ConcreteImplementorA();
    Abstraction* abstractionA = new RefinedAbstraction(implA);
    abstractionA->operation();

    Implementor* implB = new ConcreteImplementorB();
    Abstraction* abstractionB = new RefinedAbstraction(implB);
    abstractionB->operation();

    delete abstractionA;
    delete implA;
    delete abstractionB;
    delete implB;
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Implementor
type Implementor interface {
    OperationImpl()
}

// ConcreteImplementorA
type ConcreteImplementorA struct{}

func (c *ConcreteImplementorA) OperationImpl() {
    fmt.Println("ConcreteImplementorA: OperationImpl")
}

// ConcreteImplementorB
type ConcreteImplementorB struct{}

func (c *ConcreteImplementorB) OperationImpl() {
    fmt.Println("ConcreteImplementorB: OperationImpl")
}

// Abstraction
type Abstraction struct {
    impl Implementor
}

func (a *Abstraction) Operation() {
    a.impl.OperationImpl()
}

// RefinedAbstraction
type RefinedAbstraction struct {
    Abstraction
}

func (r *RefinedAbstraction) Operation() {
    fmt.Print("RefinedAbstraction: Operation with ")
    r.impl.OperationImpl()
}

func main() {
    implA := &ConcreteImplementorA{}
    abstractionA := &RefinedAbstraction{Abstraction{implA}}
    abstractionA.Operation()

    implB := &ConcreteImplementorB{}
    abstractionB := &RefinedAbstraction{Abstraction{implB}}
    abstractionB.Operation()
}
```

#### Java
```java
// Implementor
interface Implementor {
    void operationImpl();
}

// ConcreteImplementorA
class ConcreteImplementorA implements Implementor {
    public void operationImpl() {
        System.out.println("ConcreteImplementorA: operationImpl.");
    }
}

// ConcreteImplementorB
class ConcreteImplementorB implements Implementor {
    public void operationImpl() {
        System.out.println("ConcreteImplementorB: operationImpl.");
    }
}

// Abstraction
abstract class Abstraction {
    protected Implementor implementor;

    protected Abstraction(Implementor impl) {
        this.implementor = impl;
    }

    public abstract void operation();
}

// RefinedAbstraction
class RefinedAbstraction extends Abstraction {
    public RefinedAbstraction(Implementor impl) {
        super(impl);
    }

    public void operation() {
        System.out.print("RefinedAbstraction: operation with ");
        implementor.operationImpl();
    }
}

// 客户端代码
public class Main {
    public static void main(String[] args) {
        Implementor implA = new ConcreteImplementorA();
        Abstraction abstractionA = new RefinedAbstraction(implA);
        abstractionA.operation();

        Implementor implB = new ConcreteImplementorB();
        Abstraction abstractionB = new RefinedAbstraction(implB);
        abstractionB.operation();
    }
}
```

这些示例展示了在 C++、Go 和 Java 中如何实现桥接模式。在每个例子中，抽象部分和实现部分通过组合关系分离，具体实现类（ConcreteImplementor）实现了 `Implementor` 接口，抽象类（Abstraction）维护了一个实现 `Implementor` 接口的引用。具体的操作在 `RefinedAbstraction` 类中定义，从而实现了抽象和实现的分离，使它们可以独立地变化。