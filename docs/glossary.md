# Glossary

English-Chinese term pairs and one-sentence definitions for pattern terms on this site. Source IDs `[S1]`–`[S28]` follow the [source list in the research overview](/research/overview#source-list); bibliography details are in that list — this table only gives clickable online sources. The "related pages" at the end of each entry link directly to the on-site article.

## Creational Patterns

### Singleton pattern (单例模式)

Guarantees a class has only one instance and provides a global point of access.

**Sources**: [S1]; [Wikipedia · Singleton pattern](https://en.wikipedia.org/wiki/Singleton_pattern)

**Related pages**: [Singleton](/creational/singleton), [Double-Checked Locking](/concurrency/double-checked-locking)

### Factory method pattern (工厂方法模式)

Defers object creation to a subclass, which decides which concrete product to instantiate.

**Sources**: [S1]; [Wikipedia · Factory method pattern](https://en.wikipedia.org/wiki/Factory_method_pattern)

**Related pages**: [Factory Method](/creational/factory-method), [Abstract Factory](/creational/abstract-factory)

### Abstract factory pattern (抽象工厂模式)

Creates families of related products without specifying concrete classes.

**Sources**: [S1]; [Wikipedia · Abstract factory pattern](https://en.wikipedia.org/wiki/Abstract_factory_pattern)

**Related pages**: [Abstract Factory](/creational/abstract-factory), [Factory Method](/creational/factory-method)

### Builder pattern (建造者模式)

Constructs complex objects step by step; the same construction process can produce different representations.

**Sources**: [S1]; [Wikipedia · Builder pattern](https://en.wikipedia.org/wiki/Builder_pattern)

**Related pages**: [Builder](/creational/builder)

### Prototype pattern (原型模式)

Creates new objects by cloning an existing instance, bypassing field-by-field initialization.

**Sources**: [S1]; [Wikipedia · Prototype pattern](https://en.wikipedia.org/wiki/Prototype_pattern)

**Related pages**: [Prototype](/creational/prototype)

### Multiton pattern (多例模式)

A generalization of Singleton: manages a finite number of instances keyed, at most one per key.

**Sources**: [Wikipedia · Multiton pattern](https://en.wikipedia.org/wiki/Multiton_pattern) (not in the [S1] catalog)

**Related pages**: [Multiton](/creational/multiton), [Singleton](/creational/singleton)

### Object pool pattern (对象池模式)

Reuses expensive-to-create objects via a borrow/return protocol, avoiding repeated construction and destruction.

**Sources**: [Wikipedia · Object pool pattern](https://en.wikipedia.org/wiki/Object_pool_pattern); [Apache Commons Pool](https://commons.apache.org/proper/commons-pool/)

**Related pages**: [Object Pool](/creational/object-pool), [Thread Pool](/concurrency/thread-pool)

### Service locator pattern (服务定位器模式)

Centralized registration, dependencies fetched by name; Fowler has a dedicated article comparing it to DI.

**Sources**: [Wikipedia · Service locator pattern](https://en.wikipedia.org/wiki/Service_locator_pattern); [Fowler · Inversion of Control](https://martinfowler.com/articles/injection.html)

**Related pages**: [Service Locator](/creational/service-locator), [Dependency Injection](/structural/dependency-injection)

## Structural Patterns

### Adapter pattern (适配器模式)

Converts an existing interface to meet a client's expectations, letting incompatible sides work together.

**Sources**: [S1]; [Wikipedia · Adapter pattern](https://en.wikipedia.org/wiki/Adapter_pattern)

**Related pages**: [Adapter](/structural/adapter), [Facade](/structural/facade)

### Decorator pattern (装饰模式)

Dynamically wraps an object with extra responsibilities — a more flexible alternative to inheritance.

**Sources**: [S1]; [Wikipedia · Decorator pattern](https://en.wikipedia.org/wiki/Decorator_pattern)

**Related pages**: [Decorator](/structural/decorator), [Proxy](/structural/proxy)

### Proxy pattern (代理模式)

Controls access to an object; variants by purpose include virtual, protection, remote, and dynamic.

**Sources**: [S1]; [Wikipedia · Proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern)

**Related pages**: [Proxy](/structural/proxy), [Virtual Proxy](/structural/virtual-proxy), [Protection Proxy](/structural/protection-proxy), [Remote Proxy](/structural/remote-proxy), [Dynamic Proxy](/structural/dynamic-proxy)

### Facade pattern (外观模式)

Provides a unified high-level interface to a subsystem, reducing the coupling surface for callers.

**Sources**: [S1]; [Wikipedia · Facade pattern](https://en.wikipedia.org/wiki/Facade_pattern)

**Related pages**: [Facade](/structural/facade)

### Bridge pattern (桥接模式)

Splits abstraction and implementation onto two inheritance axes so they can vary independently.

**Sources**: [S1]; [Wikipedia · Bridge pattern](https://en.wikipedia.org/wiki/Bridge_pattern)

**Related pages**: [Bridge](/structural/bridge), [Bidirectional Bridge](/structural/bidirectional-bridge)

### Composite pattern (组合模式)

Handles parts and wholes uniformly in a tree; leaves and containers share the same interface.

**Sources**: [S1]; [Wikipedia · Composite pattern](https://en.wikipedia.org/wiki/Composite_pattern)

**Related pages**: [Composite](/structural/composite), [Iterator](/behavioral/iterator)

### Flyweight pattern (享元模式)

Shares fine-grained instances, externalizing common state to save memory.

**Sources**: [S1]; [Wikipedia · Flyweight pattern](https://en.wikipedia.org/wiki/Flyweight_pattern)

**Related pages**: [Flyweight](/structural/flyweight), [Object Pool](/creational/object-pool)

### Dependency injection (依赖注入)

Dependencies are injected externally rather than self-constructed; what's inverted is the direction of dependency acquisition.

**Sources**: [Wikipedia · Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection); [Fowler · Inversion of Control](https://martinfowler.com/articles/injection.html)

**Related pages**: [Dependency Injection](/structural/dependency-injection), [Service Locator](/creational/service-locator)

### Smart pointer (智能指针)

A pointer object managing resource lifetime via RAII; destruction releases the resource.

**Sources**: [Wikipedia · Smart pointer](https://en.wikipedia.org/wiki/Smart_pointer); [cppreference · Memory management library](https://en.cppreference.com/w/cpp/memory)

**Related pages**: [Smart Pointer](/structural/smart-pointer)

## Behavioral Patterns

### Strategy pattern (策略模式)

Encapsulates a family of interchangeable algorithms, substitutable at runtime; "no-op behavior" is also a legal strategy (null object).

**Sources**: [S1]; [Wikipedia · Strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern); [Wikipedia · Null object pattern](https://en.wikipedia.org/wiki/Null_object_pattern)

**Related pages**: [Strategy](/behavioral/strategy), [State](/behavioral/state)

### Observer pattern (观察者模式)

Notifies all subscribers automatically when the subject's state changes, decoupling both sides.

**Sources**: [S1]; [Wikipedia · Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern)

**Related pages**: [Observer](/behavioral/observer), [Publish-Subscribe](/integration/publish-subscribe)

### Command pattern (命令模式)

Encapsulates a request as an object, making it queueable, undoable, and loggable.

**Sources**: [S1]; [Wikipedia · Command pattern](https://en.wikipedia.org/wiki/Command_pattern)

**Related pages**: [Command](/behavioral/command), [Memento](/behavioral/memento)

### Chain of responsibility pattern (责任链模式)

A request travels down a chain of handlers until one handles it or falls through.

**Sources**: [S1]; [Wikipedia · Chain-of-responsibility pattern](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern)

**Related pages**: [Chain of Responsibility](/behavioral/chain-of-responsibility), [Mediator](/behavioral/mediator)

### Mediator pattern (中介者模式)

A mediator object centralizes the many-to-many interaction among colleague objects.

**Sources**: [S1]; [Wikipedia · Mediator pattern](https://en.wikipedia.org/wiki/Mediator_pattern)

**Related pages**: [Mediator](/behavioral/mediator), [Observer](/behavioral/observer)

### Iterator pattern (迭代器模式)

Traverses aggregate contents in order without exposing the internal representation.

**Sources**: [S1]; [Wikipedia · Iterator pattern](https://en.wikipedia.org/wiki/Iterator_pattern)

**Related pages**: [Iterator](/behavioral/iterator), [Composite](/structural/composite)

### Template method pattern (模板方法模式)

Fixes the algorithm skeleton; variable steps are left for subclasses to implement.

**Sources**: [S1]; [Wikipedia · Template method pattern](https://en.wikipedia.org/wiki/Template_method_pattern)

**Related pages**: [Template Method](/behavioral/template-method), [Strategy](/behavioral/strategy)

### State pattern (状态模式)

Behavior changes wholesale as internal state switches; state is an object.

**Sources**: [S1]; [Wikipedia · State pattern](https://en.wikipedia.org/wiki/State_pattern)

**Related pages**: [State](/behavioral/state), [Strategy](/behavioral/strategy)

### Memento pattern (备忘录模式)

Saves and restores a prior object state without breaking encapsulation; "snapshot" is an alias for the same pattern.

**Sources**: [S1]; [Wikipedia · Memento pattern](https://en.wikipedia.org/wiki/Memento_pattern)

**Related pages**: [Memento](/behavioral/memento), [Snapshot](/behavioral/snapshot)

### Interpreter pattern (解释器模式)

Defines an interpreter for a grammar and evaluates according to its rules.

**Sources**: [S1]; [Wikipedia · Interpreter pattern](https://en.wikipedia.org/wiki/Interpreter_pattern)

**Related pages**: [Interpreter](/behavioral/interpreter), [DSL](/behavioral/dsl)

### Visitor pattern (访问者模式)

Adds new operations to element classes without modifying them, via double dispatch.

**Sources**: [S1]; [Wikipedia · Visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern)

**Related pages**: [Visitor](/behavioral/visitor)

### Callback (回调)

Hand a function to a callee to invoke at its own time — the minimal form of inversion of control.

**Sources**: [Wikipedia · Callback](https://en.wikipedia.org/wiki/Callback_%28computer_programming%29); [MDN · Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)

**Related pages**: [Callback](/behavioral/callback), [Observer](/behavioral/observer)

### Domain-specific language, DSL (领域特定语言)

A small language for a narrow domain, in contrast to a general-purpose language; the Interpreter pattern is one of its implementation vehicles.

**Sources**: [Wikipedia · Domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language); [Fowler · DSL book page](https://martinfowler.com/books/dsl.html)

**Related pages**: [DSL](/behavioral/dsl), [Interpreter](/behavioral/interpreter)

## Concurrency Patterns

### Producer-consumer (生产者-消费者)

A buffered queue decouples the rate difference between production and consumption; blocking queues are the standard-library form.

**Sources**: [Wikipedia · Producer-consumer problem](https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem); [Java · BlockingQueue](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/BlockingQueue.html)

**Related pages**: [Producer-Consumer](/concurrency/producer-consumer), [Message Channel](/integration/message-channel)

### Reactor pattern (反应器模式)

A single (or few) threads wait synchronously on many event sources and dispatch to handlers as soon as one is ready.

**Sources**: [Wikipedia · Reactor pattern](https://en.wikipedia.org/wiki/Reactor_pattern); [S9]

**Related pages**: [Reactor](/concurrency/reactor), [Proactor](/concurrency/proactor), [Event Loop](/concurrency/event-loop)

### Proactor pattern (主动器模式)

Async-I/O-driven completions trigger the pattern; Windows IOCP is the representative implementation.

**Sources**: [Wikipedia · Proactor pattern](https://en.wikipedia.org/wiki/Proactor_pattern); [Microsoft · I/O completion ports](https://learn.microsoft.com/en-us/windows/win32/fileio/i-o-completion-ports)

**Related pages**: [Proactor](/concurrency/proactor), [Reactor](/concurrency/reactor)

### Future / Promise

A placeholder receipt for an async result — hand back the ticket, retrieve the value later.

**Sources**: [Wikipedia · Futures and promises](https://en.wikipedia.org/wiki/Futures_and_promises); [Java · CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html)

**Related pages**: [Future](/concurrency/future)

### Semaphore (信号量)

A counting permit that controls how many tasks can enter a critical section at once.

**Sources**: [Wikipedia · Semaphore](https://en.wikipedia.org/wiki/Semaphore_%28programming%29); [man7 · sem_overview](https://man7.org/linux/man-pages/man7/sem_overview.7.html)

**Related pages**: [Semaphore](/concurrency/semaphore), [Read-Write Lock](/concurrency/read-write-lock)

### Event loop (事件循环)

A single thread polls ready events and dispatches callbacks; the backbone of Node.js and browsers.

**Sources**: [Wikipedia · Event loop](https://en.wikipedia.org/wiki/Event_loop); [libuv · Design overview](https://docs.libuv.org/en/v1.x/design.html)

**Related pages**: [Event Loop](/concurrency/event-loop), [Reactor](/concurrency/reactor)

### Double-checked locking (双重检查锁定)

A locking optimization for lazy initialization: check without a lock first, lock only on miss; under the Java Memory Model there is a famous failure statement.

**Sources**: [Wikipedia · Double-checked locking](https://en.wikipedia.org/wiki/Double-checked_locking); [Pugh · Double-Checked Locking is Broken](https://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html)

**Related pages**: [Double-Checked Locking](/concurrency/double-checked-locking), [Singleton](/creational/singleton)

### Active object (主动对象)

Decouples method invocation from execution: calls become queued requests, executed in order by an independent thread.

**Sources**: [Wikipedia · Active object](https://en.wikipedia.org/wiki/Active_object); [S9]

**Related pages**: [Active Object](/concurrency/active-object), [Producer-Consumer](/concurrency/producer-consumer)

### Readers-writer lock (读写锁)

A lock strategy with shared reads and exclusive writes; higher throughput in read-heavy, write-light workloads.

**Sources**: [Wikipedia · Readers-writer lock](https://en.wikipedia.org/wiki/Readers%E2%80%93writer_lock)

**Related pages**: [Read-Write Lock](/concurrency/read-write-lock)

### Thread pool (线程池)

Pre-builds a set of threads to execute tasks, saving per-task create/destroy overhead.

**Sources**: [Wikipedia · Thread pool](https://en.wikipedia.org/wiki/Thread_pool); [Java · java.util.concurrent](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html)

**Related pages**: [Thread Pool](/concurrency/thread-pool), [Object Pool](/creational/object-pool)

### Work stealing (工作窃取)

An idle thread pulls tasks from the tail of a busy thread's queue, balancing load automatically.

**Sources**: [Wikipedia · Work stealing](https://en.wikipedia.org/wiki/Work_stealing)

**Related pages**: [Work Stealing](/concurrency/work-stealing), [Thread Pool](/concurrency/thread-pool)

## Integration and Evolution Patterns

### Message channel (消息通道)

The first-class citizen of integration patterns: endpoints send messages via a channel rather than peer-to-peer.

**Sources**: [S10]; [Enterprise Integration Patterns site](https://www.enterpriseintegrationpatterns.com/)

**Related pages**: [Message Channel](/integration/message-channel), [Integration Overview](/integration/overview)

### Publish-subscribe (发布-订阅)

Publishers broadcast by topic; subscribers receive by subscription — a routing layer beyond the channel for decoupling.

**Sources**: [Wikipedia · Publish-subscribe pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern); [S10]

**Related pages**: [Publish-Subscribe](/integration/publish-subscribe), [Observer](/behavioral/observer)

### Circuit breaker (熔断器)

Trips to fast-fail when the failure rate exceeds a threshold, preventing cascading faults; half-open probes during recovery.

**Sources**: [S12]; [Wikipedia · Circuit breaker pattern](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern); [Azure · Circuit Breaker pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

**Related pages**: [Circuit Breaker](/evolution/circuit-breaker), [Retry](/evolution/retry)

### Bulkhead (隔舱)

Partitions resource ceilings by purpose, so a breach in one compartment doesn't sink the ship.

**Sources**: [S12]; [Azure · Bulkhead pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

**Related pages**: [Bulkhead](/evolution/bulkhead)

### Timeout (超时)

Sets a limit on a single call so an endless wait doesn't drag down upstream.

**Sources**: [S12]

**Related pages**: [Timeout](/evolution/timeout), [Circuit Breaker](/evolution/circuit-breaker)

### Retry (重试)

Retries transient failures with a backoff strategy; non-idempotent operations need idempotency solved before retrying.

**Sources**: [S12]; [Azure · Retry pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry)

**Related pages**: [Retry](/evolution/retry), [Timeout](/evolution/timeout)

## Other Patterns

### MVC (Model-view-controller)

Model-view-controller three-way split — the earliest separation of the UI from application logic.

**Sources**: [Wikipedia · Model-view-controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller); [Fowler · GUI Architectures](https://martinfowler.com/eaaDev/uiArchs.html)

**Related pages**: [MVC](/other/mvc), [MVVM](/other/mvvm)

### MVVM (Model-view-viewmodel)

A view model connects view and model via data binding — the classic WPF front-end layering.

**Sources**: [Wikipedia · Model-view-viewmodel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)

**Related pages**: [MVVM](/other/mvvm), [MVC](/other/mvc)

### Object-relational mapping, ORM (对象关系映射)

Maps relational tables through an object layer, eliminating hand-written SQL boilerplate.

**Sources**: [Wikipedia · Object-relational mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping); [Fowler · ORM Hate](https://martinfowler.com/bliki/OrmHate.html)

**Related pages**: [ORM](/other/orm), [Repository and Unit of Work](/other/repository)

### Event sourcing (事件溯源)

An immutable event sequence is the single source of truth; state is derived by replay.

**Sources**: [Fowler · Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) (no independent Wikipedia article yet)

**Related pages**: [Event Sourcing](/other/event-sourcing), [Publish-Subscribe](/integration/publish-subscribe)

### Repository (仓储)

A collection-like interface encapsulates domain-object persistence, hiding storage details.

**Sources**: [S5]; [Fowler · Repository](https://martinfowler.com/eaaCatalog/repository.html)

**Related pages**: [Repository and Unit of Work](/other/repository), [ORM](/other/orm)

### Transaction script (事务脚本)

One use case, one procedural script — the most direct way to organize business logic.

**Sources**: [S5]; [Fowler · Transaction Script](https://martinfowler.com/eaaCatalog/transactionScript.html)

**Related pages**: [Transaction Script](/other/transaction-script)

## Anti-Patterns

### Anti-pattern (反模式)

A frequently adopted solution whose consequences are worse than its benefits; forms a three-tier relationship with code smells and patterns.

**Sources**: [S7]; [Wikipedia · Anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)

**Related pages**: [Anti-Patterns Overview](/anti-patterns/overview)

### God object (神对象)

Too many responsibilities gathered in one object; changing one thing ripples everywhere.

**Sources**: [Wikipedia · God object](https://en.wikipedia.org/wiki/God_object)

**Related pages**: [God Object](/anti-patterns/god-object), [Big Ball of Mud](/anti-patterns/big-ball-of-mud)

### Big ball of mud (大泥球)

An entangled system with no clear architecture — the common shape of legacy code.

**Sources**: [S8]; [Wikipedia · Big ball of mud](https://en.wikipedia.org/wiki/Big_ball_of_mud)

**Related pages**: [Big Ball of Mud](/anti-patterns/big-ball-of-mud)

### Golden hammer (金锤子)

Forcing a familiar tool onto every problem — the engineering version of the Law of the Instrument.

**Sources**: [Wikipedia · Law of the instrument](https://en.wikipedia.org/wiki/Law_of_the_instrument)

**Related pages**: [Golden Hammer](/anti-patterns/golden-hammer)

### Spaghetti code (意面代码)

Control flow entangled like pasta; readability and maintainability both collapse.

**Sources**: [Wikipedia · Spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code)

**Related pages**: [Spaghetti Code](/anti-patterns/spaghetti-code)

### Anemic domain model (贫血模型)

Domain objects keep only data fields with no behavior; logic scatters into service layers.

**Sources**: [Fowler · AnemicDomainModel](https://martinfowler.com/bliki/AnemicDomainModel.html)

**Related pages**: [Anemic Domain Model](/anti-patterns/anemic-domain-model), [Repository and Unit of Work](/other/repository)

---

**Maintenance rule**: New entries must give a clickable authoritative source; if none is found, write "no authoritative source found (to verify)" — never fabricate a link from memory. Bibliography details for source IDs `[S#]` are in the [source list in the research overview](/research/overview#source-list).

<!-- BACKLINKS-AUTO -->
## Related pages

- [knowledge](knowledge.md)
- [reference](reference.md)
