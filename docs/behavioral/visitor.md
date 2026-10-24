# Visitor

The Visitor pattern is a behavioral design pattern that allows defining new operations without modifying an object's structure. Once operation logic is separated from the object structure, adding new operations does not require changing the original classes.

### Components of the Visitor pattern

1. **Visitor interface (Visitor)**: Declares a visit interface, with a visit operation corresponding to each concrete element class.
2. **Concrete Visitor (Concrete Visitor)**: Implements the visitor interface, implementing visit operations for each concrete element class.
3. **Element interface (Element)**: Defines a method to accept a visitor (typically the `accept` method), which usually takes the visitor as a parameter.
4. **Concrete Element (Concrete Element)**: Implements the element interface, typically invoking the corresponding visitor method in the `accept` method.
5. **Object Structure (Object Structure)**: Is a collection containing many elements; it can be the Composite pattern or a simple collection.

### Advantages of the Visitor pattern

1. **Increased flexibility of operations**: Can add new operations to objects without modifying the class structure.
2. **Follows the open/closed principle**: New operations can be implemented by adding new visitors; the object structure itself does not need modification.
3. **Single responsibility principle**: Separates different operations into different visitors, giving each visitor a single responsibility.

### Disadvantages of the Visitor pattern

1. **Changes to the object structure**: If the object structure changes frequently, each change requires modifying the visitor and all its subclasses.
2. **Destructive modification of visitors**: If a concrete element class changes, all visitors need to be modified.
3. **Complexity**: Adding a new visitor is relatively simple, but if a new element class is added, all visitors need to be modified, increasing system complexity.

### Use cases

1. **Need to perform many different operations on objects in an object structure, without wanting these operations coupled into the object classes.**
2. **The object structure is relatively stable, but new operations frequently need to be defined on it.**

### Example code

#### C++ implementation

```cpp
#include <iostream>
#include <vector>
#include <string>

class ConcreteElementA;
class ConcreteElementB;

// Visitor interface
class Visitor {
public:
    virtual void visitConcreteElementA(ConcreteElementA* element) = 0;
    virtual void visitConcreteElementB(ConcreteElementB* element) = 0;
};

// Element interface
class Element {
public:
    virtual ~Element() = default;
    virtual void accept(Visitor* visitor) = 0;
};

// Concrete element A
class ConcreteElementA : public Element {
public:
    void accept(Visitor* visitor) override {
        visitor->visitConcreteElementA(this);
    }

    std::string operationA() const {
        return "ConcreteElementA";
    }
};

// Concrete element B
class ConcreteElementB : public Element {
public:
    void accept(Visitor* visitor) override {
        visitor->visitConcreteElementB(this);
    }

    std::string operationB() const {
        return "ConcreteElementB";
    }
};

// Concrete visitor 1
class ConcreteVisitor1 : public Visitor {
public:
    void visitConcreteElementA(ConcreteElementA* element) override {
        std::cout << "ConcreteVisitor1 visiting " << element->operationA() << std::endl;
    }

    void visitConcreteElementB(ConcreteElementB* element) override {
        std::cout << "ConcreteVisitor1 visiting " << element->operationB() << std::endl;
    }
};

// Concrete visitor 2
class ConcreteVisitor2 : public Visitor {
public:
    void visitConcreteElementA(ConcreteElementA* element) override {
        std::cout << "ConcreteVisitor2 visiting " << element->operationA() << std::endl;
    }

    void visitConcreteElementB(ConcreteElementB* element) override {
        std::cout << "ConcreteVisitor2 visiting " << element->operationB() << std::endl;
    }
};

int main() {
    std::vector<Element*> elements = {new ConcreteElementA(), new ConcreteElementB()};

    ConcreteVisitor1 visitor1;
    ConcreteVisitor2 visitor2;

    for (Element* element : elements) {
        element->accept(&visitor1);
        element->accept(&visitor2);
    }

    for (Element* element : elements) {
        delete element;
    }

    return 0;
}
```

#### Go implementation

