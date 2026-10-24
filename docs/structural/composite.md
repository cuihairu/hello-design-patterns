# Composite

The Composite Pattern is a structural design pattern that composes objects into tree structures to represent part-whole hierarchies. The Composite pattern lets clients treat individual objects and compositions of objects uniformly.

### Use cases
- When you need to represent a part-whole hierarchy of objects.
- When you want clients to ignore the difference between compositions of objects and individual objects, so that clients treat all objects in the composite structure uniformly.

### Structure
- **Component**: defines the interface for composite objects and leaf objects.
- **Leaf**: a leaf node; implements the `Component` interface and has no children.
- **Composite**: a composite node; implements the `Component` interface, has children, and stores child components.

### Example code

#### C++
```cpp
#include <algorithm>
#include <iostream>
#include <vector>

// Component
class Component {
public:
    virtual void operation() const = 0;
    virtual void add(Component* component) {}
    virtual void remove(Component* component) {}
    virtual ~Component() = default;
};

// Leaf
class Leaf : public Component {
public:
    void operation() const override {
        std::cout << "Leaf operation.\n";
    }
};

// Composite
class Composite : public Component {
private:
    std::vector<Component*> children;

public:
    void operation() const override {
        std::cout << "Composite operation.\n";
        for (const auto& child : children) {
            child->operation();
        }
    }

    void add(Component* component) override {
        children.push_back(component);
    }

    void remove(Component* component) override {
        children.erase(std::remove(children.begin(), children.end(), component), children.end());
    }
};

int main() {
    Composite* root = new Composite();
    Leaf* leaf1 = new Leaf();
    Leaf* leaf2 = new Leaf();

    root->add(leaf1);
    root->add(leaf2);

    root->operation();

    delete leaf1;
    delete leaf2;
    delete root;
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Component
type Component interface {
    Operation()
    Add(Component)
    Remove(Component)
}

// Leaf
type Leaf struct{}

func (l *Leaf) Operation() {
    fmt.Println("Leaf operation.")
}

func (l *Leaf) Add(c Component) {}
func (l *Leaf) Remove(c Component) {}

// Composite
type Composite struct {
    children []Component
}

func (c *Composite) Operation() {
    fmt.Println("Composite operation.")
    for _, child := range c.children {
        child.Operation()
    }
}

func (c *Composite) Add(component Component) {
    c.children = append(c.children, component)
}

func (c *Composite) Remove(component Component) {
    for i, child := range c.children {
        if child == component {
            c.children = append(c.children[:i], c.children[i+1:]...)
            break
        }
    }
}

func main() {
    root := &Composite{}
    leaf1 := &Leaf{}
    leaf2 := &Leaf{}

    root.Add(leaf1)
    root.Add(leaf2)

    root.Operation()
}
```

#### Java
```java
import java.util.ArrayList;
import java.util.List;

// Component
interface Component {
    void operation();
    default void add(Component component) {}
    default void remove(Component component) {}
}

// Leaf
class Leaf implements Component {
    public void operation() {
        System.out.println("Leaf operation.");
    }
}

// Composite
class Composite implements Component {
    private List<Component> children = new ArrayList<>();

    public void operation() {
        System.out.println("Composite operation.");
        for (Component child : children) {
            child.operation();
        }
    }

    public void add(Component component) {
        children.add(component);
    }

    public void remove(Component component) {
        children.remove(component);
    }
}

// Client code
public class Main {
    public static void main(String[] args) {
        Composite root = new Composite();
        Leaf leaf1 = new Leaf();
        Leaf leaf2 = new Leaf();

        root.add(leaf1);
        root.add(leaf2);

        root.operation();
    }
}
```

In these examples, the Composite pattern is used to build a tree structure. `Component` defines the interface for composite objects and leaf objects. The `Leaf` class represents a leaf node and contains no children. The `Composite` class represents a composite node: it contains children and implements the `add` and `remove` methods of the `Component` interface. Client code can treat composite objects and leaf objects uniformly, which simplifies operations.

## Sources

- [S1] GoF structural patterns catalog (chapter 4), the original source of this pattern.
- [Wikipedia · Composite pattern](https://en.wikipedia.org/wiki/Composite_pattern)
- [Refactoring.Guru · Composite](https://refactoring.guru/design-patterns/composite)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
- [overview](overview.md)
