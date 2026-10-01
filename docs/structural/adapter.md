# 适配器模式

适配器模式（Adapter Pattern）是一种结构型设计模式，它使得原本由于接口不兼容而不能一起工作的类可以协同工作。通过在客户端和现有接口之间插入一个适配器，适配器模式将一个类的接口转换成客户希望的另一个接口，从而使得原本不兼容的接口可以一起工作。

### 适配器模式的使用场景
- 系统需要使用现有的类，而这些类的接口不符合系统的需求。
- 想要创建一个可以重复使用的类，该类可以与一些彼此之间没有太大关联的类或不兼容的类协同工作。
- 需要将多个类的接口进行整合，提供一个统一的接口。

### 适配器模式的结构
- **Target**：目标接口，客户端需要的接口。
- **Adapter**：适配器类，实现了目标接口并与现有的类进行组合。
- **Adaptee**：现有的类，需要适配的类。
- **Client**：使用目标接口的客户端。

### 示例代码

#### C++
```cpp
#include <iostream>
#include <string>

// 目标接口
class Target {
public:
    virtual ~Target() {}
    virtual void request() const = 0;
};

// 需要适配的类
class Adaptee {
public:
    void specificRequest() const {
        std::cout << "Adaptee's specific request" << std::endl;
    }
};

// 适配器类
class Adapter : public Target {
public:
    Adapter(Adaptee* adaptee) : adaptee_(adaptee) {}

    void request() const override {
        adaptee_->specificRequest();
    }

private:
    Adaptee* adaptee_;
};

// 客户端代码
void clientCode(const Target* target) {
    target->request();
}

int main() {
    Adaptee* adaptee = new Adaptee();
    Target* adapter = new Adapter(adaptee);
    clientCode(adapter);

    delete adaptee;
    delete adapter;
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// 目标接口
type Target interface {
    Request()
}

// 需要适配的类
type Adaptee struct{}

func (a *Adaptee) SpecificRequest() {
    fmt.Println("Adaptee's specific request")
}

// 适配器类
type Adapter struct {
    adaptee *Adaptee
}

func (a *Adapter) Request() {
    a.adaptee.SpecificRequest()
}

// 客户端代码
func clientCode(target Target) {
    target.Request()
}

func main() {
    adaptee := &Adaptee{}
    adapter := &Adapter{adaptee}
    clientCode(adapter)
}
```

#### Java
```java
// 目标接口
interface Target {
    void request();
}

// 需要适配的类
class Adaptee {
    void specificRequest() {
        System.out.println("Adaptee's specific request");
    }
}

// 适配器类
class Adapter implements Target {
    private Adaptee adaptee;

    public Adapter(Adaptee adaptee) {
        this.adaptee = adaptee;
    }

    @Override
    public void request() {
        adaptee.specificRequest();
    }
}

// 客户端代码
public class Main {
    public static void main(String[] args) {
        Adaptee adaptee = new Adaptee();
        Target adapter = new Adapter(adaptee);
        adapter.request();
    }
}
```

这些例子展示了如何在 C++、Go 和 Java 中实现适配器模式。每个例子都定义了一个目标接口、需要适配的类和适配器类，并通过客户端代码调用目标接口的方法，适配器将这些调用转发给需要适配的类的方法。