```go
package main

import "fmt"

// Element interface
type Element interface {
	Accept(visitor Visitor)
}

// Visitor interface
type Visitor interface {
	VisitConcreteElementA(element *ConcreteElementA)
	VisitConcreteElementB(element *ConcreteElementB)
}

// ConcreteElementA concrete element A
type ConcreteElementA struct{}

func (e *ConcreteElementA) Accept(visitor Visitor) {
	visitor.VisitConcreteElementA(e)
}

func (e *ConcreteElementA) OperationA() string {
	return "ConcreteElementA"
}

// ConcreteElementB concrete element B
type ConcreteElementB struct{}

func (e *ConcreteElementB) Accept(visitor Visitor) {
	visitor.VisitConcreteElementB(e)
}

func (e *ConcreteElementB) OperationB() string {
	return "ConcreteElementB"
}

// ConcreteVisitor1 concrete visitor 1
type ConcreteVisitor1 struct{}

func (v *ConcreteVisitor1) VisitConcreteElementA(element *ConcreteElementA) {
	fmt.Println("ConcreteVisitor1 visiting", element.OperationA())
}

func (v *ConcreteVisitor1) VisitConcreteElementB(element *ConcreteElementB) {
	fmt.Println("ConcreteVisitor1 visiting", element.OperationB())
}

// ConcreteVisitor2 concrete visitor 2
type ConcreteVisitor2 struct{}

func (v *ConcreteVisitor2) VisitConcreteElementA(element *ConcreteElementA) {
	fmt.Println("ConcreteVisitor2 visiting", element.OperationA())
}

func (v *ConcreteVisitor2) VisitConcreteElementB(element *ConcreteElementB) {
	fmt.Println("ConcreteVisitor2 visiting", element.OperationB())
}

func main() {
	elements := []Element{&ConcreteElementA{}, &ConcreteElementB{}}

	visitor1 := &ConcreteVisitor1{}
	visitor2 := &ConcreteVisitor2{}

	for _, element := range elements {
		element.Accept(visitor1)
		element.Accept(visitor2)
	}
}
```

#### Java implementation

```java
import java.util.ArrayList;
import java.util.List;

// Visitor interface
interface Visitor {
    void visit(ConcreteElementA element);
    void visit(ConcreteElementB element);
}

// Element interface
interface Element {
    void accept(Visitor visitor);
}

// Concrete element A
class ConcreteElementA implements Element {
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public String operationA() {
        return "ConcreteElementA";
    }
}

// Concrete element B
class ConcreteElementB implements Element {
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public String operationB() {
        return "ConcreteElementB";
    }
}

// Concrete visitor 1
class ConcreteVisitor1 implements Visitor {
    public void visit(ConcreteElementA element) {
        System.out.println("ConcreteVisitor1 visiting " + element.operationA());
    }

    public void visit(ConcreteElementB element) {
        System.out.println("ConcreteVisitor1 visiting " + element.operationB());
    }
}

// Concrete visitor 2
class ConcreteVisitor2 implements Visitor {
    public void visit(ConcreteElementA element) {
        System.out.println("ConcreteVisitor2 visiting " + element.operationA());
    }

    public void visit(ConcreteElementB element) {
        System.out.println("ConcreteVisitor2 visiting " + element.operationB());
    }
}

public class VisitorPatternDemo {
    public static void main(String[] args) {
        List<Element> elements = new ArrayList<>();
        elements.add(new ConcreteElementA());
        elements.add(new ConcreteElementB());

        Visitor visitor1 = new ConcreteVisitor1();
        Visitor visitor2 = new ConcreteVisitor2();

        for (Element element : elements) {
            element.accept(visitor1);
            element.accept(visitor2);
        }
    }
}
```

### Summary of advantages and disadvantages

#### Advantages

1. **Increased flexibility of operations**: Can add new operations to objects without modifying the class structure.
2. **Follows the open/closed principle**: New operations can be implemented by adding new visitors; the object structure itself does not need modification.
3. **Single responsibility principle**: Separates different operations into different visitors, giving each visitor a single responsibility.

#### Disadvantages

1. **Changes to the object structure**: If the object structure changes frequently, each change requires modifying the visitor and all its subclasses.
2. **Destructive modification of visitors**: If a concrete element class changes, all visitors need to be modified.
3. **Complexity**: Adding a new visitor is relatively simple, but if a new element class is added, all visitors need to be modified, increasing system complexity.

The Visitor pattern is very useful in scenarios where multiple different operations need to be performed on objects in an object structure, especially when the object structure is relatively stable but operations change frequently. By using this pattern, operations can be extended without modifying the object structure itself.

## Sources

- [S1] GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · Visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern)
- [Refactoring.Guru · Visitor](https://refactoring.guru/design-patterns/visitor)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
