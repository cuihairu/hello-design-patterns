# Strategy

The Strategy pattern is a behavioral design pattern. It defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently of the clients that use it.

### Use cases
- When there are multiple algorithm variants and the client needs to choose one of them dynamically.
- When you need to avoid using multiple conditional statements to select among different algorithms.
- When a class needs to use different behaviors, and those behaviors are defined outside the class.

### Structure
- **Strategy**: the strategy interface, defining the common method for all supported algorithms.
- **ConcreteStrategy**: a concrete strategy class, implementing the algorithms defined by the strategy interface.
- **Context**: the context class, holding a reference to a strategy class; clients interact with the strategy class through the context class.

### Example code

#### C++
```cpp
#include <iostream>
#include <memory>

// Strategy Interface
class Strategy {
public:
    virtual ~Strategy() = default;
    virtual void execute() const = 0;
};

// Concrete Strategies
class ConcreteStrategyA : public Strategy {
public:
    void execute() const override {
        std::cout << "Executing Strategy A" << std::endl;
    }
};

class ConcreteStrategyB : public Strategy {
public:
    void execute() const override {
        std::cout << "Executing Strategy B" << std::endl;
    }
};

// Context
class Context {
private:
    std::unique_ptr<Strategy> strategy;
public:
    void setStrategy(std::unique_ptr<Strategy> s) {
        strategy = std::move(s);
    }
    void executeStrategy() const {
        strategy->execute();
    }
};

int main() {
    Context context;

    context.setStrategy(std::make_unique<ConcreteStrategyA>());
    context.executeStrategy();

    context.setStrategy(std::make_unique<ConcreteStrategyB>());
    context.executeStrategy();

    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Strategy Interface
type Strategy interface {
    Execute()
}

// Concrete Strategies
type StrategyA struct{}

func (s *StrategyA) Execute() {
    fmt.Println("Executing Strategy A")
}

type StrategyB struct{}

func (s *StrategyB) Execute() {
    fmt.Println("Executing Strategy B")
}

// Context
type Context struct {
    strategy Strategy
}

func (c *Context) SetStrategy(s Strategy) {
    c.strategy = s
}

func (c *Context) ExecuteStrategy() {
    c.strategy.Execute()
}

func main() {
    context := &Context{}

    context.SetStrategy(&StrategyA{})
    context.ExecuteStrategy()

    context.SetStrategy(&StrategyB{})
    context.ExecuteStrategy()
}
```

#### Java
```java
// Strategy Interface
interface Strategy {
    void execute();
}

// Concrete Strategies
class ConcreteStrategyA implements Strategy {
    public void execute() {
        System.out.println("Executing Strategy A");
    }
}

class ConcreteStrategyB implements Strategy {
    public void execute() {
        System.out.println("Executing Strategy B");
    }
}

// Context
class Context {
    private Strategy strategy;

    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }

    public void executeStrategy() {
        strategy.execute();
    }
}

// Client code
public class Main {
    public static void main(String[] args) {
        Context context = new Context();

        context.setStrategy(new ConcreteStrategyA());
        context.executeStrategy();

        context.setStrategy(new ConcreteStrategyB());
        context.executeStrategy();
    }
}
```

### Null object: the strategy that needs no null check

Null object is a special case of Strategy: define a "does nothing" strategy implementation and return it instead of `null`. The caller always gets a non-null object, and the null-check branch disappears from the code — "empty behavior" is itself one of a family of interchangeable algorithms, so it is covered here rather than in a separate page (Refactoring.Guru lists it as a standalone entry; for the site's stance, see the [coverage verification diff table](/research/coverage)).

#### Go
```go
package main

import "fmt"

type Logger interface {
    Log(msg string)
}

type ConsoleLogger struct{}

func (ConsoleLogger) Log(msg string) {
    fmt.Println(msg)
}

// NullLogger is a null object: it implements the interface but does nothing
type NullLogger struct{}

func (NullLogger) Log(msg string) {}

func main() {
    var l Logger = ConsoleLogger{}
    l.Log("hello")

    l = NullLogger{}
    l.Log("silenced") // no output; the caller doesn't need a null check
}
```

#### Java
```java
interface Logger {
    void log(String msg);
}

class ConsoleLogger implements Logger {
    public void log(String msg) {
        System.out.println(msg);
    }
}

// Null object: implements the interface with an empty method body
class NullLogger implements Logger {
    public void log(String msg) {
    }
}
```

#### C++
```cpp
#include <iostream>
#include <string>

class Logger {
public:
    virtual ~Logger() = default;
    virtual void log(const std::string& msg) const = 0;
};

class ConsoleLogger : public Logger {
public:
    void log(const std::string& msg) const override {
        std::cout << msg << std::endl;
    }
};

// Null object: implements the interface with an empty method body
class NullLogger : public Logger {
public:
    void log(const std::string& msg) const override {}
};
```

Null object solves a different problem than `Optional`: `Optional` writes "might be absent" explicitly into the type, so the caller still has to handle the missing branch; a null object means "present, but it does nothing", so the caller is unaware. Use `Optional` when the caller needs to be aware of the absence, and use a null object when the caller should skip it without noticing.

### Pros and cons of the Strategy pattern

#### Pros
- Algorithms can be changed dynamically at run time.
- Avoids using multiple conditional statements, making the code cleaner and more readable.
- Provides extensibility for algorithms; you only need to add a new strategy class.

#### Cons
- Clients must know all the strategy classes and decide for themselves which strategy to use.
- Because the Strategy pattern encapsulates each algorithm in its own class, it can increase the number of classes and make the system more complex.

The Strategy pattern is especially well suited to scenarios with a need for multiple algorithms. By decoupling the implementation of an algorithm from the client code that uses it, it becomes easier to add, modify, and choose among different algorithm implementations.

## Sources

- [S1] The GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · Strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern)
- [Refactoring.Guru · Strategy](https://refactoring.guru/design-patterns/strategy)
- For the null object variant, see [Wikipedia · Null object pattern](https://en.wikipedia.org/wiki/Null_object_pattern)

<!-- BACKLINKS-AUTO -->
## Related pages

- [golden-hammer](/anti-patterns/golden-hammer.md)
- [overview](/anti-patterns/overview.md)
- [spaghetti-code](/anti-patterns/spaghetti-code.md)
- [overview](overview.md)
- [circuit-breaker](/evolution/circuit-breaker.md)
- [composition-over-inheritance](/evolution/composition-over-inheritance.md)
- [solid](/evolution/solid.md)
- [timeout](/evolution/timeout.md)
- [glossary](/glossary.md)
- [message-router](/integration/message-router.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
- [official-docs](/research/official-docs.md)
