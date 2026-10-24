# Introduction

This page is my category-based index of the patterns, for looking up purpose and examples; the trade-offs and implementation notes live in each full page. Take singleton as an example: [common uses are listed here](#creational-patterns), the [glossary](/glossary#singleton-pattern) gives the definition, and my discussion of the implementation is in the [singleton page](/creational/singleton).

Design patterns are usually grouped into three classic categories:
- **Creational Patterns**
- **Structural Patterns**
- **Behavioral Patterns**

Beyond these three classic categories, concurrent programming and domain-specific practice have each produced their own mature pattern catalogs, and I keep those records here too:

- **Concurrency Patterns**
- **Domain-Specific Patterns**

These categories are how I organize patterns when taking notes. Below are the categories and their common patterns, for lookup by topic:

## Creational Patterns

These patterns deal mainly with object creation, aiming to separate object creation from object use.

#### 1. **Singleton Pattern**
    - **Purpose**: Ensure a class has only one instance and provide a global point of access to it.
    - **Example**: A database connection pool.

#### 2. **Factory Method Pattern**
    - **Purpose**: Define an interface for creating an object, but let subclasses decide which class to instantiate.
    - **Example**: A logger that can create different logging methods.

#### 3. **Abstract Factory Pattern**
    - **Purpose**: Provide an interface for creating families of related or dependent objects without specifying their concrete classes.
    - **Example**: A cross-platform UI component library.

#### 4. **Builder Pattern**
    - **Purpose**: Separate the construction of a complex object so the same construction process can create different representations.
    - **Example**: Producing complex document formats (PDF, HTML).

#### 5. **Prototype Pattern**
    - **Purpose**: Specify the kinds of objects to create using a prototypical instance, and create new objects by copying it.
    - **Example**: Copy-paste in a clipboard.

#### 6. **Object Pool Pattern**
    - **Purpose**: Manage and reuse a set of pre-created objects, avoiding the overhead of frequent creation and destruction.
    - **Typical scenarios**:
        - **Database connection pool**: Object pools manage database connections in drivers, reducing frequent connect/disconnect and improving performance.
        - **Thread pool**: In multithreaded programming, a thread pool manages and reuses threads, avoiding frequent thread creation and destruction and improving responsiveness.
        - **Object caching**: Cache frequently used objects in memory — string caches, instance caches — to reduce creation and destruction overhead.
        - **Resource management**: Manage limited resources such as file handles and network connections so they are not exhausted.
    - **Example**: A database connection pool.

#### 7. **Service Locator Pattern**
    - **Purpose**: Encapsulate service lookup and retrieval behind a centralized registry; clients request service instances from the locator by name or type, decoupling themselves from concrete implementations.
    - **Example**: Service discovery in distributed systems.

#### 8. **Multiton Pattern**
    - **Purpose**: Ensure a class has at most one instance per given key.
    - **Example**: A database connection pool with different database instances.

## Structural Patterns

These patterns deal mainly with object and class composition, using inheritance and composition to build larger structures.

#### 1. **Adapter Pattern**
    - **Purpose**: Convert one class's interface into another interface clients expect, letting incompatible classes work together.
    - **Example**: A power adapter.

#### 2. **Decorator Pattern**
    - **Purpose**: Attach responsibilities to objects dynamically without changing their interface.
    - **Example**: Adding features to a text editor (bold, italic).

#### 3. **Proxy Pattern**
    - **Purpose**: Provide a surrogate for another object to control access to it.
    - **Example**: Remote proxy (remote calls), virtual proxy (lazy loading).
    - **Variants**: [Remote proxy](/structural/remote-proxy), [virtual proxy](/structural/virtual-proxy), [protection proxy](/structural/protection-proxy), and [dynamic proxy](/structural/dynamic-proxy), each with its own page.

#### 4. **Facade Pattern**
    - **Purpose**: Provide a unified high-level interface to a set of interfaces in a subsystem, simplifying its use.
    - **Example**: Simplifying complex API calls.

#### 5. **Bridge Pattern**
    - **Purpose**: Decouple an abstraction from its implementation so the two can vary independently.
    - **Example**: Separating shapes and colors in a graphics drawing system.

#### 6. **Composite Pattern**
    - **Purpose**: Compose objects into tree structures representing part-whole hierarchies.
    - **Example**: Files and folders in a file system.

#### 7. **Flyweight Pattern**
    - **Purpose**: Use sharing to support large numbers of fine-grained objects efficiently.
    - **Example**: An object pool of characters in a text editor.

#### 8. **Dependency Injection**
    - **Purpose**: The main purpose is managing dependencies between objects.
    - **Example**: The Java Spring framework.

#### 9. **Bidirectional Bridge**
    - **Purpose**: Mainly for scenarios that need two-way communication and interaction; it provides a flexible, decoupled way to achieve that.
    - **Example**: Complex UI frameworks, distributed systems, real-time systems.

#### 10. **Smart Pointer Pattern**
    - **Purpose**: Express resource ownership as an object; lifetime is released automatically at scope exit, avoiding manual-management mistakes.

#### 11. **Remote Facade and Data Transfer Object**
    - **Purpose**: Keep domain objects from crossing process boundaries; interfaces are designed as coarse-grained methods per business use case, with dedicated transfer objects (DTOs) for parameters and return values. This orientation is opposite to the [remote proxy](/structural/remote-proxy): the proxy stays transparent, while the facade gives up transparency and follows the use case's granularity.

## Behavioral Patterns

These patterns deal mainly with assigning responsibilities between classes and objects, making that assignment clearer.

#### 1. **Strategy Pattern**
    - **Purpose**: Define a family of algorithms, encapsulate each one, and make them interchangeable.
    - **Example**: Sorting strategies (quicksort, merge sort).

#### 2. **Observer Pattern**
    - **Purpose**: Define a one-to-many dependency between objects; when one object changes state, all its dependents are notified and updated automatically.
    - **Example**: Event listeners.

#### 3. **Command Pattern**
    - **Purpose**: Encapsulate a request as an object, letting clients be parameterized with different requests.
    - **Example**: The command pattern behind a GUI button.

#### 4. **Chain of Responsibility Pattern**
    - **Purpose**: Create a chain of receiver objects for a request, giving multiple objects a chance to handle it and avoiding coupling the sender to a receiver.
    - **Example**: An approval workflow.

#### 5. **Mediator Pattern**
    - **Purpose**: Use a mediator object to encapsulate interactions among a set of objects, so they don't reference each other directly.
    - **Example**: The message forwarder in a chat room.

#### 6. **Iterator Pattern**
    - **Purpose**: Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.
    - **Example**: Iterators in collection frameworks.

#### 7. **Template Method Pattern**
    - **Purpose**: Define the skeleton of an algorithm in an operation, deferring some steps to subclasses.
    - **Example**: The main loop framework in game development.

#### 8. **State Pattern**
    - **Purpose**: Let an object alter its behavior when its internal state changes, as if the object changed its class.
    - **Example**: A TCP connection state machine.

#### 9. **Memento Pattern**
    - **Purpose**: Capture and externalize an object's internal state without breaking encapsulation, so it can be restored later (also called the Snapshot Pattern).
    - **Example**: Undo functionality.

#### 10. **Interpreter Pattern**
    - **Purpose**: Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences.
    - **Example**: A compiler or script interpreter.

#### 11. **Visitor Pattern**
    - **Purpose**: Represent an operation on the elements of an object structure, letting you define new operations without changing the element classes.
    - **Example**: Element processing in an object structure, like syntax-tree traversal in a compiler.

#### 12. **Callback Pattern**
    - **Purpose**: Handle asynchronous operations and event-driven tasks.
    - **Example**: Node.js programming.

#### 13. **DSL Pattern**
    - **Purpose**: Design a syntax for a specific problem domain so non-programmers can express logic too.
    - **Example**: Build-tool configuration files (Gradle's and Webpack's DSLs).

## Concurrency Patterns

These patterns solve problems in multithreaded environments, coordinating how threads or processes work together.

#### 1. **Producer-Consumer Pattern**
    - **Purpose**: Coordinate the relationship between producers and consumers in a multithreaded environment.

#### 2. **Work Stealing Pattern**
    - **Purpose**: Handle dynamic load balancing in a thread pool; after finishing its own tasks, a thread can steal tasks from other threads' queues.

#### 3. **Read-Write Lock Pattern**
    - **Purpose**: Allow many threads to read a shared resource at once, but only one thread to write to it.

#### 4. **Thread Pool Pattern**
    - **Purpose**: Create a set of threads up front to handle tasks, reducing the overhead of frequent thread creation and destruction.

#### 5. **Reactor Pattern**
    - **Purpose**: Separate event-handling logic from event demultiplexing for high-performance event-driven processing.

#### 6. **Proactor Pattern**
    - **Purpose**: Built on the OS's asynchronous I/O mechanism; a completion event triggers callback handling after the async operation finishes, suited to high-concurrency I/O.

#### 7. **Active Object Pattern**
    - **Purpose**: Avoid direct synchronous calls by encapsulating method invocations as task objects that are queued and executed.

#### 8. **Future Pattern**
    - **Purpose**: Represent the result of an asynchronous task that will complete in the future.
    - **Example**: Callbacks or promises in async programming.

#### 9. **Semaphore Pattern**
    - **Purpose**: Control access to multiple resources where the resource count is limited.
    - **Example**: A database connection pool.

#### 10. **Event Loop Pattern**
    - **Purpose**: Process and dispatch events or messages; common in asynchronous programming models.
    - **Example**: The Node.js event loop.

#### 11. **Double-Checked Locking Pattern**
    - **Purpose**: Reduce lock overhead and ensure safe initialization in multithreaded environments.
    - **Example**: A thread-safe singleton implementation.

## Domain-Specific Patterns

These patterns target specific application or technology domains.

#### 1. **MVC Pattern (Model-View-Controller)**
    - **Purpose**: Separate an application's internal representation, user interface, and control logic.

#### 2. **MVVM Pattern (Model-View-ViewModel)**
    - **Purpose**: Mainly used in WPF and Silverlight applications to separate the view from business logic.

#### 3. **ORM Pattern (Object-Relational Mapping)**
    - **Purpose**: Create a mapping between object-oriented programming and relational database systems, so objects map to database tables.
    - **Example**: Hibernate, Entity Framework.

#### 4. **Transaction Script Pattern**
    - **Purpose**: Implement simple business logic, handling transactions with a series of commands and scripts.

#### 5. **Event Sourcing**
    - **Purpose**: Record all change events to application state, making state traceable and consistent.

#### 6. **Repository and Unit of Work**
    - **Purpose**: Give the domain layer a collection-like persistence interface — the interface lives in the domain layer, the implementation in infrastructure; the unit of work wraps a business transaction's whole batch of changes into one database transaction.

---

## Anti-Patterns, Modern Evolution, and Integration Patterns

Beyond the patterns above, the site has three more sections:

- **Anti-Patterns** ([overview](/anti-patterns/overview)): records what code grows into when written wrong, covering God Object, Big Ball of Mud, Golden Hammer, Spaghetti Code, and Anemic Domain Model.
- **Modern Evolution** ([overview](/evolution/overview)): content that kept evolving after GoF and has engineering consensus — composition over inheritance, SOLID and dependency rules, plus four stability patterns: Circuit Breaker, Bulkhead, Timeout, and Retry.
- **Integration Patterns** ([overview](/integration/overview)): the component vocabulary for cross-process messaging, covering Message Channel, Message Router, Message Translator, and Publish-Subscribe.

The verification process for these categories against the site's pages, the sources, and the difference table are recorded in the [research overview](/research/overview) and [coverage and differences](/research/coverage).

## Sources

- [S1] The GoF catalog is the source of the "23 patterns" baseline.
- [Wikipedia · Software design pattern](https://en.wikipedia.org/wiki/Software_design_pattern)
- [Refactoring.Guru · Design Patterns](https://refactoring.guru/design-patterns)

<!-- BACKLINKS-AUTO -->
## Related pages

- [reference](reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
- [overview](/research/overview.md)
