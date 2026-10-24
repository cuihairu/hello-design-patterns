# Command

The Command pattern is a behavioral design pattern. It encapsulates a request as an object, so clients can be parameterized with different requests; requests can also be queued, logged, or support undo.

### Use cases
- Encapsulate requests for operations as objects so that user actions can be parameterized.
- Specify, queue, and execute requests at different times.
- Support undoing and redoing operations.
- Support transactional operations.

### Structure
- **Command**: the command interface, defining the operation that executes the command.
- **ConcreteCommand**: the concrete command, implementing the execution operation and binding a receiver object.
- **Invoker**: the invoker, the object that executes the command.
- **Receiver**: the receiver, the object that performs the actual operation.
- **Client**: the client, which creates concrete command objects and sets their receivers.

### Example code

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
import java.util.ArrayList;
import java.util.List;

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

### Pros and cons of the Command pattern

#### Pros
- **Decoupling**: decouples the object that issues the command from the object that executes it.
- **Extensibility**: commands can be easily added to the system.
- **Composability**: multiple commands can be combined into a composite command.
- **Undo and redo support**: undo and redo functionality can be implemented easily.

#### Cons
- **More classes**: each concrete command requires its own implementation class, which increases system complexity.
- **Harder to debug**: the Command pattern involves many objects, which makes debugging more cumbersome.

The Command pattern applies to scenarios that need to parameterize and queue requests, or that need to support undo and redo operations. By encapsulating requests as objects, the Command pattern enables more flexible request handling and command management.

## Sources

- [S1] The GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · Command pattern](https://en.wikipedia.org/wiki/Command_pattern)
- [Refactoring.Guru · Command](https://refactoring.guru/design-patterns/command)

<!-- BACKLINKS-AUTO -->
## Related pages

- [spaghetti-code](/anti-patterns/spaghetti-code.md)
- [overview](overview.md)
- [glossary](/glossary.md)
- [transaction-script](/other/transaction-script.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
