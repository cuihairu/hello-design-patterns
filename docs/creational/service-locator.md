# Service Locator

The Service Locator Pattern is a design pattern that provides a centralized way to obtain services. It maintains references to service instances in a registry, and clients obtain services through the service locator, thereby decoupling services and allowing them to be replaced flexibly.

### Core concepts of the Service Locator Pattern

#### Main components

1. **Service Interface**: defines the public interface of a service, which concrete services must implement.
2. **Concrete Service**: a class that implements the service interface and provides the actual service functionality.
3. **Service Locator**: maintains a registry of service instances and retrieves instances by service name or type.
4. **Client**: obtains service instances from the service locator and calls the service interface.

### Workflow

1. **Register services**: service instances are registered with the service locator during initialization.
2. **Fetch a service**: the client requests the required service instance from the service locator.
3. **Use the service**: the client calls the service interface on the obtained instance.

### Advantages and disadvantages

#### Advantages

1. **Decoupling**: the client is decoupled from concrete service implementations, communicating through the service interface and the service locator.
2. **Flexibility**: service implementations can be swapped dynamically, which eases extension and maintenance.
3. **Centralized management**: service instance creation and management are centralized in the service locator, simplifying service management.

#### Disadvantages

1. **Hidden dependencies**: the client's service dependencies are hidden inside the service locator, which can make dependency management unclear.
2. **Global state**: the service locator is usually global state, which can introduce problems associated with global state, such as difficulty testing and concurrency issues.
3. **Overuse**: if the service locator is overused, the code can become hard to understand and maintain.

### Use cases

- **Dependency injection**: in some cases, a service locator can replace a dependency-injection framework and provide dependency management.
- **Plugin and modular systems**: dynamically loading and replacing service implementations.
- **Large applications**: centrally managing and fetching service instances.

### Example code

Below is example code for the Service Locator Pattern, demonstrated in Java and C++.

#### Java example

```java
import java.util.HashMap;
import java.util.Map;

// Service interface
interface Service {
    void execute();
}

// Concrete service A
class ServiceA implements Service {
    @Override
    public void execute() {
        System.out.println("Executing Service A");
    }
}

// Concrete service B
class ServiceB implements Service {
    @Override
    public void execute() {
        System.out.println("Executing Service B");
    }
}

// Service locator
class ServiceLocator {
    private static Map<String, Service> services = new HashMap<>();

    public static void registerService(String name, Service service) {
        services.put(name, service);
    }

    public static Service getService(String name) {
        return services.get(name);
    }
}

// Client
public class Client {
    public static void main(String[] args) {
        // Register services
        ServiceLocator.registerService("ServiceA", new ServiceA());
        ServiceLocator.registerService("ServiceB", new ServiceB());

        // Fetch and use services
        Service serviceA = ServiceLocator.getService("ServiceA");
        serviceA.execute();

        Service serviceB = ServiceLocator.getService("ServiceB");
        serviceB.execute();
    }
}
```

#### C++ example

```cpp
#include <iostream>
#include <unordered_map>
#include <memory>
#include <string>

// Service interface
class Service {
public:
    virtual void execute() = 0;
};

// Concrete service A
class ServiceA : public Service {
public:
    void execute() override {
        std::cout << "Executing Service A" << std::endl;
    }
};

// Concrete service B
class ServiceB : public Service {
public:
    void execute() override {
        std::cout << "Executing Service B" << std::endl;
    }
};

// Service locator
class ServiceLocator {
private:
    static std::unordered_map<std::string, std::shared_ptr<Service>> services;

public:
    static void registerService(const std::string& name, std::shared_ptr<Service> service) {
        services[name] = service;
    }

    static std::shared_ptr<Service> getService(const std::string& name) {
        return services[name];
    }
};

// Initialize the service registry
std::unordered_map<std::string, std::shared_ptr<Service>> ServiceLocator::services;

// Client
int main() {
    // Register services
    ServiceLocator::registerService("ServiceA", std::make_shared<ServiceA>());
    ServiceLocator::registerService("ServiceB", std::make_shared<ServiceB>());

    // Fetch and use services
    auto serviceA = ServiceLocator::getService("ServiceA");
    serviceA->execute();

    auto serviceB = ServiceLocator::getService("ServiceB");
    serviceB->execute();

    return 0;
}
```

### Summary

By centrally managing and fetching service instances, the Service Locator Pattern provides service decoupling and the ability to replace services flexibly. Although it hides the client's dependencies and may introduce problems associated with global state, in some scenarios — such as plugin systems, modular applications, and dependency-injection management — it is a useful design pattern.

## Sources

- Service locator is not in the [S1] catalog; for the trade-offs against dependency injection see [Fowler · Inversion of Control](https://martinfowler.com/articles/injection.html).
- [Wikipedia · Service locator pattern](https://en.wikipedia.org/wiki/Service_locator_pattern)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](/anti-patterns/overview.md)
- [overview](overview.md)
- [overview](/evolution/overview.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [official-docs](/research/official-docs.md)
