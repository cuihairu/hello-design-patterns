# Reference

This page collects classic books, online resources, and the on-site document index related to design patterns, for further reading.

## Classic Books

- *Design Patterns: Elements of Reusable Object-Oriented Software*, Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides (the "Gang of Four"/GoF). The foundational work of the field, defining 23 classic patterns with their intent, applicability, and structure.
- *Head First Design Patterns*, Eric Freeman et al. Presents classic patterns graphically and through worked cases.
- *Object-Oriented Analysis and Design with Applications*, Grady Booch et al. Covers OO fundamentals and patterns across the software lifecycle.
- *Patterns of Enterprise Application Architecture*, Martin Fowler. Covers domain logic, data mapping, and web-presentation patterns in enterprise applications; Repository and Unit of Work come from this book — see [Repository and Unit of Work](/other/repository); Remote Facade and Data Transfer Object come from its "distribution" group — see [Remote Facade and Data Transfer Object](/structural/remote-facade).
- *Refactoring: Improving the Design of Existing Code*, Martin Fowler. Shows how to gradually reshape code into pattern-ready forms with refactoring moves.
- *Refactoring to Patterns*, Joshua Kerievsky. Gives evolution paths from common code smells to design patterns.
- *Pattern-Oriented Software Architecture*, Frank Buschmann et al. (the POSA series). A systematic treatment of architecture-level patterns for communication, concurrency, and structure.
- *Enterprise Integration Patterns*, Gregor Hohpe, Bobby Woolf. The classic catalog of messaging patterns in enterprise application integration (EAI) — messages, routing, translation; corresponds to the on-site [Integration Patterns](/integration/overview) section.
- *Clean Architecture*, Robert C. Martin. The SOLID principles, dependency rule, and component-level design principles; corresponds to the on-site [Modern Evolution](/evolution/overview) section.
- *Agile Software Development: Principles, Patterns, and Practices*, Robert C. Martin. The origin of the SOLID principles; corresponds to [SOLID and Dependency Rules](/evolution/solid).
- *AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis*, William J. Brown et al. The anti-pattern catalog; corresponds to the on-site [Anti-Patterns](/anti-patterns/overview) section.
- *Big Ball of Mud*, Brian Foote, Joseph Yoder, PLoP 1997 paper. The shape of and way out for runaway legacy systems; corresponds to [Big Ball of Mud](/anti-patterns/big-ball-of-mud).
- *Domain-Driven Design*, Eric Evans. Strategic-design vocabulary such as bounded context and aggregate; the Repository page follows the domain-layer-interface reading, see [Repository and Unit of Work](/other/repository).
- *Release It!* (2nd ed.), Michael T. Nygard. Production stability patterns; [Circuit Breaker](/evolution/circuit-breaker), [Bulkhead](/evolution/bulkhead), [Timeout](/evolution/timeout), and [Retry](/evolution/retry) come from this book.
- *Microservices Patterns*, Chris Richardson. Microservice implementation patterns such as API gateway, service discovery, and Saga; recorded under the site's scope rules in [coverage and differences](/research/coverage); for event sourcing see also [Event Sourcing](/other/event-sourcing).
- *Kubernetes Patterns*, Bilgin Ibryam, Roland Huss. A pattern catalog for container-orchestration platforms; recorded under the site's scope rules in [coverage and differences](/research/coverage).

## Online Resources

