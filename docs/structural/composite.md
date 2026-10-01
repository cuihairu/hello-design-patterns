# 组合模式

组合模式（Composite Pattern）是一种结构型设计模式，它将对象组合成树形结构以表示“部分-整体”的层次结构。组合模式使得客户端可以一致地使用单个对象和组合对象。

### 使用场景
- 当需要表示对象的部分-整体层次结构时。
- 希望用户忽略组合对象与单个对象的不同，用户将统一地使用组合结构中的所有对象时。

### 结构
- **Component**：定义组合对象和叶子对象的接口。
- **Leaf**：叶子节点，实现 `Component` 接口，没有子节点。
- **Composite**：组合节点，实现 `Component` 接口，有子节点，存储子部件。

### 示例代码

#### C++
```cpp
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

在这些示例中，组合模式被用来构建一个树形结构，`Component` 定义了组合对象和叶子对象的接口。`Leaf` 类实现了叶子节点，它不包含子节点。`Composite` 类实现了组合节点，它包含子节点，并实现了 `Component` 接口的 `add` 和 `remove` 方法。客户端代码可以一致地使用组合对象和叶子对象，从而简化了操作。