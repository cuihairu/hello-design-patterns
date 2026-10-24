# State

The State pattern is a behavioral design pattern that allows an object to change its behavior when its internal state changes. The State pattern disperses the logic of states across independent state classes and encapsulates state transitions within those classes, so that an object's behavior can change as its state changes.

### Components of the State pattern

1. **State interface (State)**: Defines the interface for state classes, declaring the behavior in a particular state.
2. **Concrete state classes (Concrete State)**: Implement the State interface, encapsulating the behavior associated with the state.
3. **Context class (Context)**: Holds a reference to a state object and is responsible for delegating requests to the current state object. The state object can be changed as needed.

### Advantages of the State pattern

1. **Simplifies complex state transitions**: Localizes the behavior associated with a particular state and separates the behavior of different states, simplifying complex state transitions.
2. **Follows the open/closed principle**: New states and behavior can easily be added by introducing new state classes, without modifying existing code.
3. **Improves cohesion**: Binds state and behavior together, ensuring that state-related behavior is implemented in the state classes, improving cohesion.

### Disadvantages of the State pattern

1. **Increased number of classes**: Each state requires a concrete state class, which can significantly increase the number of classes.
2. **State-switching overhead**: Frequent state switching may introduce some runtime overhead.

### Use cases

1. **An object's behavior depends on its state, and it must change its behavior at runtime according to its state.**
2. **The code contains a large number of conditional statements related to an object's state (such as switch or if-else statements).**

### Example code

#### C++ implementation

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

// The handle implementations of the two concrete state classes reference each other, so they
// must be defined after both class declarations are complete;
// here we only declare them first, then define them outside the classes
class ConcreteStateA : public State {
public:
    void handle(Context* context) override;
};

class ConcreteStateB : public State {
public:
    void handle(Context* context) override;
};

void ConcreteStateA::handle(Context* context) {
    std::cout << "ConcreteStateA handles request. Switching to ConcreteStateB.\n";
    context->setState(new ConcreteStateB());
}

void ConcreteStateB::handle(Context* context) {
    std::cout << "ConcreteStateB handles request. Switching to ConcreteStateA.\n";
    context->setState(new ConcreteStateA());
}

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

#### Go implementation

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

#### Java implementation

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

### Summary of advantages and disadvantages

#### Advantages

1. **Simplifies complex state transitions**: By localizing the behavior of states, it simplifies the logic of complex state transitions.
2. **Follows the open/closed principle**: New states and behavior can be extended by adding new state classes, without modifying existing code.
3. **Improves cohesion**: Binds state and behavior together, ensuring that state-related behavior is implemented in the state classes, improving cohesion.

#### Disadvantages

1. **Increased number of classes**: Each state requires a concrete state class, which can significantly increase the number of classes.
2. **State-switching overhead**: Frequent state switching may introduce some runtime overhead.

The State pattern is a very useful tool in real development, especially in scenarios where an object needs to change its behavior according to its state. By using this pattern, state-related behavior can be encapsulated into independent state classes, thereby simplifying code and improving maintainability.

## Sources

- [S1] GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · State pattern](https://en.wikipedia.org/wiki/State_pattern)
- [Refactoring.Guru · State](https://refactoring.guru/design-patterns/state)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](/anti-patterns/overview.md)
- [overview](overview.md)
- [composition-over-inheritance](/evolution/composition-over-inheritance.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
