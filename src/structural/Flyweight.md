# 享元模式

享元模式（Flyweight Pattern）是一种结构型设计模式，旨在减少对象创建的数量，以减小内存占用并提高性能。享元模式通过共享相同或相似的对象来实现这一目标。

### 使用场景
- 系统中有大量相似对象，导致内存开销很大时。
- 对象的大多数状态都可以外部化，并且可以通过这些外部状态来识别对象的唯一性时。

### 结构
- **Flyweight**：享元接口，定义对象的内部状态和外部状态。
- **ConcreteFlyweight**：具体享元，实现享元接口并共享内部状态。
- **FlyweightFactory**：享元工厂，负责创建和管理享元对象，确保共享对象的唯一性。

### 示例代码

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

### 享元模式的优点和缺点

#### 优点
- 减少了对象的数量，从而节省内存。
- 享元模式可以在某些条件下提高性能，因为减少了创建和销毁对象的开销。

#### 缺点
- 使得系统更加复杂，需要区分内部状态和外部状态。
- 外部状态的管理复杂化，因为外部状态不能被共享，必须由客户端维护。

享元模式特别适合用于需要大量相似对象且内存占用较大的场景，例如图形编辑器中的图形对象、游戏中的粒子系统等。在这些场景中，通过共享对象可以显著减少内存消耗。