# Dependency Injection

Dependency Injection (DI) is a design pattern used to decouple the dependencies between objects. With dependency injection, an object's dependencies can be configured externally, which improves the maintainability and testability of the code.

### The core idea of dependency injection

The core idea of dependency injection is to move the management of an object's dependencies from inside the object to the outside, with an external component (usually a DI container) providing the dependencies the object needs. In this way, an object no longer has to create or look up its own dependencies; instead, they are passed in from the outside.

### Approaches to dependency injection

There are three main approaches to dependency injection:

1. **Constructor injection**: dependencies are passed in through the constructor.
2. **Setter injection**: dependencies are passed in through setter methods.
3. **Interface injection**: dependencies are passed in by implementing an interface.

### Example code

The following example code demonstrates constructor injection, setter injection, and interface injection, shown in C++, Go, and Java respectively.

#### Constructor injection

##### C++ example

```cpp
#include <iostream>
#include <memory>

// Service Interface
class Service {
public:
    virtual void execute() = 0;
    virtual ~Service() = default;
};

// Service Implementation
class ConcreteService : public Service {
public:
    void execute() override {
        std::cout << "Executing service..." << std::endl;
    }
};

// Client
class Client {
public:
    explicit Client(std::shared_ptr<Service> service) : service_(std::move(service)) {}
    void performTask() {
        service_->execute();
    }

private:
    std::shared_ptr<Service> service_;
};

int main() {
    auto service = std::make_shared<ConcreteService>();
    Client client(service);
    client.performTask();

    return 0;
}
```

#### Setter injection

##### Go example

```go
package main

import "fmt"

// Service interface
type Service interface {
    Execute()
}

// ConcreteService struct
type ConcreteService struct{}

func (s *ConcreteService) Execute() {
    fmt.Println("Executing service...")
}

// Client struct
type Client struct {
    service Service
}

func (c *Client) SetService(service Service) {
    c.service = service
}

func (c *Client) PerformTask() {
    c.service.Execute()
}

func main() {
    service := &ConcreteService{}
    client := &Client{}
    client.SetService(service)
    client.PerformTask()
}
```

#### Interface injection

##### Java example

```java
// Service interface
interface Service {
    void execute();
}

// ConcreteService implementation
class ConcreteService implements Service {
    public void execute() {
        System.out.println("Executing service...");
    }
}

// ServiceConsumer interface
interface ServiceConsumer {
    void setService(Service service);
    void performTask();
}

// Client implementation
class Client implements ServiceConsumer {
    private Service service;

    @Override
    public void setService(Service service) {
        this.service = service;
    }

    @Override
    public void performTask() {
        service.execute();
    }
}

public class Main {
    public static void main(String[] args) {
        Service service = new ConcreteService();
        Client client = new Client();
        client.setService(service);
        client.performTask();
    }
}
```

### Advantages and disadvantages of dependency injection

#### Advantages

1. **Decoupling**: moves an object's dependencies from the inside to the outside, reducing coupling between classes.
2. **Testability**: dependent objects can be easily replaced, which facilitates unit testing.
3. **Maintainability**: with a dependency injection container, object creation and lifecycle can be managed more effectively, improving code maintainability.
4. **Flexibility**: dependencies are determined at runtime rather than compile time, making the system more flexible.

#### Disadvantages

1. **Increased complexity**: introducing a DI framework and container may increase system complexity.
2. **Harder debugging**: since dependencies are defined through configuration files or annotations, debugging can become more difficult.
3. **Performance overhead**: a dependency injection container resolves dependencies at runtime, which may introduce some performance overhead.

### Using a dependency injection framework

In my projects I usually use a dependency injection framework to manage dependencies, for example:

- Spring Framework in Java
- ASP.NET Core Dependency Injection in .NET
- Boost.DI in C++
- Google Wire in Go

These frameworks and libraries provide dependency injection capabilities; they centralize the management of object relationships and make the code easier to maintain and test.

### Summary

Dependency injection is a powerful design pattern that decouples objects by moving the management of an object's dependencies from the inside to the outside. Using dependency injection improves the maintainability, testability, and flexibility of the code, but the trade-off between complexity and performance overhead must be kept in mind. In real-world development, choosing a suitable dependency injection framework lets you manage dependencies effectively and improves development efficiency.

## Sources

- [Wikipedia · Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection)
- [Fowler · Inversion of Control](https://martinfowler.com/articles/injection.html) (the trade-offs between DI and Service Locator).
- [S27] The application-context chapter of the Spring Framework documentation (see the research overview for the list)

<!-- BACKLINKS-AUTO -->
## Related pages

- [golden-hammer](/anti-patterns/golden-hammer.md)
- [overview](/anti-patterns/overview.md)
- [overview](/evolution/overview.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [repository](/other/repository.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [official-docs](/research/official-docs.md)
- [overview](overview.md)
