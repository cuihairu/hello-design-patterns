# 观察者模式

观察者模式（Observer Pattern）是一种行为型设计模式，它定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象。当主题对象的状态发生变化时，它会通知所有观察者对象，使它们能够自动更新。

### 使用场景
- 当一个对象的改变需要同时改变其他对象，而且它不知道具体有多少对象需要改变时。
- 当一个对象必须通知其他对象，但它又希望保持松散耦合时。

### 结构
- **Subject**：主题接口，定义注册、注销和通知观察者的方法。
- **ConcreteSubject**：具体主题，实现主题接口，内部状态发生改变时，通知所有注册的观察者。
- **Observer**：观察者接口，定义一个更新接口，当收到主题的通知时进行更新。
- **ConcreteObserver**：具体观察者，实现更新接口，以使自身状态与主题的状态保持一致。

### 示例代码

#### C++
```cpp
#include <iostream>
#include <vector>
#include <algorithm>

// Observer Interface
class Observer {
public:
    virtual ~Observer() = default;
    virtual void update(int state) = 0;
};

// Concrete Observer
class ConcreteObserver : public Observer {
private:
    int observerState;
public:
    void update(int state) override {
        observerState = state;
        std::cout << "Observer State updated to " << observerState << std::endl;
    }
};

// Subject Interface
class Subject {
public:
    virtual ~Subject() = default;
    virtual void attach(Observer* observer) = 0;
    virtual void detach(Observer* observer) = 0;
    virtual void notify() = 0;
};

// Concrete Subject
class ConcreteSubject : public Subject {
private:
    std::vector<Observer*> observers;
    int subjectState;
public:
    void attach(Observer* observer) override {
        observers.push_back(observer);
    }

    void detach(Observer* observer) override {
        observers.erase(std::remove(observers.begin(), observers.end(), observer), observers.end());
    }

    void notify() override {
        for (auto* observer : observers) {
            observer->update(subjectState);
        }
    }

    void setState(int state) {
        subjectState = state;
        notify();
    }
};

int main() {
    ConcreteSubject subject;
    ConcreteObserver observer1, observer2;

    subject.attach(&observer1);
    subject.attach(&observer2);

    subject.setState(10);

    subject.detach(&observer1);

    subject.setState(20);

    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Observer Interface
type Observer interface {
    Update(state int)
}

// Concrete Observer
type ConcreteObserver struct {
    observerState int
}

func (o *ConcreteObserver) Update(state int) {
    o.observerState = state
    fmt.Printf("Observer State updated to %d\n", o.observerState)
}

// Subject Interface
type Subject interface {
    Attach(observer Observer)
    Detach(observer Observer)
    Notify()
}

// Concrete Subject
type ConcreteSubject struct {
    observers   []Observer
    subjectState int
}

func (s *ConcreteSubject) Attach(observer Observer) {
    s.observers = append(s.observers, observer)
}

func (s *ConcreteSubject) Detach(observer Observer) {
    for i, obs := range s.observers {
        if obs == observer {
            s.observers = append(s.observers[:i], s.observers[i+1:]...)
            break
        }
    }
}

func (s *ConcreteSubject) Notify() {
    for _, observer := range s.observers {
        observer.Update(s.subjectState)
    }
}

func (s *ConcreteSubject) SetState(state int) {
    s.subjectState = state
    s.Notify()
}

func main() {
    subject := &ConcreteSubject{}
    observer1 := &ConcreteObserver{}
    observer2 := &ConcreteObserver{}

    subject.Attach(observer1)
    subject.Attach(observer2)

    subject.SetState(10)

    subject.Detach(observer1)

    subject.SetState(20)
}
```

#### Java
```java
// Observer Interface
interface Observer {
    void update(int state);
}

// Concrete Observer
class ConcreteObserver implements Observer {
    private int observerState;

    @Override
    public void update(int state) {
        observerState = state;
        System.out.println("Observer State updated to " + observerState);
    }
}

// Subject Interface
interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers();
}

// Concrete Subject
class ConcreteSubject implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private int subjectState;

    @Override
    public void attach(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void detach(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(subjectState);
        }
    }

    public void setState(int state) {
        subjectState = state;
        notifyObservers();
    }
}

// Client code
public class Main {
    public static void main(String[] args) {
        ConcreteSubject subject = new ConcreteSubject();
        ConcreteObserver observer1 = new ConcreteObserver();
        ConcreteObserver observer2 = new ConcreteObserver();

        subject.attach(observer1);
        subject.attach(observer2);

        subject.setState(10);

        subject.detach(observer1);

        subject.setState(20);
    }
}
```

### 观察者模式的优点和缺点

#### 优点
- 观察者和被观察者之间是抽象耦合，彼此独立。
- 支持广播通信，被观察者会自动通知所有注册的观察者。
- 符合开闭原则，新增观察者无需修改原有代码。

#### 缺点
- 如果观察者过多，通知的时间会较长，影响性能。
- 观察者和被观察者之间有依赖关系，可能导致内存泄漏。

观察者模式适用于需要广播通知的场景，通过将状态的维护和通知逻辑分离，提高系统的灵活性和可扩展性。