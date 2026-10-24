# Mediator

The Mediator pattern is a behavioral design pattern used to reduce coupling between objects. It encapsulates the interaction between objects through a mediator object, so that the objects do not reference each other directly but communicate through the mediator. This makes the code more loosely coupled and easier to maintain.

### Use cases
- The interactions between objects in a system are complex and form a mesh structure.
- You want to centrally control the interaction behavior between objects through a mediator.
- You need to decouple the tight coupling between multiple objects.

### Structure
- **Mediator**: The mediator interface that defines the interface for communication between colleague objects.
- **ConcreteMediator**: A concrete mediator that implements the mediator interface and coordinates the interactions among colleague objects.
- **Colleague**: A colleague class that holds a reference to the mediator object and communicates with other colleagues through the mediator.
- **ConcreteColleague**: A concrete colleague class that implements its own business logic and communicates with other colleagues through the mediator.

### Example code

#### C++
```cpp
#include <iostream>
#include <string>
#include <vector>
#include <memory>

// Mediator Interface
class Mediator {
public:
    virtual void notify(const std::string& message, class Colleague* colleague) = 0;
};

// Colleague Base Class
class Colleague {
protected:
    Mediator* mediator;
public:
    Colleague(Mediator* m) : mediator(m) {}
    virtual void send(const std::string& message) = 0;
    virtual void receive(const std::string& message) = 0;
};

// ConcreteColleague1
class ConcreteColleague1 : public Colleague {
public:
    ConcreteColleague1(Mediator* m) : Colleague(m) {}
    void send(const std::string& message) override {
        std::cout << "Colleague1 sends message: " << message << std::endl;
        mediator->notify(message, this);
    }
    void receive(const std::string& message) override {
        std::cout << "Colleague1 receives message: " << message << std::endl;
    }
};

// ConcreteColleague2
class ConcreteColleague2 : public Colleague {
public:
    ConcreteColleague2(Mediator* m) : Colleague(m) {}
    void send(const std::string& message) override {
        std::cout << "Colleague2 sends message: " << message << std::endl;
        mediator->notify(message, this);
    }
    void receive(const std::string& message) override {
        std::cout << "Colleague2 receives message: " << message << std::endl;
    }
};

// ConcreteMediator
class ConcreteMediator : public Mediator {
private:
    std::vector<Colleague*> colleagues;
public:
    void addColleague(Colleague* colleague) {
        colleagues.push_back(colleague);
    }
    void notify(const std::string& message, Colleague* sender) override {
        for (Colleague* colleague : colleagues) {
            if (colleague != sender) {
                colleague->receive(message);
            }
        }
    }
};

int main() {
    ConcreteMediator mediator;
    ConcreteColleague1 colleague1(&mediator);
    ConcreteColleague2 colleague2(&mediator);

    mediator.addColleague(&colleague1);
    mediator.addColleague(&colleague2);

    colleague1.send("Hello");
    colleague2.send("Hi");

    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Mediator Interface
type Mediator interface {
    Notify(message string, colleague Colleague)
}

// Colleague Interface
type Colleague interface {
    Send(message string)
    Receive(message string)
}

// ConcreteColleague1
type ConcreteColleague1 struct {
    mediator Mediator
}

func (c *ConcreteColleague1) Send(message string) {
    fmt.Println("Colleague1 sends message:", message)
    c.mediator.Notify(message, c)
}

func (c *ConcreteColleague1) Receive(message string) {
    fmt.Println("Colleague1 receives message:", message)
}

// ConcreteColleague2
type ConcreteColleague2 struct {
    mediator Mediator
}

func (c *ConcreteColleague2) Send(message string) {
    fmt.Println("Colleague2 sends message:", message)
    c.mediator.Notify(message, c)
}

func (c *ConcreteColleague2) Receive(message string) {
    fmt.Println("Colleague2 receives message:", message)
}

// ConcreteMediator
type ConcreteMediator struct {
    colleagues []Colleague
}

func (m *ConcreteMediator) AddColleague(colleague Colleague) {
    m.colleagues = append(m.colleagues, colleague)
}

func (m *ConcreteMediator) Notify(message string, sender Colleague) {
    for _, colleague := range m.colleagues {
        if colleague != sender {
            colleague.Receive(message)
        }
    }
}

// Client
func main() {
    mediator := &ConcreteMediator{}
    colleague1 := &ConcreteColleague1{mediator}
    colleague2 := &ConcreteColleague2{mediator}

    mediator.AddColleague(colleague1)
    mediator.AddColleague(colleague2)

    colleague1.Send("Hello")
    colleague2.Send("Hi")
}
```

