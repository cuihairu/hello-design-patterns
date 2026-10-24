# Protection Proxy

Protection Proxy is a design pattern and a variant of the Proxy Pattern within structural patterns. A protection proxy controls access to an object, deciding whether a request is processed based on access permissions.

### Use cases

The protection proxy pattern is commonly used in the following scenarios:

1. **Access control**: restricts the access permissions of certain operations without altering the original object. For example, some users may only be able to read data, but not modify it.
2. **Protecting sensitive operations**: protects sensitive operations so that only authorized users can perform them.
3. **Resource protection**: ensures resources are not used by unauthorized objects when they are in use.

### Structure

The protection proxy pattern mainly includes the following roles:

1. **Subject**: defines the public interface shared by the real subject and the proxy.
2. **RealSubject**: implements the Subject interface and handles the specific business logic.
3. **Proxy**: implements the Subject interface and is responsible for access control of the real subject.

### Example code

#### C++ example

```cpp
#include <iostream>
#include <string>

// Subject
class Subject {
public:
    virtual void request() = 0;
};

// Real subject
class RealSubject : public Subject {
public:
    void request() override {
        std::cout << "RealSubject: Handling request." << std::endl;
    }
};

// Protection proxy
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
    proxy1.request();  // Output: RealSubject: Handling request.

    ProtectionProxy proxy2("Guest");
    proxy2.request();  // Output: ProtectionProxy: Access denied.

    return 0;
}
```

#### Go example

```go
package main

import "fmt"

// Subject
type Subject interface {
    Request()
}

// Real subject
type RealSubject struct{}

func (rs *RealSubject) Request() {
    fmt.Println("RealSubject: Handling request.")
}

// Protection proxy
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
    proxy1.Request() // Output: RealSubject: Handling request.

    proxy2 := NewProtectionProxy("Guest")
    proxy2.Request() // Output: ProtectionProxy: Access denied.
}
```

#### Java example

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
        proxy1.request(); // Output: RealSubject: Handling request.

        ProtectionProxy proxy2 = new ProtectionProxy("Guest");
        proxy2.request(); // Output: ProtectionProxy: Access denied.
    }
}
```

### Key points

1. **Access control**: the protection proxy controls access to the real subject by checking access permissions.
2. **Transparency**: clients access the real subject through the proxy; since both the proxy and the real subject implement the same interface, this is transparent to clients.
3. **Security**: the protection proxy effectively prevents unauthorized access and improves system security.

### Summary

The protection proxy pattern uses a proxy to control access permissions to the real subject, implementing access control without altering the original object. This pattern is very useful when sensitive operations need to be protected or resource access needs to be controlled.

## Sources

- [Wikipedia · Proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern) (see that entry for variant terminology).
- [Refactoring.Guru · Proxy](https://refactoring.guru/design-patterns/proxy)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [introduction](/introduction.md)
- [reference](/reference.md)
- [official-docs](/research/official-docs.md)
- [overview](overview.md)