- [Refactoring.Guru](https://refactoring.guru/design-patterns): pattern tutorials grouped by language (external links), with intent, structure, applicability, and example code.
- [SourceMaking](https://sourcemaking.com/design_patterns): a systematic site for design patterns and anti-patterns, with UML diagrams and pros/cons notes.
- [Wikipedia · Software design pattern](https://en.wikipedia.org/wiki/Software_design_pattern): the umbrella article, plus per-pattern articles — handy for quickly checking a definition.
- [dofactory](https://www.dofactory.com/net/design-patterns): pattern categories and code examples for the classic GoF patterns.
- [Martin Fowler's site](https://martinfowler.com/eaaCatalog/): articles on refactoring, enterprise application architecture, and evolutionary architecture; eaaCatalog is the online catalog of [S5].
- [Java official docs · java.util.concurrent package](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html): standard-library implementations of concurrency patterns such as Future, Semaphore, and BlockingQueue.

## On-Site Document Index

### Overviews

- [Design Pattern Overview](/introduction)
- [Knowledge Points](/knowledge)
- [Glossary](/glossary)

### Creational Patterns

- [Creational Patterns Overview](/creational/overview)
- [Singleton](/creational/singleton)
- [Factory Method](/creational/factory-method)
- [Abstract Factory](/creational/abstract-factory)
- [Builder](/creational/builder)
- [Prototype](/creational/prototype)
- [Multiton](/creational/multiton)
- [Object Pool](/creational/object-pool)
- [Service Locator](/creational/service-locator)

### Structural Patterns

- [Structural Patterns Overview](/structural/overview)
- [Adapter](/structural/adapter)
- [Decorator](/structural/decorator)
- [Proxy](/structural/proxy)
- [Virtual Proxy](/structural/virtual-proxy)
- [Protection Proxy](/structural/protection-proxy)
- [Remote Proxy](/structural/remote-proxy)
- [Dynamic Proxy](/structural/dynamic-proxy)
- [Facade](/structural/facade)
- [Remote Facade and Data Transfer Object](/structural/remote-facade)
- [Bridge](/structural/bridge)
- [Bidirectional Bridge](/structural/bidirectional-bridge)
- [Composite](/structural/composite)
- [Flyweight](/structural/flyweight)
- [Dependency Injection](/structural/dependency-injection)
- [Smart Pointer](/structural/smart-pointer)

### Behavioral Patterns

- [Behavioral Patterns Overview](/behavioral/overview)
- [Strategy](/behavioral/strategy)
- [Observer](/behavioral/observer)
- [Command](/behavioral/command)
- [Chain of Responsibility](/behavioral/chain-of-responsibility)
- [Mediator](/behavioral/mediator)
- [Iterator](/behavioral/iterator)
- [Template Method](/behavioral/template-method)
- [State](/behavioral/state)
- [Memento](/behavioral/memento)
- [Interpreter](/behavioral/interpreter)
- [Visitor](/behavioral/visitor)
- [Callback](/behavioral/callback)
- [Domain-Specific Language (DSL)](/behavioral/dsl)

### Concurrency Patterns

- [Concurrency Patterns Overview](/concurrency/overview)
- [Producer-Consumer](/concurrency/producer-consumer)
- [Semaphore](/concurrency/semaphore)
- [Future](/concurrency/future)
- [Active Object](/concurrency/active-object)
- [Double-Checked Locking](/concurrency/double-checked-locking)
- [Event Loop](/concurrency/event-loop)
- [Reactor](/concurrency/reactor)
- [Proactor](/concurrency/proactor)
- [Thread Pool](/concurrency/thread-pool)
- [Read-Write Lock](/concurrency/read-write-lock)
- [Work Stealing](/concurrency/work-stealing)

### Other Patterns

- [Other Patterns Overview](/other/overview)
- [MVC](/other/mvc)
- [MVVM](/other/mvvm)
- [Object-Relational Mapping (ORM)](/other/orm)
- [Event Sourcing](/other/event-sourcing)
- [Transaction Script](/other/transaction-script)
- [Repository and Unit of Work](/other/repository)

### Integration Patterns

- [Integration Patterns Overview](/integration/overview)
- [Message Channel](/integration/message-channel)
- [Message Router](/integration/message-router)
- [Message Translator](/integration/message-translator)
- [Publish-Subscribe](/integration/publish-subscribe)

### Anti-Patterns

- [Anti-Patterns Overview](/anti-patterns/overview)
- [God Object](/anti-patterns/god-object)
- [Big Ball of Mud](/anti-patterns/big-ball-of-mud)
- [Golden Hammer](/anti-patterns/golden-hammer)
- [Spaghetti Code](/anti-patterns/spaghetti-code)
- [Anemic Domain Model](/anti-patterns/anemic-domain-model)

### Modern Evolution

- [Modern Evolution Overview](/evolution/overview)
- [Composition over Inheritance](/evolution/composition-over-inheritance)
- [SOLID and Dependency Rules](/evolution/solid)
- [Circuit Breaker](/evolution/circuit-breaker)
- [Bulkhead](/evolution/bulkhead)
- [Timeout](/evolution/timeout)
- [Retry](/evolution/retry)

### Research

- [Research Overview](/research/overview) (with the 28-entry source list)
- [Books and Standards](/research/books)
- [Official and Community Docs](/research/official-docs)
- [Applications and Language](/research/applications)
- [Coverage and Differences](/research/coverage)

## Relations Between Patterns

- Singleton combines with [Double-Checked Locking](/concurrency/double-checked-locking) for thread-safe lazy initialization.
- The variants of Proxy — [Virtual Proxy](/structural/virtual-proxy), [Protection Proxy](/structural/protection-proxy), [Remote Proxy](/structural/remote-proxy), [Dynamic Proxy](/structural/dynamic-proxy) — all revolve around "controlling access to an object".
- [Remote Proxy](/structural/remote-proxy) and [Remote Facade and Data Transfer Object](/structural/remote-facade) are two orientations across process boundaries: the former stays transparent with object-level granularity, the latter gives up transparency and follows use-case granularity; real systems often pair them per interface.
- [Memento](/behavioral/memento) and [Snapshot](/behavioral/snapshot) are two names for the same pattern, typically used for undo/redo.
- [Factory Method](/creational/factory-method) and [Abstract Factory](/creational/abstract-factory) decouple object creation, while [Builder](/creational/builder) targets step-by-step construction of complex objects.
- [Event Loop](/concurrency/event-loop), [Reactor](/concurrency/reactor), and [Proactor](/concurrency/proactor) together form the core pattern family of event-driven I/O.
- [Circuit Breaker](/evolution/circuit-breaker), [Bulkhead](/evolution/bulkhead), [Timeout](/evolution/timeout), and [Retry](/evolution/retry) all come from *Release It!*, covering failure rate, resource ceiling, single-call duration, and transient-fault recovery respectively; cross-process calls often deploy all four together.
- The null-object section of [Strategy](/behavioral/strategy): "no-op behavior" is also a substitutable strategy — return an empty implementation instead of `null` so callers need no null check.
- [Publish-Subscribe](/integration/publish-subscribe) and [Observer](/behavioral/observer) are the same intent implemented in two domains — cross-process versus in-process: async messaging versus synchronous callbacks, with different failure models.

<!-- BACKLINKS-AUTO -->
## Related pages

- [coverage](/research/coverage.md)
- [overview](/research/overview.md)
