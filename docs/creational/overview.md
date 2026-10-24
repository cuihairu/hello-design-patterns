# Creational Patterns Overview

**The main problem addressed**: how objects are created. These patterns improve a system's flexibility and extensibility by decoupling the creation process from its concrete types. Creational patterns encapsulate the "how an object is created" point of variation, so clients depend only on abstract interfaces and need not worry about concrete types or construction details. Common implementation approaches include hiding constructors, centralizing creation logic in factories or builders, and creating new objects by copying existing instances.

### Patterns in this directory

- [Singleton](/creational/singleton): Ensures a class has only one instance and provides a global access point.
- [Factory Method](/creational/factory-method): Defines an interface for creating objects, letting subclasses decide which class to instantiate.
- [Abstract Factory](/creational/abstract-factory): Creates families of related or interdependent objects without specifying their concrete classes.
- [Builder](/creational/builder): Separates the construction of a complex object from its representation, so the same construction process can create different representations.
- [Prototype](/creational/prototype): Creates new objects by copying existing instances, avoiding repeated expensive initialization.
- [Multiton](/creational/multiton): Ensures at most one instance per key; a keyed variant of Singleton.
- [Object Pool](/creational/object-pool): Manages a pool of reusable objects, reducing frequent creation and destruction of expensive objects.
- [Service Locator](/creational/service-locator): Retrieves service instances by name or type through a central registry, decoupling service usage.

### Selection guidance

- When only a single global instance is needed, prefer Singleton, and pay attention to initialization safety under multithreading.
- When creation logic must vary with the environment or concrete types need to be decoupled, choose Factory Method or Abstract Factory.
- When construction has many parameters or ordered step dependencies, use Builder instead of a long chain of constructors.
- When objects are expensive to create and can be reused, use Prototype or Object Pool.

## Sources

- [S1] The GoF catalog lists creational patterns as the first group (5 patterns); this section follows that catalog and extends it with non-GoF entries.
- [Refactoring.Guru · Creational patterns](https://refactoring.guru/design-patterns/creational-patterns)
- [Wikipedia · Software design pattern](https://en.wikipedia.org/wiki/Software_design_pattern)

<!-- BACKLINKS-AUTO -->
## Related pages

- [reference](/reference.md)
