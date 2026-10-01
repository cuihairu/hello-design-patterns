保护代理（Protection Proxy）是一种设计模式，属于结构型模式中的代理模式（Proxy Pattern）的一种变体。保护代理控制对对象的访问，根据访问权限来决定请求是否被处理。

### 使用场景

保护代理模式常用于以下场景：

1. **访问控制**：在不改变原始对象的前提下，限制某些操作的访问权限。例如，某些用户只能读取数据，而不能修改数据。
2. **敏感操作保护**：对敏感操作进行保护，确保只有授权用户才能执行这些操作。
3. **资源保护**：在资源使用时，确保资源不会被未经授权的对象使用。

### 结构

保护代理模式主要包括以下几个角色：

1. **抽象主题（Subject）**：定义真实对象和代理对象的公共接口。
2. **真实主题（RealSubject）**：实现抽象主题接口，处理具体的业务逻辑。
3. **代理（Proxy）**：实现抽象主题接口，负责对真实对象的访问控制。

### 示例代码

#### C++ 示例

```cpp
#include <iostream>
#include <string>

// 抽象主题
class Subject {
public:
    virtual void request() = 0;
};

// 真实主题
class RealSubject : public Subject {
public:
    void request() override {
        std::cout << "RealSubject: Handling request." << std::endl;
    }
};

// 保护代理
class ProtectionProxy : public Subject {
private:
    RealSubject* realSubject;
    std::string userRole;

public:
    ProtectionProxy(const std::string& role) : realSubject(new RealSubject()), userRole(role) {}

    ~ProtectionProxy() {
        delete realSubject;
    }

    void request() override {
        if (userRole == "Admin") {
            realSubject->request();
        } else {
            std::cout << "ProtectionProxy: Access denied." << std::endl;
        }
    }
};

int main() {
    ProtectionProxy proxy1("Admin");
    proxy1.request();  // 输出: RealSubject: Handling request.

    ProtectionProxy proxy2("Guest");
    proxy2.request();  // 输出: ProtectionProxy: Access denied.

    return 0;
}
```

#### Go 示例

```go
package main

import "fmt"

// 抽象主题
type Subject interface {
    Request()
}

// 真实主题
type RealSubject struct{}

func (rs *RealSubject) Request() {
    fmt.Println("RealSubject: Handling request.")
}

// 保护代理
type ProtectionProxy struct {
    realSubject *RealSubject
    userRole    string
}

func NewProtectionProxy(role string) *ProtectionProxy {
    return &ProtectionProxy{realSubject: &RealSubject{}, userRole: role}
}

func (pp *ProtectionProxy) Request() {
    if pp.userRole == "Admin" {
        pp.realSubject.Request()
    } else {
        fmt.Println("ProtectionProxy: Access denied.")
    }
}

func main() {
    proxy1 := NewProtectionProxy("Admin")
    proxy1.Request() // 输出: RealSubject: Handling request.

    proxy2 := NewProtectionProxy("Guest")
    proxy2.Request() // 输出: ProtectionProxy: Access denied.
}
```

#### Java 示例

```java
interface Subject {
    void request();
}

class RealSubject implements Subject {
    public void request() {
        System.out.println("RealSubject: Handling request.");
    }
}

class ProtectionProxy implements Subject {
    private RealSubject realSubject;
    private String userRole;

    public ProtectionProxy(String role) {
        this.realSubject = new RealSubject();
        this.userRole = role;
    }

    public void request() {
        if ("Admin".equals(userRole)) {
            realSubject.request();
        } else {
            System.out.println("ProtectionProxy: Access denied.");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        ProtectionProxy proxy1 = new ProtectionProxy("Admin");
        proxy1.request(); // 输出: RealSubject: Handling request.

        ProtectionProxy proxy2 = new ProtectionProxy("Guest");
        proxy2.request(); // 输出: ProtectionProxy: Access denied.
    }
}
```

### 关键点

1. **访问控制**：保护代理通过检查访问权限，控制对真实对象的访问。
2. **透明性**：客户端通过代理访问真实对象，代理和真实对象都实现相同的接口，对客户端来说是透明的。
3. **安全性**：保护代理有效地防止了未经授权的访问，提升了系统的安全性。

### 总结

保护代理模式通过代理控制对真实对象的访问权限，在不改变原始对象的前提下，实现了访问控制的功能。这种模式在需要保护敏感操作、控制资源访问时非常有用。