# 状态模式

状态模式（State Pattern）是一种行为设计模式，允许对象在其内部状态改变时改变其行为。状态模式将状态的逻辑分散到独立的状态类中，并将状态的改变封装在这些类中，从而使得对象的行为可以根据状态的改变而发生变化。

### 状态模式的组成部分

1. **状态接口（State）**：定义状态类的接口，声明了特定状态下的行为。
2. **具体状态类（Concrete State）**：实现状态接口，封装与该状态相关的行为。
3. **上下文类（Context）**：持有一个状态对象的引用，负责将请求委托给当前状态对象。可以根据需要改变状态对象。

### 状态模式的优点

1. **简化复杂状态转换**：将与特定状态相关的行为局部化，并且将不同状态的行为分割开来，简化了复杂的状态转换。
2. **遵循开闭原则**：通过增加新的状态类，可以很容易地增加新的状态和行为，而无需修改现有代码。
3. **提高内聚性**：将状态和行为绑定在一起，确保了状态相关的行为在状态类中实现，提高了内聚性。

### 状态模式的缺点

1. **类的数量增加**：每个状态都需要一个具体状态类，可能导致类的数量显著增加。
2. **状态切换开销**：频繁的状态切换可能会引入一定的运行时开销。

### 适用场景

1. **一个对象的行为取决于它的状态，并且它必须在运行时根据状态改变其行为**。
2. **代码中包含大量与对象状态有关的条件语句（如 switch 或 if-else 语句）**。

### 示例代码

#### C++ 实现

```cpp
#include <iostream>
#include <string>

class Context;

class State {
public:
    virtual ~State() {}
    virtual void handle(Context* context) = 0;
};

class Context {
private:
    State* state;

public:
    Context(State* state) : state(state) {}
    ~Context() { delete state; }

    void setState(State* state) {
        delete this->state;
        this->state = state;
    }

    void request() {
        state->handle(this);
    }
};

class ConcreteStateA : public State {
public:
    void handle(Context* context) override {
        std::cout << "ConcreteStateA handles request. Switching to ConcreteStateB.\n";
        context->setState(new ConcreteStateB());
    }
};

class ConcreteStateB : public State {
public:
    void handle(Context* context) override {
        std::cout << "ConcreteStateB handles request. Switching to ConcreteStateA.\n";
        context->setState(new ConcreteStateA());
    }
};

int main() {
    Context* context = new Context(new ConcreteStateA());
    context->request();
    context->request();
    context->request();
    context->request();
    delete context;
    return 0;
}
```

#### Go 实现

```go
package main

import "fmt"

type State interface {
	Handle(context *Context)
}

type Context struct {
	state State
}

func (c *Context) SetState(state State) {
	c.state = state
}

func (c *Context) Request() {
	c.state.Handle(c)
}

type ConcreteStateA struct{}

func (s *ConcreteStateA) Handle(context *Context) {
	fmt.Println("ConcreteStateA handles request. Switching to ConcreteStateB.")
	context.SetState(&ConcreteStateB{})
}

type ConcreteStateB struct{}

func (s *ConcreteStateB) Handle(context *Context) {
	fmt.Println("ConcreteStateB handles request. Switching to ConcreteStateA.")
	context.SetState(&ConcreteStateA{})
}

func main() {
	context := &Context{state: &ConcreteStateA{}}
	context.Request()
	context.Request()
	context.Request()
	context.Request()
}
```

#### Java 实现

```java
interface State {
    void handle(Context context);
}

class Context {
    private State state;

    public Context(State state) {
        this.state = state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public void request() {
        state.handle(this);
    }
}

class ConcreteStateA implements State {
    @Override
    public void handle(Context context) {
        System.out.println("ConcreteStateA handles request. Switching to ConcreteStateB.");
        context.setState(new ConcreteStateB());
    }
}

class ConcreteStateB implements State {
    @Override
    public void handle(Context context) {
        System.out.println("ConcreteStateB handles request. Switching to ConcreteStateA.");
        context.setState(new ConcreteStateA());
    }
}

public class StatePatternDemo {
    public static void main(String[] args) {
        Context context = new Context(new ConcreteStateA());
        context.request();
        context.request();
        context.request();
        context.request();
    }
}
```

### 优缺点总结

#### 优点

1. **简化复杂状态转换**：通过将状态的行为局部化，简化了复杂的状态转换逻辑。
2. **遵循开闭原则**：可以通过增加新的状态类来扩展新的状态和行为，而无需修改现有代码。
3. **提高内聚性**：将状态和行为绑定在一起，确保了状态相关的行为在状态类中实现，提高了内聚性。

#### 缺点

1. **类的数量增加**：每个状态都需要一个具体状态类，可能导致类的数量显著增加。
2. **状态切换开销**：频繁的状态切换可能会引入一定的运行时开销。

状态模式在实际开发中是一个非常有用的工具，特别是在对象需要根据状态改变行为的场景中，可以通过这个模式将状态相关的行为封装到独立的状态类中，从而简化代码，提高可维护性。