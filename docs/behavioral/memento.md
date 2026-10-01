# 备忘录模式

备忘录模式（Memento Pattern）是一种行为设计模式，允许在不破坏封装性的前提下捕获和恢复对象的内部状态。备忘录模式将对象的状态保存到备忘录对象中，以便之后在需要时恢复到先前的状态。

### 备忘录模式的组成部分

1. **发起人（Originator）**：创建一个包含其当前内部状态的备忘录，并使用备忘录恢复其内部状态。
2. **备忘录（Memento）**：存储发起人的内部状态，防止发起人以外的对象访问备忘录。备忘录有两个接口：
   - **窄接口**：只允许发起人访问以进行恢复。
   - **宽接口**：允许所有拥有备忘录对象的对象访问。
3. **负责人（Caretaker）**：负责保存备忘录，但不能修改或访问备忘录的内容，只能将备忘录传递给其他对象。

### 备忘录模式的优点

1. **封装性**：保持对象的封装性，外界无法访问对象的内部状态。
2. **简化恢复操作**：允许在需要时恢复对象到之前的状态，简化了状态恢复的操作。

### 备忘录模式的缺点

1. **资源消耗**：保存和恢复大量状态可能会消耗大量的内存和资源。
2. **复杂性**：引入了新的类和接口，增加了系统的复杂性。

### 适用场景

1. **需要保存和恢复对象的多个状态**。
2. **希望通过外部存储来保存对象的历史状态**。
3. **不希望破坏对象的封装性**。

### 示例代码

#### C++ 实现

```cpp
#include <iostream>
#include <string>
#include <vector>

class Memento {
public:
    Memento(const std::string& state) : state(state) {}
    std::string getState() const { return state; }

private:
    std::string state;
};

class Originator {
public:
    void setState(const std::string& state) {
        this->state = state;
        std::cout << "State set to " << state << std::endl;
    }

    std::string getState() const { return state; }

    Memento saveStateToMemento() {
        return Memento(state);
    }

    void getStateFromMemento(const Memento& memento) {
        state = memento.getState();
    }

private:
    std::string state;
};

class Caretaker {
public:
    void addMemento(const Memento& memento) {
        mementos.push_back(memento);
    }

    Memento getMemento(int index) {
        return mementos[index];
    }

private:
    std::vector<Memento> mementos;
};

int main() {
    Originator originator;
    Caretaker caretaker;

    originator.setState("State1");
    originator.setState("State2");
    caretaker.addMemento(originator.saveStateToMemento());

    originator.setState("State3");
    caretaker.addMemento(originator.saveStateToMemento());

    originator.setState("State4");

    std::cout << "Current State: " << originator.getState() << std::endl;
    originator.getStateFromMemento(caretaker.getMemento(1));
    std::cout << "Restored to State: " << originator.getState() << std::endl;
    originator.getStateFromMemento(caretaker.getMemento(0));
    std::cout << "Restored to State: " << originator.getState() << std::endl;

    return 0;
}
```

#### Go 实现

```go
package main

import "fmt"

type Memento struct {
	state string
}

func (m *Memento) GetState() string {
	return m.state
}

type Originator struct {
	state string
}

func (o *Originator) SetState(state string) {
	o.state = state
	fmt.Println("State set to", state)
}

func (o *Originator) SaveStateToMemento() *Memento {
	return &Memento{state: o.state}
}

func (o *Originator) GetStateFromMemento(memento *Memento) {
	o.state = memento.GetState()
}

type Caretaker struct {
	mementos []*Memento
}

func (c *Caretaker) AddMemento(memento *Memento) {
	c.mementos = append(c.mementos, memento)
}

func (c *Caretaker) GetMemento(index int) *Memento {
	return c.mementos[index]
}

func main() {
	originator := &Originator{}
	caretaker := &Caretaker{}

	originator.SetState("State1")
	originator.SetState("State2")
	caretaker.AddMemento(originator.SaveStateToMemento())

	originator.SetState("State3")
	caretaker.AddMemento(originator.SaveStateToMemento())

	originator.SetState("State4")

	fmt.Println("Current State:", originator.state)
	originator.GetStateFromMemento(caretaker.GetMemento(1))
	fmt.Println("Restored to State:", originator.state)
	originator.GetStateFromMemento(caretaker.GetMemento(0))
	fmt.Println("Restored to State:", originator.state)
}
```

#### Java 实现

```java
import java.util.ArrayList;
import java.util.List;

class Memento {
    private String state;

    public Memento(String state) {
        this.state = state;
    }

    public String getState() {
        return state;
    }
}

class Originator {
    private String state;

    public void setState(String state) {
        this.state = state;
        System.out.println("State set to " + state);
    }

    public String getState() {
        return state;
    }

    public Memento saveStateToMemento() {
        return new Memento(state);
    }

    public void getStateFromMemento(Memento memento) {
        state = memento.getState();
    }
}

class Caretaker {
    private List<Memento> mementoList = new ArrayList<>();

    public void add(Memento state) {
        mementoList.add(state);
    }

    public Memento get(int index) {
        return mementoList.get(index);
    }
}

public class MementoPatternDemo {
    public static void main(String[] args) {
        Originator originator = new Originator();
        Caretaker caretaker = new Caretaker();

        originator.setState("State1");
        originator.setState("State2");
        caretaker.add(originator.saveStateToMemento());

        originator.setState("State3");
        caretaker.add(originator.saveStateToMemento());

        originator.setState("State4");

        System.out.println("Current State: " + originator.getState());
        originator.getStateFromMemento(caretaker.get(1));
        System.out.println("Restored to State: " + originator.getState());
        originator.getStateFromMemento(caretaker.get(0));
        System.out.println("Restored to State: " + originator.getState());
    }
}
```

### 优缺点总结

#### 优点

1. **封装性**：保持对象的封装性，外界无法访问对象的内部状态。
2. **简化恢复操作**：允许在需要时恢复对象到之前的状态，简化了状态恢复的操作。
3. **状态历史**：可以存储对象的历史状态，支持撤销和恢复操作。

#### 缺点

1. **资源消耗**：保存和恢复大量状态可能会消耗大量的内存和资源，特别是当对象的状态变化频繁且状态信息较多时。
2. **复杂性**：引入了新的类和接口，增加了系统的复杂性，特别是在实现比较复杂的状态保存和恢复逻辑时。

备忘录模式在实际开发中非常有用，特别是在需要保存和恢复对象多个状态的场景中，可以通过这个模式将对象的状态保存到备忘录中，从而在需要时恢复对象的状态，简化代码，提高可维护性。