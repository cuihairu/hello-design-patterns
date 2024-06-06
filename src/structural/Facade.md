# 外观模式

外观模式（Facade Pattern）是一种结构型设计模式，提供了一个统一的接口，用来访问子系统中的一群接口。它定义了一个高层接口，使得这一子系统更加容易使用。

### 使用场景
- 当你希望为一个复杂的子系统提供一个简单的接口时。
- 当有大量的类需要进行简化调用时。
- 当你希望将子系统与客户端解耦时。

### 结构
- **Facade**：外观类，提供一个高层接口，简化子系统的调用。
- **Subsystem Classes**：子系统类，处理子系统的实际工作。

### 示例代码

#### C++
```cpp
#include <iostream>

// Subsystem Classes
class SubsystemA {
public:
    void operationA() const {
        std::cout << "SubsystemA operationA\n";
    }
};

class SubsystemB {
public:
    void operationB() const {
        std::cout << "SubsystemB operationB\n";
    }
};

class SubsystemC {
public:
    void operationC() const {
        std::cout << "SubsystemC operationC\n";
    }
};

// Facade
class Facade {
private:
    SubsystemA subsystemA;
    SubsystemB subsystemB;
    SubsystemC subsystemC;

public:
    void operation1() {
        std::cout << "Facade operation1\n";
        subsystemA.operationA();
        subsystemB.operationB();
    }

    void operation2() {
        std::cout << "Facade operation2\n";
        subsystemB.operationB();
        subsystemC.operationC();
    }
};

int main() {
    Facade facade;
    facade.operation1();
    facade.operation2();
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Subsystem Classes
type SubsystemA struct{}

func (s *SubsystemA) OperationA() {
    fmt.Println("SubsystemA OperationA")
}

type SubsystemB struct{}

func (s *SubsystemB) OperationB() {
    fmt.Println("SubsystemB OperationB")
}

type SubsystemC struct{}

func (s *SubsystemC) OperationC() {
    fmt.Println("SubsystemC OperationC")
}

// Facade
type Facade struct {
    subsystemA *SubsystemA
    subsystemB *SubsystemB
    subsystemC *SubsystemC
}

func NewFacade() *Facade {
    return &Facade{
        subsystemA: &SubsystemA{},
        subsystemB: &SubsystemB{},
        subsystemC: &SubsystemC{},
    }
}

func (f *Facade) Operation1() {
    fmt.Println("Facade Operation1")
    f.subsystemA.OperationA()
    f.subsystemB.OperationB()
}

func (f *Facade) Operation2() {
    fmt.Println("Facade Operation2")
    f.subsystemB.OperationB()
    f.subsystemC.OperationC()
}

func main() {
    facade := NewFacade()
    facade.Operation1()
    facade.Operation2()
}
```

#### Java
```java
// Subsystem Classes
class SubsystemA {
    public void operationA() {
        System.out.println("SubsystemA operationA");
    }
}

class SubsystemB {
    public void operationB() {
        System.out.println("SubsystemB operationB");
    }
}

class SubsystemC {
    public void operationC() {
        System.out.println("SubsystemC operationC");
    }
}

// Facade
class Facade {
    private SubsystemA subsystemA;
    private SubsystemB subsystemB;
    private SubsystemC subsystemC;

    public Facade() {
        this.subsystemA = new SubsystemA();
        this.subsystemB = new SubsystemB();
        this.subsystemC = new SubsystemC();
    }

    public void operation1() {
        System.out.println("Facade operation1");
        subsystemA.operationA();
        subsystemB.operationB();
    }

    public void operation2() {
        System.out.println("Facade operation2");
        subsystemB.operationB();
        subsystemC.operationC();
    }
}

// Client code
public class Main {
    public static void main(String[] args) {
        Facade facade = new Facade();
        facade.operation1();
        facade.operation2();
    }
}
```

### 外观模式的优点和缺点

#### 优点
- 简化了客户端调用，降低了客户端与子系统间的耦合。
- 通过引入外观模式，可以对客户端屏蔽子系统组件的变化，使得子系统内部组件的变化不会影响到调用它的客户端。
- 外观类对子系统类的接口进行了封装，便于使用。

#### 缺点
- 增加了额外的层次，会在一定程度上增加系统的复杂性。
- 如果设计不当，可能会增加系统类之间的依赖关系，使得子系统难以被独立复用。

外观模式特别适合于复杂系统中的简化调用、解耦和屏蔽内部变化等场景。在实际应用中，外观模式常用于构建更高层次的接口，为底层的复杂操作提供统一的简单接口。