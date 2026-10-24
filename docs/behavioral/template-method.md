# Template Method

The Template Method pattern is a behavioral design pattern that defines the skeleton of an algorithm and allows subclasses to redefine certain steps of the algorithm without changing its structure. With this pattern, invariant behavior can be factored out into a base class, while variable behavior is deferred to subclass implementations.

### Components of the Template Method pattern

1. **Abstract class (Abstract Class)**: Defines the skeleton of the algorithm and declares a number of abstract methods that subclasses implement.
2. **Concrete class (Concrete Class)**: Implements the abstract methods in the abstract class, thereby completing the implementation of the variable parts of the algorithm.

### Advantages of the Template Method pattern

1. **Code reuse**: Common code is placed in the abstract class, avoiding duplicated code.
2. **Easy to extend**: New behavior can be added easily by introducing new subclasses.
3. **Inversion of control**: The parent class calls the subclass's implementation methods, and the subclass does not call the parent class's implementation, which conforms to the "Hollywood principle" (Don't call us, we'll call you).

### Disadvantages of the Template Method pattern

1. **Increased number of classes**: Every concrete implementation requires a subclass, which may lead to an increased number of classes.
2. **Inheritance-related issues**: The Template Method pattern relies on inheritance; subclasses must inherit from the abstract class, which brings inheritance-related problems such as violating the Liskov Substitution Principle (LSP).

### Use cases

1. **Scenarios with a unified algorithm structure in which certain steps have different concrete implementations**.
2. **When multiple subclasses have common methods and their logic is largely the same**.
3. **When refactoring, the Template Method pattern can be used to extract similar code into a base class**.

### Example code

#### C++ Implementation

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

#### Go Implementation

```go
package main

import "fmt"

// Template defines the individual steps required by the algorithm skeleton, implemented by concrete classes (by embedding BaseClass)
type Template interface {
	baseOperation1()
	requiredOperation1()
	baseOperation2()
	requiredOperation2()
	hook()
}

// templateMethod is the algorithm skeleton; the real implementation of the steps is deferred to concrete classes
func templateMethod(t Template) {
	t.baseOperation1()
	t.requiredOperation1()
	t.baseOperation2()
	t.requiredOperation2()
	t.hook()
}

type BaseClass struct{}

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
	templateMethod(class1)

	fmt.Println("\nTemplate Method in ConcreteClass2:")
	templateMethod(class2)
}
```

#### Java Implementation

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

### Summary of advantages and disadvantages

#### Advantages

1. **Code reuse**: Invariant code is placed in the abstract class, and subclasses reuse that code, reducing the amount of duplicated code to write.
2. **Easy to extend**: New behavior can be added easily by introducing new subclasses, without affecting existing code.
3. **Inversion of control**: The base class controls the execution order of the algorithm, and subclasses only need to implement the concrete steps, which conforms to the "Hollywood principle".

#### Disadvantages

1. **Increased number of classes**: Every concrete implementation requires a subclass, which may lead to an increased number of classes.
2. **Inheritance-related issues**: The Template Method pattern relies on inheritance; subclasses must inherit from the abstract class, which brings inheritance-related problems such as violating the Liskov Substitution Principle (LSP).

The Template Method pattern is a useful tool in real-world development, especially in scenarios with a unified algorithm structure, where common behavior can be factored out into a base class using this pattern, thereby simplifying the code and enhancing extensibility.

## Sources

- [S1] GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · Template method pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
- [Refactoring.Guru · Template Method](https://refactoring.guru/design-patterns/template-method)

<!-- BACKLINKS-AUTO -->
## Related pages

- [spaghetti-code](/anti-patterns/spaghetti-code.md)
- [overview](overview.md)
- [composition-over-inheritance](/evolution/composition-over-inheritance.md)
- [overview](/evolution/overview.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
- [official-docs](/research/official-docs.md)