#### Java
```java
import java.util.ArrayList;
import java.util.List;

// Mediator Interface
interface Mediator {
    void notify(String message, Colleague colleague);
}

// Colleague Base Class
abstract class Colleague {
    protected Mediator mediator;
    public Colleague(Mediator mediator) {
        this.mediator = mediator;
    }
    public abstract void send(String message);
    public abstract void receive(String message);
}

// ConcreteColleague1
class ConcreteColleague1 extends Colleague {
    public ConcreteColleague1(Mediator mediator) {
        super(mediator);
    }
    public void send(String message) {
        System.out.println("Colleague1 sends message: " + message);
        mediator.notify(message, this);
    }
    public void receive(String message) {
        System.out.println("Colleague1 receives message: " + message);
    }
}

// ConcreteColleague2
class ConcreteColleague2 extends Colleague {
    public ConcreteColleague2(Mediator mediator) {
        super(mediator);
    }
    public void send(String message) {
        System.out.println("Colleague2 sends message: " + message);
        mediator.notify(message, this);
    }
    public void receive(String message) {
        System.out.println("Colleague2 receives message: " + message);
    }
}

// ConcreteMediator
class ConcreteMediator implements Mediator {
    private List<Colleague> colleagues = new ArrayList<>();
    public void addColleague(Colleague colleague) {
        colleagues.add(colleague);
    }
    public void notify(String message, Colleague sender) {
        for (Colleague colleague : colleagues) {
            if (colleague != sender) {
                colleague.receive(message);
            }
        }
    }
}

// Client
public class Main {
    public static void main(String[] args) {
        ConcreteMediator mediator = new ConcreteMediator();
        ConcreteColleague1 colleague1 = new ConcreteColleague1(mediator);
        ConcreteColleague2 colleague2 = new ConcreteColleague2(mediator);

        mediator.addColleague(colleague1);
        mediator.addColleague(colleague2);

        colleague1.send("Hello");
        colleague2.send("Hi");
    }
}
```

### Advantages
- **Reduced coupling between objects**: The mediator decouples the direct communication between objects, making the system components more loosely coupled.
- **Improved maintainability and extensibility of the code**: By centrally managing the interactions between objects, the mediator simplifies the system's complexity.
- **Simplified object protocol**: The Mediator pattern transfers the complex object interaction protocol to the mediator object, making the object protocol simpler.

### Disadvantages
- **Increased complexity of the mediator**: As the number of objects in the system grows, the mediator object may become complex.
- **Potential performance bottleneck**: Because all communication goes through the mediator, the mediator may become a performance bottleneck of the system.

The Mediator pattern is suitable for systems in which the relationships between objects are complex and highly coupled. By introducing a mediator, the system's complexity and coupling can be effectively reduced, improving its maintainability and extensibility.

## Sources

- [S1] GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · Mediator pattern](https://en.wikipedia.org/wiki/Mediator_pattern)
- [Refactoring.Guru · Mediator](https://refactoring.guru/design-patterns/mediator)

<!-- BACKLINKS-AUTO -->
## Related pages

- [god-object](/anti-patterns/god-object.md)
- [overview](overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
