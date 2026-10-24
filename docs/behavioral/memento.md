# Memento

The Memento pattern is a behavioral design pattern that allows capturing and restoring an object's internal state without violating encapsulation. The Memento pattern saves an object's state into a memento object so that it can later be restored to a previous state when needed.

### Components of the Memento pattern

1. **Originator (Originator)**: Creates a memento containing its current internal state and uses mementos to restore its internal state.
2. **Memento (Memento)**: Stores the originator's internal state, preventing objects other than the originator from accessing the memento. The memento has two interfaces:
   - **Narrow interface**: Only allows the originator to access it for restoration.
   - **Wide interface**: Allows any object holding the memento to access it.
3. **Caretaker (Caretaker)**: Responsible for storing mementos, but cannot modify or access the memento's content; it can only pass the memento to other objects.

### Advantages of the Memento pattern

1. **Encapsulation**: Preserves the object's encapsulation; the outside world cannot access the object's internal state.
2. **Simplifies restoration**: Allows restoring an object to a previous state when needed, simplifying the state restoration operation.

### Disadvantages of the Memento pattern

1. **Resource consumption**: Saving and restoring a large amount of state may consume a lot of memory and resources.
2. **Complexity**: Introduces new classes and interfaces, increasing system complexity.

### Use cases

1. **Need to save and restore multiple states of an object.**
2. **Want to use external storage to preserve an object's historical states.**
3. **Do not want to break the object's encapsulation.**

### Example code

#### C++ implementation

```cpp
#include <iostream>
#include <string>
#include <vector>

class Memento {
public:
    Memento(const std::string& state) : state(state) {}
    std::string getState() const { return state; }

private:
    std::string state;
};

class Originator {
public:
    void setState(const std::string& state) {
        this->state = state;
        std::cout << "State set to " << state << std::endl;
    }

    std::string getState() const { return state; }

    Memento saveStateToMemento() {
        return Memento(state);
    }

    void getStateFromMemento(const Memento& memento) {
        state = memento.getState();
    }

private:
    std::string state;
};

class Caretaker {
public:
    void addMemento(const Memento& memento) {
        mementos.push_back(memento);
    }

    Memento getMemento(int index) {
        return mementos[index];
    }

private:
    std::vector<Memento> mementos;
};

int main() {
    Originator originator;
    Caretaker caretaker;

    originator.setState("State1");
    originator.setState("State2");
    caretaker.addMemento(originator.saveStateToMemento());

    originator.setState("State3");
    caretaker.addMemento(originator.saveStateToMemento());

    originator.setState("State4");

    std::cout << "Current State: " << originator.getState() << std::endl;
    originator.getStateFromMemento(caretaker.getMemento(1));
    std::cout << "Restored to State: " << originator.getState() << std::endl;
    originator.getStateFromMemento(caretaker.getMemento(0));
    std::cout << "Restored to State: " << originator.getState() << std::endl;

    return 0;
}
```

#### Go implementation

```go
package main

import "fmt"

type Memento struct {
	state string
}

func (m *Memento) GetState() string {
	return m.state
}

type Originator struct {
	state string
}

func (o *Originator) SetState(state string) {
	o.state = state
	fmt.Println("State set to", state)
}

func (o *Originator) SaveStateToMemento() *Memento {
	return &Memento{state: o.state}
}

func (o *Originator) GetStateFromMemento(memento *Memento) {
	o.state = memento.GetState()
}

type Caretaker struct {
	mementos []*Memento
}

func (c *Caretaker) AddMemento(memento *Memento) {
	c.mementos = append(c.mementos, memento)
}

func (c *Caretaker) GetMemento(index int) *Memento {
	return c.mementos[index]
}

func main() {
	originator := &Originator{}
	caretaker := &Caretaker{}

	originator.SetState("State1")
	originator.SetState("State2")
	caretaker.AddMemento(originator.SaveStateToMemento())

	originator.SetState("State3")
	caretaker.AddMemento(originator.SaveStateToMemento())

	originator.SetState("State4")

	fmt.Println("Current State:", originator.state)
	originator.GetStateFromMemento(caretaker.GetMemento(1))
	fmt.Println("Restored to State:", originator.state)
	originator.GetStateFromMemento(caretaker.GetMemento(0))
	fmt.Println("Restored to State:", originator.state)
}
```

#### Java implementation

```java
import java.util.ArrayList;
import java.util.List;

class Memento {
    private String state;

    public Memento(String state) {
        this.state = state;
    }

    public String getState() {
        return state;
    }
}

class Originator {
    private String state;

    public void setState(String state) {
        this.state = state;
        System.out.println("State set to " + state);
    }

    public String getState() {
        return state;
    }

    public Memento saveStateToMemento() {
        return new Memento(state);
    }

    public void getStateFromMemento(Memento memento) {
        state = memento.getState();
    }
}

class Caretaker {
    private List<Memento> mementoList = new ArrayList<>();

    public void add(Memento state) {
        mementoList.add(state);
    }

    public Memento get(int index) {
        return mementoList.get(index);
    }
}

public class MementoPatternDemo {
    public static void main(String[] args) {
        Originator originator = new Originator();
        Caretaker caretaker = new Caretaker();

        originator.setState("State1");
        originator.setState("State2");
        caretaker.add(originator.saveStateToMemento());

        originator.setState("State3");
        caretaker.add(originator.saveStateToMemento());

        originator.setState("State4");

        System.out.println("Current State: " + originator.getState());
        originator.getStateFromMemento(caretaker.get(1));
        System.out.println("Restored to State: " + originator.getState());
        originator.getStateFromMemento(caretaker.get(0));
        System.out.println("Restored to State: " + originator.getState());
    }
}
```

### Summary of advantages and disadvantages

#### Advantages

1. **Encapsulation**: Preserves the object's encapsulation; the outside world cannot access the object's internal state.
2. **Simplifies restoration**: Allows restoring an object to a previous state when needed, simplifying the state restoration operation.
3. **State history**: Can store an object's historical states, supporting undo and restore operations.

#### Disadvantages

1. **Resource consumption**: Saving and restoring a large amount of state may consume a lot of memory and resources, especially when an object's state changes frequently and contains a lot of state information.
2. **Complexity**: Introduces new classes and interfaces, increasing system complexity, particularly when implementing relatively complex state saving and restoration logic.

The Memento pattern is very useful in real development, especially in scenarios where multiple states of an object need to be saved and restored. By using this pattern, an object's state can be saved into a memento and then restored when needed, simplifying code and improving maintainability.

## Sources

- [S1] GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · Memento pattern](https://en.wikipedia.org/wiki/Memento_pattern)
- [Refactoring.Guru · Memento](https://refactoring.guru/design-patterns/memento)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [snapshot](snapshot.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
