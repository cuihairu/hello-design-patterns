# 模板方法模式

模板方法模式（Template Method Pattern）是一种行为设计模式，它定义了一个算法的骨架，并允许子类在不改变算法结构的情况下重定义算法的某些步骤。通过这个模式，可以将不变的行为提取到基类中，而将可变的行为延迟到子类中实现。

### 模板方法模式的组成部分

1. **抽象类（Abstract Class）**：定义算法的骨架，并声明一些抽象方法，让子类实现这些方法。
2. **具体类（Concrete Class）**：实现抽象类中的抽象方法，从而完成算法中可变部分的实现。

### 模板方法模式的优点

1. **代码复用**：将通用的代码放在抽象类中，避免重复代码。
2. **易于扩展**：通过新增子类，可以很容易地增加新的行为。
3. **控制反转**：父类调用子类的实现方法，子类不调用父类的实现，符合“好莱坞原则”（Don't call us, we’ll call you）。

### 模板方法模式的缺点

1. **增加类的数量**：每个具体实现都需要一个子类，可能会导致类的数量增加。
2. **继承相关问题**：模板方法模式依赖于继承，子类必须继承自抽象类，这会带来继承相关的问题，如违反里氏替换原则（LSP）。

### 适用场景

1. **具有统一的算法结构，但某些步骤具体实现不同的场景**。
2. **多个子类有公有的方法，并且逻辑基本相同时**。
3. **重构时，可以通过模板方法模式将相似的代码提取到基类中**。

### 示例代码

#### C++ 实现

```cpp
#include <iostream>

class AbstractClass {
public:
    void templateMethod() {
        baseOperation1();
        requiredOperation1();
        baseOperation2();
        requiredOperation2();
        hook();
    }

protected:
    void baseOperation1() {
        std::cout << "AbstractClass: Base Operation 1\n";
    }

    void baseOperation2() {
        std::cout << "AbstractClass: Base Operation 2\n";
    }

    virtual void requiredOperation1() = 0;
    virtual void requiredOperation2() = 0;

    virtual void hook() {}
};

class ConcreteClass1 : public AbstractClass {
protected:
    void requiredOperation1() override {
        std::cout << "ConcreteClass1: Implemented Operation 1\n";
    }

    void requiredOperation2() override {
        std::cout << "ConcreteClass1: Implemented Operation 2\n";
    }
};

class ConcreteClass2 : public AbstractClass {
protected:
    void requiredOperation1() override {
        std::cout << "ConcreteClass2: Implemented Operation 1\n";
    }

    void requiredOperation2() override {
        std::cout << "ConcreteClass2: Implemented Operation 2\n";
    }

    void hook() override {
        std::cout << "ConcreteClass2: Overridden Hook\n";
    }
};

int main() {
    AbstractClass *class1 = new ConcreteClass1();
    AbstractClass *class2 = new ConcreteClass2();

    std::cout << "Template Method in ConcreteClass1:\n";
    class1->templateMethod();

    std::cout << "\nTemplate Method in ConcreteClass2:\n";
    class2->templateMethod();

    delete class1;
    delete class2;
    return 0;
}
```

#### Go 实现

```go
package main

import "fmt"

type AbstractClass interface {
	templateMethod()
	baseOperation1()
	baseOperation2()
	requiredOperation1()
	requiredOperation2()
	hook()
}

type BaseClass struct{}

func (b *BaseClass) templateMethod() {
	b.baseOperation1()
	b.requiredOperation1()
	b.baseOperation2()
	b.requiredOperation2()
	b.hook()
}

func (b *BaseClass) baseOperation1() {
	fmt.Println("AbstractClass: Base Operation 1")
}

func (b *BaseClass) baseOperation2() {
	fmt.Println("AbstractClass: Base Operation 2")
}

func (b *BaseClass) hook() {}

type ConcreteClass1 struct {
	BaseClass
}

func (c *ConcreteClass1) requiredOperation1() {
	fmt.Println("ConcreteClass1: Implemented Operation 1")
}

func (c *ConcreteClass1) requiredOperation2() {
	fmt.Println("ConcreteClass1: Implemented Operation 2")
}

type ConcreteClass2 struct {
	BaseClass
}

func (c *ConcreteClass2) requiredOperation1() {
	fmt.Println("ConcreteClass2: Implemented Operation 1")
}

func (c *ConcreteClass2) requiredOperation2() {
	fmt.Println("ConcreteClass2: Implemented Operation 2")
}

func (c *ConcreteClass2) hook() {
	fmt.Println("ConcreteClass2: Overridden Hook")
}

func main() {
	class1 := &ConcreteClass1{}
	class2 := &ConcreteClass2{}

	fmt.Println("Template Method in ConcreteClass1:")
	class1.templateMethod()

	fmt.Println("\nTemplate Method in ConcreteClass2:")
	class2.templateMethod()
}
```

#### Java 实现

```java
abstract class AbstractClass {
    public void templateMethod() {
        baseOperation1();
        requiredOperation1();
        baseOperation2();
        requiredOperation2();
        hook();
    }

    private void baseOperation1() {
        System.out.println("AbstractClass: Base Operation 1");
    }

    private void baseOperation2() {
        System.out.println("AbstractClass: Base Operation 2");
    }

    protected abstract void requiredOperation1();
    protected abstract void requiredOperation2();

    protected void hook() {}
}

class ConcreteClass1 extends AbstractClass {
    @Override
    protected void requiredOperation1() {
        System.out.println("ConcreteClass1: Implemented Operation 1");
    }

    @Override
    protected void requiredOperation2() {
        System.out.println("ConcreteClass1: Implemented Operation 2");
    }
}

class ConcreteClass2 extends AbstractClass {
    @Override
    protected void requiredOperation1() {
        System.out.println("ConcreteClass2: Implemented Operation 1");
    }

    @Override
    protected void requiredOperation2() {
        System.out.println("ConcreteClass2: Implemented Operation 2");
    }

    @Override
    protected void hook() {
        System.out.println("ConcreteClass2: Overridden Hook");
    }
}

public class TemplateMethodPatternDemo {
    public static void main(String[] args) {
        AbstractClass class1 = new ConcreteClass1();
        AbstractClass class2 = new ConcreteClass2();

        System.out.println("Template Method in ConcreteClass1:");
        class1.templateMethod();

        System.out.println("\nTemplate Method in ConcreteClass2:");
        class2.templateMethod();
    }
}
```

### 优缺点总结

#### 优点

1. **代码复用**：将不变的代码放在抽象类中，子类复用这些代码，减少重复代码的编写。
2. **易于扩展**：通过新增子类，可以很容易地增加新的行为，而不影响现有的代码。
3. **控制反转**：基类控制算法的执行顺序，子类只需实现具体步骤，符合“好莱坞原则”。

#### 缺点

1. **类的数量增加**：每个具体实现都需要一个子类，可能导致类的数量增加。
2. **继承相关问题**：模板方法模式依赖继承，子类必须继承自抽象类，这会带来继承相关的问题，如违反里氏替换原则（LSP）。

模板方法模式在实际开发中是一个有用的工具，特别是在具有统一算法结构的场景中，可以通过这个模式将通用的行为提取到基类中，从而简化代码，增强扩展性。