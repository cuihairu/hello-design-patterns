# 策略模式

策略模式（Strategy Pattern）是一种行为型设计模式，它定义了一系列算法，并将每个算法封装起来，使它们可以互相替换。策略模式使得算法可以独立于使用它的客户而变化。

### 使用场景
- 当有多个算法变体，并且客户端需要动态选择其中之一时。
- 当需要避免使用多重条件语句来选择不同的算法时。
- 当一个类需要使用不同的行为，而这些行为在类外部定义时。

### 结构
- **Strategy**：策略接口，定义所有支持的算法的通用方法。
- **ConcreteStrategy**：具体策略类，实现策略接口定义的算法。
- **Context**：上下文类，持有一个策略类的引用，客户端通过上下文类与策略类交互。

### 示例代码

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

### 空对象：不用判空的那一档策略

空对象（Null Object）是策略的一个特例：定义一个"什么都不做"的策略实现，代替 `null` 返回给调用方。调用方拿到的永远是非空对象，判空分支从代码里消失——"空行为"也是一组可替换算法中的一个，所以它归入策略篇而不是单开一篇（Refactoring.Guru 收它为独立条目，站内口径见[覆盖核对差异表](/research/coverage)）。

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

// NullLogger 是空对象：实现接口，但什么都不做
type NullLogger struct{}

func (NullLogger) Log(msg string) {}

func main() {
    var l Logger = ConsoleLogger{}
    l.Log("hello")

    l = NullLogger{}
    l.Log("silenced") // 无输出，调用方不用判空
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

// 空对象：实现接口，方法体为空
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

// 空对象：实现接口，方法体为空
class NullLogger : public Logger {
public:
    void log(const std::string& msg) const override {}
};
```

空对象与 `Optional` 解决的问题不同：`Optional` 把"可能没有"显式写进类型，调用方仍然要处理缺失分支；空对象表示"有，但它什么都不做"，调用方无感。需要调用方感知缺失时用 `Optional`，需要调用方无感跳过时用空对象。

### 策略模式的优点和缺点

#### 优点
- 可以在运行时动态更改算法。
- 避免了使用多重条件语句，代码更清晰易读。
- 提供了算法的可扩展性，只需增加新的策略类即可。

#### 缺点
- 客户端必须知道所有的策略类，并自行决定使用哪个策略。
- 由于策略模式将每个算法都封装成独立的类，可能会增加类的数量，导致系统变得复杂。

策略模式特别适合用于有多种算法需求的场景，通过将算法的实现与使用算法的客户端代码解耦，可以更方便地添加、修改和选择不同的算法实现。