# Structural Patterns Overview

**Main problem solved**: How classes and objects are composed together. These patterns combine objects in various ways to form larger structures.
Structural patterns focus on how to compose classes and objects into larger structures while keeping those structures flexible and efficient. They primarily use two mechanisms—inheritance and composition—to add new capabilities to a system without changing existing code.

### Patterns in this directory

- [Adapter](/structural/adapter): Converts the interface of one class into another interface that clients expect, allowing originally incompatible classes to work together.
- [Decorator](/structural/decorator): Dynamically adds responsibilities to an object without changing its interface.
- [Proxy](/structural/proxy): Provides a surrogate for another object to control access to it.
- [Virtual Proxy](/structural/virtual-proxy): Defers the creation of expensive objects until they are truly needed.
- [Protection Proxy](/structural/protection-proxy): Controls access to the real object based on access permissions.
- [Remote Proxy](/structural/remote-proxy): Provides a local representative for objects in different address spaces, hiding the details of remote communication.
- [Dynamic Proxy](/structural/dynamic-proxy): Generates proxy classes at runtime to uniformly handle cross-cutting concerns such as logging and transactions.
- [Smart Pointer](/structural/smart-pointer): Attaches additional operations when accessing an object in the form of a smart pointer, and manages resources automatically.
- [Facade](/structural/facade): Provides a unified high-level interface for a group of interfaces in a subsystem, simplifying the use of that subsystem.
- [Remote Facade and Data Transfer Objects](/structural/remote-facade): Do not place domain objects across process boundaries; instead use coarse-grained, use-case-split interfaces and dedicated transfer objects.
- [Bridge](/structural/bridge): Separates the abstraction from the implementation so that the two can vary independently.
- [Bidirectional Bridge](/structural/bidirectional-bridge): Extends Bridge to support bidirectional communication between two hierarchies.
- [Composite](/structural/composite): Composes objects into a tree structure to represent "part-whole" hierarchies, allowing clients to use individual objects and composite objects uniformly.
- [Flyweight](/structural/flyweight): Supports a large number of fine-grained objects through sharing to reduce memory usage.
- [Dependency Injection](/structural/dependency-injection): Provides the dependencies an object needs from an external container, decoupling objects from one another.

### Selection guidance

- Use Adapter when interfaces are incompatible; use Facade when an interface is too complex; use Remote Facade with DTOs when an interface must cross process boundaries—do not put fine-grained object interfaces on the network.
- Choose Proxy and its variants when you need to control access, defer loading, or attach extra behavior.
- Use Decorator when you need to layer behavior dynamically, rather than creating a large number of subclasses.
- Use Bridge when there are multiple independent dimensions of variation; consider Flyweight when there are many similar objects.

## Sources

- [S1] The GoF catalog lists structural patterns as the second group (7 of them); this section follows that and adds entries such as proxy variants and smart pointers.
- [Refactoring.Guru · Structural Patterns](https://refactoring.guru/design-patterns/structural-patterns)
- [Wikipedia · Software design pattern](https://en.wikipedia.org/wiki/Software_design_pattern)

<!-- BACKLINKS-AUTO -->
## Related pages

- [reference](/reference.md)
