# 原型模式

原型模式（Prototype Pattern）是一种创建型设计模式，允许一个对象创建另一个对象，而不需要知道如何创建的细节。它通过复制（克隆）现有的对象来生成新对象，提供了一种快速创建对象的方法，尤其是在创建对象的代价较高时非常有用。

### 原型模式的使用场景
- 当一个系统应该独立于其产品创建、组合和表示时。
- 当要实例化的类是在运行时指定时，例如通过动态加载。
- 为了避免创建一个与产品类层次平行的工厂类层次时。
- 当一个类的实例只能有几个不同状态组合中的一种时。

### 原型模式的结构
- **Prototype**：声明一个克隆自身的接口。
- **ConcretePrototype**：实现一个克隆自身的操作。
- **Client**：通过调用原型对象的克隆操作来创建一个新的对象。

### 示例代码

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

这些例子展示了如何在 C++、Go 和 Java 中实现原型模式。每个例子都定义了一个原型接口及其具体实现，并通过工厂类来管理和克隆这些原型实例。