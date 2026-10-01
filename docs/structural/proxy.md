# 代理模式

代理模式（Proxy Pattern）是一种结构型设计模式，它为其他对象提供一种代理以控制对这个对象的访问。代理模式通常用于懒加载、访问控制、日志记录等场景。代理对象在客户端和目标对象之间起到中介的作用，客户端通过代理对象访问目标对象，代理对象可以在调用目标对象的方法之前或之后做一些额外的操作。

### 使用场景
- **远程代理**：为一个对象在不同地址空间提供局部代表。例如，隐藏一个对象存在于不同地址空间的事实。
- **虚拟代理**：根据需要创建开销很大的对象。例如，某个对象在创建的时候需要较长时间，则在客户端真正需要的时候再创建。
- **保护代理**：控制对原始对象的访问。例如，在对象前加上一个代理，通过代理对原始对象的访问进行控制。
- **智能指引**：取代了简单指针，它在访问对象时执行一些附加操作。

### 结构
- **Subject**：定义了 RealSubject 和 Proxy 的共同接口，这样就可以在任何使用 RealSubject 的地方都可以使用 Proxy。
- **RealSubject**：定义了 Proxy 所代表的真实实体。
- **Proxy**：保存一个引用使得代理可以访问实体，并提供一个与 Subject 的接口相同的接口。

### 示例代码

#### C++
```cpp
#include <iostream>

// Subject
class Subject {
public:
    virtual void request() const = 0;
    virtual ~Subject() = default;
};

// RealSubject
class RealSubject : public Subject {
public:
    void request() const override {
        std::cout << "RealSubject: Handling request.\n";
    }
};

// Proxy
class Proxy : public Subject {
private:
    RealSubject* realSubject;

public:
    Proxy() : realSubject(new RealSubject()) {}

    ~Proxy() {
        delete realSubject;
    }

    void request() const override {
        std::cout << "Proxy: Checking access prior to firing a real request.\n";
        realSubject->request();
    }
};

int main() {
    Subject* subject = new Proxy();
    subject->request();
    delete subject;
    return 0;
}
```

#### Go
```go
package main

import "fmt"

// Subject
type Subject interface {
    Request()
}

// RealSubject
type RealSubject struct{}

func (rs *RealSubject) Request() {
    fmt.Println("RealSubject: Handling request.")
}

// Proxy
type Proxy struct {
    realSubject *RealSubject
}

func NewProxy() *Proxy {
    return &Proxy{realSubject: &RealSubject{}}
}

func (p *Proxy) Request() {
    fmt.Println("Proxy: Checking access prior to firing a real request.")
    p.realSubject.Request()
}

func main() {
    var subject Subject = NewProxy()
    subject.Request()
}
```

#### Java
```java
// Subject
interface Subject {
    void request();
}

// RealSubject
class RealSubject implements Subject {
    public void request() {
        System.out.println("RealSubject: Handling request.");
    }
}

// Proxy
class Proxy implements Subject {
    private RealSubject realSubject;

    public Proxy() {
        this.realSubject = new RealSubject();
    }

    @Override
    public void request() {
        System.out.println("Proxy: Checking access prior to firing a real request.");
        realSubject.request();
    }
}

// 客户端代码
public class Main {
    public static void main(String[] args) {
        Subject subject = new Proxy();
        subject.request();
    }
}
```

这些例子展示了如何在 C++、Go 和 Java 中实现代理模式。在每个例子中，代理类都实现了与目标对象相同的接口，客户端通过代理对象访问目标对象的方法，代理对象在调用目标对象的方法之前或之后执行一些额外的操作。