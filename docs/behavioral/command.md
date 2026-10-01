# 命令模式

命令模式（Command Pattern）是一种行为设计模式，它将一个请求封装为一个对象，从而使你可以用不同的请求对客户进行参数化；对请求排队或记录请求日志，以及支持可撤销的操作。

### 使用场景
- 将操作的请求封装为对象，以便参数化用户操作。
- 在不同的时刻指定、排列和执行请求。
- 支持取消和恢复操作。
- 支持事务性操作。

### 结构
- **Command**：命令接口，定义执行命令的操作。
- **ConcreteCommand**：具体命令，实现执行操作，绑定接收者对象。
- **Invoker**：调用者，执行命令的对象。
- **Receiver**：接收者，执行具体操作的对象。
- **Client**：客户端，创建具体命令对象并设定其接收者。

### 示例代码

#### C++
```cpp
#include <iostream>
#include <vector>
#include <memory>

// Command Interface
class Command {
public:
    virtual ~Command() = default;
    virtual void execute() = 0;
};

// Receiver
class Receiver {
public:
    void action() {
        std::cout << "Receiver: Executing action." << std::endl;
    }
};

// Concrete Command
class ConcreteCommand : public Command {
private:
    Receiver* receiver;
public:
    explicit ConcreteCommand(Receiver* r) : receiver(r) {}
    void execute() override {
        receiver->action();
    }
};

// Invoker
class Invoker {
private:
    std::vector<std::unique_ptr<Command>> commands;
public:
    void setCommand(std::unique_ptr<Command> command) {
        commands.push_back(std::move(command));
    }

    void executeCommands() {
        for (auto& command : commands) {
            command->execute();
        }
    }
};

int main() {
    Receiver receiver;
    Invoker invoker;

    invoker.setCommand(std::make_unique<ConcreteCommand>(&receiver));
    invoker.executeCommands();

    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Command Interface
type Command interface {
    Execute()
}

// Receiver
type Receiver struct{}

func (r *Receiver) Action() {
    fmt.Println("Receiver: Executing action.")
}

// Concrete Command
type ConcreteCommand struct {
    receiver *Receiver
}

func (c *ConcreteCommand) Execute() {
    c.receiver.Action()
}

// Invoker
type Invoker struct {
    commands []Command
}

func (i *Invoker) SetCommand(command Command) {
    i.commands = append(i.commands, command)
}

func (i *Invoker) ExecuteCommands() {
    for _, command := range i.commands {
        command.Execute()
    }
}

func main() {
    receiver := &Receiver{}
    invoker := &Invoker{}

    command := &ConcreteCommand{receiver: receiver}
    invoker.SetCommand(command)
    invoker.ExecuteCommands()
}
```

#### Java
```java
// Command Interface
interface Command {
    void execute();
}

// Receiver
class Receiver {
    public void action() {
        System.out.println("Receiver: Executing action.");
    }
}

// Concrete Command
class ConcreteCommand implements Command {
    private Receiver receiver;

    public ConcreteCommand(Receiver receiver) {
        this.receiver = receiver;
    }

    @Override
    public void execute() {
        receiver.action();
    }
}

// Invoker
class Invoker {
    private List<Command> commands = new ArrayList<>();

    public void setCommand(Command command) {
        commands.add(command);
    }

    public void executeCommands() {
        for (Command command : commands) {
            command.execute();
        }
    }
}

// Client
public class Main {
    public static void main(String[] args) {
        Receiver receiver = new Receiver();
        Invoker invoker = new Invoker();

        Command command = new ConcreteCommand(receiver);
        invoker.setCommand(command);
        invoker.executeCommands();
    }
}
```

### 命令模式的优点和缺点

#### 优点
- **解耦**：将发出命令的对象和执行命令的对象解耦。
- **扩展性**：命令可以很容易地添加到系统中。
- **可组合**：可以将多个命令组合成一个复合命令。
- **支持撤销和恢复**：可以方便地实现命令的撤销和恢复功能。

#### 缺点
- **类的数量增加**：每一个具体命令类都需要设计一个实现类，这会增加系统的复杂度。
- **调试困难**：命令模式涉及的对象较多，调试起来比较麻烦。

命令模式适用于需要对请求进行参数化和排队处理，或者需要支持撤销和恢复操作的场景。通过将请求封装为对象，命令模式可以实现更灵活的请求处理和命令管理。