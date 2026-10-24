# Applications and Language

Patterns ultimately have to be written out in a concrete language. This page is ordered "scenario → pattern → landing API", explaining where the examples in the in-site body pages come from and why some patterns simply need not be written in some languages.

## Object creation and assembly

| Scenario | Pattern | Java | C++ | Go | C# / .NET |
| --- | --- | --- | --- | --- | --- |
| Get a family of related objects at once | [Abstract Factory](/creational/abstract-factory) | Factory interface + configuration to switch implementations | Abstract factory class + template | Interface literal table | `IAbstractFactory` + DI container |
| Assemble a complex object step by step | [Builder](/creational/builder) | Bucket constructor | Chained `builder()` returning a reference | Functional options `WithXxx` | Named property initialization |
| Keep only one instance | [Singleton](/creational/singleton) | `enum` singleton or static holder | Local static object (thread-safe) | Package-level `sync.Once` | Thread-safe lazily loaded static field |
| Reuse expensive objects | [Object Pool](/creational/object-pool) | Database connection pool, `HikariCP` | Thread-pool queue | Channel as a queue | `ObjectPool<T>` |

Dependency assembly is handled by a container in Java/C#, corresponding to [Dependency Injection](/structural/dependency-injection) and [Service Locator](/creational/service-locator). Go has no container, so assembly is written in `main`, which is why Go examples show no DI framework — only "pass the interface in as a parameter".

## Interface adaptation and access control

- **Adapting a third-party SDK** → [Adapter](/structural/adapter). In-site examples follow "the target interface is defined by us, the adapter wraps it once", which is isomorphic with Java's `InputStreamReader` and C++'s iterator adapters.
- **Give a subsystem a thin entry point** → [Facade](/structural/facade).
- **Control access, add caching or permissions** → the four variants of [Proxy](/structural/proxy). Java uses `java.lang.reflect.Proxy` for dynamic proxy, C++ uses a wrapper class, Go uses interface wrapping, and JavaScript uses the language's built-in `Proxy` object directly [S28].
- **Add responsibilities to an object without changing the class** → [Decorator](/structural/decorator). The `java.io` input/output stream chains in Java are the standard example, C++ corresponds to the `std::istreambuf_iterator` wrapper layer, and C# to the wrapper classes over `Stream`.
- **The interface has to cross processes** → [Remote Facade and Data Transfer Object](/structural/remote-facade). The Java landing is the controller method signature in Spring MVC (EJB Session Facade is the ancestor); Go is a hand-written service struct plus request/response structs, and gRPC's `message` definitions are the DTO.

## Behavior and flow

- **Algorithm can be swapped** → [Strategy](/behavioral/strategy). Java passes a `Function`, C++ passes `std::function` or a template parameter, Go uses a small interface or a function type, and TypeScript passes a function property. None of the four needs a subclass per algorithm.
- **Flow steps are fixed, individual steps can be swapped** → [Template Method](/behavioral/template-method). Java/C++ use an abstract base class with overridable methods; Go has no abstract classes and expresses the same skeleton with an interface plus struct embedding, which is the route the in-site Go examples take.
- **Event notification** → [Observer](/behavioral/observer). Landing spots are `EventTarget` [S28], Qt's signal/slot, Rx-style streams, and Go channel broadcast. The Go standard library has no observer class, so in-site Go examples implement it with an interface; for the pipeline and cancellation style, see the official blog [S21].
- **Handle a request step by step** → [Chain of Responsibility](/behavioral/chain-of-responsibility). Middleware stacks (Servlet Filter, Koa middleware, wrapping Go `http.Handler`) are its form in Web frameworks.
- **State determines behavior** → [State](/behavioral/state). TCP connection state machines, order state transitions, and player states are three common examples.
- **Multiple operations on an object structure** → [Visitor](/behavioral/visitor). The classic form is `accept/visit` double dispatch, which the in-site body pages expand in Java; C++ has no double-dispatch syntax, so the idiom is `std::variant` plus `std::visit`, handing the branching to the standard library rather than hand-writing a dispatch table.

