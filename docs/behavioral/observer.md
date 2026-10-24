# Observer

The Observer pattern is a behavioral design pattern. It defines a one-to-many dependency between objects so that when one object changes state, all of its dependents are notified and can update themselves automatically.

### Use cases
- When a change to one object needs to change other objects simultaneously, and it does not know how many objects need to change.
- When an object must notify other objects, but it wants to remain loosely coupled.

### Structure
- **Subject**: the subject interface, defining methods for registering, unregistering, and notifying observers.
- **ConcreteSubject**: the concrete subject, implementing the subject interface; when its internal state changes, it notifies all registered observers.
- **Observer**: the observer interface, defining an update method called when the observer receives notification from the subject.
- **ConcreteObserver**: the concrete observer, implementing the update method to keep its own state consistent with the subject's state.

### Example code

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
import java.util.ArrayList;
import java.util.List;

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

### Pros and cons of the Observer pattern

#### Pros
- Observers and subjects are coupled at an abstraction level, and are independent of each other.
- Supports broadcast communication; the subject automatically notifies all registered observers.
- Follows the open/closed principle; adding new observers requires no changes to existing code.

#### Cons
- If there are too many observers, the notification time becomes long, affecting performance.
- There is a dependency between observers and subjects, which can lead to memory leaks.

The Observer pattern applies to scenarios that need broadcast notifications. By separating state maintenance from notification logic, it improves the system's flexibility and extensibility.

## Sources

- [S1] The GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern)
- [Refactoring.Guru · Observer](https://refactoring.guru/design-patterns/observer)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [circuit-breaker](/evolution/circuit-breaker.md)
- [glossary](/glossary.md)
- [message-router](/integration/message-router.md)
- [overview](/integration/overview.md)
- [publish-subscribe](/integration/publish-subscribe.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
- [official-docs](/research/official-docs.md)
