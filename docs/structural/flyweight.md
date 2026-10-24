# Flyweight

The Flyweight Pattern is a structural design pattern that aims to reduce the number of objects created, in order to lower memory usage and improve performance. The Flyweight pattern achieves this by sharing identical or similar objects.

### Use cases
- When the system contains a large number of similar objects, causing high memory overhead.
- When most of an object's state can be externalized, and the object's uniqueness can be identified through that external state.

### Structure
- **Flyweight**: the flyweight interface; defines the object's intrinsic state and extrinsic state.
- **ConcreteFlyweight**: a concrete flyweight; implements the flyweight interface and shares intrinsic state.
- **FlyweightFactory**: the flyweight factory; responsible for creating and managing flyweight objects, ensuring the uniqueness of shared objects.

### Example code

#### C++
```cpp
#include <iostream>
#include <unordered_map>

// Flyweight
class Flyweight {
public:
    virtual void operation(const std::string& externalState) const = 0;
    virtual ~Flyweight() = default;
};

// ConcreteFlyweight
class ConcreteFlyweight : public Flyweight {
private:
    std::string internalState;

public:
    ConcreteFlyweight(const std::string& state) : internalState(state) {}

    void operation(const std::string& externalState) const override {
        std::cout << "Internal State: " << internalState << ", External State: " << externalState << std::endl;
    }
};

// FlyweightFactory
class FlyweightFactory {
private:
    std::unordered_map<std::string, Flyweight*> flyweights;

public:
    Flyweight* getFlyweight(const std::string& key) {
        if (flyweights.find(key) == flyweights.end()) {
            flyweights[key] = new ConcreteFlyweight(key);
        }
        return flyweights[key];
    }

    ~FlyweightFactory() {
        for (auto pair : flyweights) {
            delete pair.second;
        }
    }
};

int main() {
    FlyweightFactory factory;

    Flyweight* fw1 = factory.getFlyweight("state1");
    Flyweight* fw2 = factory.getFlyweight("state1");
    Flyweight* fw3 = factory.getFlyweight("state2");

    fw1->operation("external1");
    fw2->operation("external2");
    fw3->operation("external3");

    return 0;
}
```

#### Go
```go
package main

import (
    "fmt"
)

// Flyweight
type Flyweight interface {
    Operation(externalState string)
}

// ConcreteFlyweight
type ConcreteFlyweight struct {
    internalState string
}

func (f *ConcreteFlyweight) Operation(externalState string) {
    fmt.Printf("Internal State: %s, External State: %s\n", f.internalState, externalState)
}

// FlyweightFactory
type FlyweightFactory struct {
    flyweights map[string]Flyweight
}

func NewFlyweightFactory() *FlyweightFactory {
    return &FlyweightFactory{flyweights: make(map[string]Flyweight)}
}

func (f *FlyweightFactory) GetFlyweight(key string) Flyweight {
    if _, ok := f.flyweights[key]; !ok {
        f.flyweights[key] = &ConcreteFlyweight{internalState: key}
    }
    return f.flyweights[key]
}

func main() {
    factory := NewFlyweightFactory()

    fw1 := factory.GetFlyweight("state1")
    fw2 := factory.GetFlyweight("state1")
    fw3 := factory.GetFlyweight("state2")

    fw1.Operation("external1")
    fw2.Operation("external2")
    fw3.Operation("external3")
}
```

#### Java
```java
import java.util.HashMap;
import java.util.Map;

// Flyweight
interface Flyweight {
    void operation(String externalState);
}

// ConcreteFlyweight
class ConcreteFlyweight implements Flyweight {
    private final String internalState;

    public ConcreteFlyweight(String state) {
        this.internalState = state;
    }

    public void operation(String externalState) {
        System.out.println("Internal State: " + internalState + ", External State: " + externalState);
    }
}

// FlyweightFactory
class FlyweightFactory {
    private final Map<String, Flyweight> flyweights = new HashMap<>();

    public Flyweight getFlyweight(String key) {
        if (!flyweights.containsKey(key)) {
            flyweights.put(key, new ConcreteFlyweight(key));
        }
        return flyweights.get(key);
    }
}

// Client code
public class Main {
    public static void main(String[] args) {
        FlyweightFactory factory = new FlyweightFactory();

        Flyweight fw1 = factory.getFlyweight("state1");
        Flyweight fw2 = factory.getFlyweight("state1");
        Flyweight fw3 = factory.getFlyweight("state2");

        fw1.operation("external1");
        fw2.operation("external2");
        fw3.operation("external3");
    }
}
```

### Advantages and disadvantages of the Flyweight pattern

#### Advantages
- Reduces the number of objects, thereby saving memory.
- The Flyweight pattern can improve performance under certain conditions, because it reduces the overhead of creating and destroying objects.

#### Disadvantages
- Makes the system more complex, since intrinsic state and extrinsic state must be distinguished.
- Managing extrinsic state becomes more complicated, because extrinsic state cannot be shared and must be maintained by the client.

The Flyweight pattern is particularly well suited to scenarios that require large numbers of similar objects with high memory usage, such as graphical objects in a graphics editor or particle systems in games. In these scenarios, sharing objects can significantly reduce memory consumption.

## Sources

- [S1] GoF structural patterns catalog (chapter 4), the original source of this pattern.
- [Wikipedia · Flyweight pattern](https://en.wikipedia.org/wiki/Flyweight_pattern)
- [Refactoring.Guru · Flyweight](https://refactoring.guru/design-patterns/flyweight)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
- [overview](overview.md)