## Concurrency and async

| Scenario | Pattern | Standard landing |
| --- | --- | --- |
| Fixed-size background tasks | [Thread Pool](/concurrency/thread-pool) | `ThreadPoolExecutor` / `std::thread` pool / goroutine pool |
| Mostly reads, few writes | [Read-Write Lock](/concurrency/read-write-lock) | `ReentrantReadWriteLock` / `std::shared_mutex` / `sync.RWMutex` |
| Partition CPU-heavy tasks | [Work Stealing](/concurrency/work-stealing) | `ForkJoinPool` / work-stealing deque |
| Buffer a rate mismatch | [Producer-Consumer](/concurrency/producer-consumer) | `BlockingQueue` / buffered channel |
| Single-threaded I/O | [Event Loop](/concurrency/event-loop), [Reactor](/concurrency/reactor) | Node.js event loop, Netty, `libuv` |
| Placeholder for an async result | [Future](/concurrency/future) | `CompletableFuture` / `std::future` / `Promise` |
| Lazy safe initialization | [Double-Checked Locking](/concurrency/double-checked-locking) | `volatile` + synchronized block / `std::call_once` / `sync.Once` |

The terminology in this column takes the Java SE `java.util.concurrent` docs [S19] as the standard, the C++ part is checked against the Core Guidelines' resource-management advice [S20], and the Go part is checked against the official docs [S21].

## Data and layering

- **Impedance mismatch between tables and objects** → [ORM](/other/orm): Hibernate, Entity Framework, Django ORM.
- **Which layer business logic lives in** → [Transaction Script](/other/transaction-script) contrasted with [Anemic Domain Model](/anti-patterns/anemic-domain-model), sourced from enterprise application patterns [S5] and Martin's bliki [S26].
- **Replayable state** → [Event Sourcing](/other/event-sourcing): append-only event log + snapshots. The difference from [Memento](/behavioral/memento) is that the former records the process, the latter records a moment.
- **Splitting frontend/backend responsibilities** → [MVC](/other/mvc), [MVVM](/other/mvvm): Spring MVC, iOS SwiftUI, Vue's component model.

## Distributed and cloud

Circuit breaker originated in Release It! [S12] and is now standard equipment for gateways and RPC clients (Resilience4j, Polly, and Sentinel's circuit breakers are all the same model): once the failure rate inside a statistics window crosses the threshold, fail fast instead of hammering the downstream. This round adds [Circuit Breaker](/evolution/circuit-breaker) with Go and Java implementations.

For the microservices direction, API gateway, Saga, and service discovery come from Richardson's book [S13], and Kubernetes patterns come from *Kubernetes Patterns* [S15]. Both batches are recorded in the differences table and not added for now, on the grounds that they belong to distributed system design rather than this repo's current "design pattern" scope.

## Differences in multi-language landing (in-site writing conventions)

1. Where "polymorphism" is needed: Java/C#/C++ use interfaces or abstract classes, Go uses small interfaces plus embedding. In-site examples follow each language's idiom and are not forced across languages.
2. Where "reusing logic" is needed: inheritance does not exist in Go or functional languages, so it is rewritten uniformly as composition — see [Composition over Inheritance](/evolution/composition-over-inheritance).
3. The costs of singleton (global state, hard to test) are most visible in Java/C#; in Go, package-level variables are equally hard to test, so the singleton page and the anti-pattern page each write half.
4. Thread-model differences determine the concurrency-page examples: Java uses thread pools, C++ uses `std::jthread` and `std::stop_token`, Go uses goroutines plus channels.

## Sources

- The language-landing idioms are checked against [S19][S21][S22][S23] (list in the Research Overview).
- [iluwatar/java-design-patterns](https://github.com/iluwatar/java-design-patterns) (runnable examples, [S18])
- [Refactoring.Guru · Design Patterns](https://refactoring.guru/design-patterns)

<!-- BACKLINKS-AUTO -->
## Related pages

- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [coverage](coverage.md)
- [overview](overview.md)
