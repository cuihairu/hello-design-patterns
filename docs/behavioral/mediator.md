# 中介者模式

中介者模式（Mediator Pattern）是一种行为设计模式，用于减少对象之间的耦合。它通过一个中介者对象来封装对象之间的交互，使对象之间不直接引用对方，而是通过中介者进行通信。这可以使代码更加松耦合和易于维护。

### 使用场景
- 系统中对象之间的交互复杂且呈现网状结构。
- 希望通过中介者集中控制对象之间的交互行为。
- 需要解耦多个对象之间的紧密联系。

### 结构
- **Mediator**：中介者接口，定义了同事对象通信的接口。
- **ConcreteMediator**：具体中介者，实现中介者接口，协调各同事对象的交互。
- **Colleague**：同事类，持有中介者对象的引用，通过中介者与其他同事对象通信。
- **ConcreteColleague**：具体同事类，实现自己的业务逻辑，并通过中介者与其他同事对象通信。

### 示例代码

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

### 优点
- **降低对象间的耦合**：通过中介者解耦对象之间的直接通信，使系统组件更加松耦合。
- **提高代码的可维护性和可扩展性**：通过集中管理对象之间的交互，简化了系统的复杂性。
- **简化对象协议**：中介者模式将复杂的对象交互协议转移到中介者对象，使对象协议简单化。

### 缺点
- **中介者的复杂性增加**：随着系统中对象数量的增加，中介者对象可能会变得复杂。
- **可能导致性能瓶颈**：由于所有的通信都通过中介者进行，中介者可能成为系统的性能瓶颈。

中介者模式适用于对象之间关系复杂且耦合度高的系统。通过引入中介者，可以有效降低系统的复杂度和耦合度，提升系统的可维护性和可扩展性。