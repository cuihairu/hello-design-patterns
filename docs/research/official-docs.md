# Official and Community Docs

Books give catalogs and definitions, official docs give the API wording, and community sites give classification and alias checks. These three categories of sources determine whether the class names, method names, and terminology in in-site body pages line up with the toolchain in current use.

## Official documentation

### Java SE: `java.util.concurrent` [S19]

The terminology baseline for the concurrency catalog. Standard-library implementations referenced on the site:

| In-site page | Standard-library counterpart |
| --- | --- |
| [Semaphore pattern](/concurrency/semaphore) | `java.util.concurrent.Semaphore` |
| [Future pattern](/concurrency/future) | `java.util.concurrent.Future`, `CompletableFuture` |
| [Producer-Consumer pattern](/concurrency/producer-consumer) | The `BlockingQueue` family |
| [Thread Pool pattern (new this round)](/concurrency/thread-pool) | `ExecutorService`, `ThreadPoolExecutor` |
| [Read-Write Lock pattern (new this round)](/concurrency/read-write-lock) | `ReadWriteLock`, `ReentrantReadWriteLock` |
| [Double-Checked Locking](/concurrency/double-checked-locking) | The JMM semantics of `volatile` |

Word this carefully: `Future.get()` blocks to take the value; `CompletableFuture` is what carries composition and callbacks. `Semaphore`'s `acquire` can be interrupted, so examples must call `release` only after the permit is actually acquired (the site's semaphore page already writes it this way).

### C++ Core Guidelines [S20]

The basis for modern C++ idioms in the structural and concurrency areas:

- Resources are expressed with RAII (resource acquisition is initialization); the ownership rules of `shared_ptr`/`unique_ptr` correspond to the site's [Smart Pointer pattern](/structural/smart-pointer);
- Callbacks and callable objects are expressed with `std::function` plus `std::visit`/lambda, not hand-written function-pointer tables, corresponding to [Callback pattern](/behavioral/callback) and [Strategy pattern](/behavioral/strategy);
- Interfaces are small and narrow, runtime polymorphism is expressed with abstract classes, consistent with [Bridge pattern](/structural/bridge)'s separation of abstraction and implementation.

Guidelines items R.30/R.31 and so on cover `unique_ptr` and `shared_ptr` parameter passing; the site's smart-pointer examples use "pass by value + move", consistent with them.

### Go official docs and blog [S21]

Go's pattern landing is different from Java and C++: no inheritance, relying on implicit interface implementation plus struct embedding.

- Patterns of the "algorithm can be swapped" kind, such as strategy and template method, are expressed in Go with function types or small interfaces, corresponding to [Strategy pattern](/behavioral/strategy) and [Template Method pattern](/behavioral/template-method);
- Composition over inheritance is the language default in Go, corresponding to [Composition over Inheritance](/evolution/composition-over-inheritance), new this round;
- The goroutine-plus-channel pipeline style corresponds to [Producer-Consumer pattern](/concurrency/producer-consumer); the official blog's "Pipelines and cancellation" section gives the correct way to use `close`, `range`, and `select`;
- `context.Context` carries timeout and cancellation propagation. The Go code in the site's [gRPC remote-proxy example](/structural/remote-proxy) takes a `ctx` parameter, which is the default Go habit for writing timeouts and cancellation; middleware such as the chain of responsibility also passes `ctx` as the first argument.

### Vue.js official docs [S22]

The Composition API is the direct front-end landing of "composition over inheritance": logic, state, and lifecycle for the same functionality are gathered in one function, rather than scattered by option across `data`/`methods`/`computed`. The front-end example in [Composition over Inheritance](/evolution/composition-over-inheritance) follows that doc's wording, including logic reuse by combining function return values rather than by mixin.

### React official docs [S23]

React's component-composition path: bottom-up, UI is composed by nesting components + props; when state is not enough, lift state up; repeated logic is collected in a custom Hook. Like Vue's Composition API, it is a landing of "composition over inheritance", and both are written up together in [Composition over Inheritance](/evolution/composition-over-inheritance).

### Microsoft Learn: .NET design guidelines [S24]

.NET-side interface design, extensibility, and naming conventions. The C# examples in the site's dependency-injection, proxy, and decorator pages follow its conventions: dependencies are injected through constructors, and extension points use interfaces rather than virtual base classes.

### Spring official docs [S27]

The source of truth for dependency-injection landing: inversion of control means the container handles object assembly and application code only declares what it needs. This corresponds to the comparison between [Dependency Injection](/structural/dependency-injection) and [Service Locator](/creational/service-locator) — both move "looking up an implementation" out of business code, and the difference is who initiates the assembly.

### MDN Web Docs [S28]

Front-end language-layer checks: `Proxy` corresponds to [Dynamic Proxy](/structural/dynamic-proxy) and [Protection Proxy](/structural/protection-proxy); the iterator protocol corresponds to [Iterator pattern](/behavioral/iterator); `EventTarget`'s `addEventListener`/`removeEventListener` is the language-built-in observer pattern, corresponding to [Observer pattern](/behavioral/observer).

## Community sites

### Refactoring.Guru [S16]

Pattern entries switch examples per language (Java, C#, Go, TypeScript, etc.), and each entry gives intent, structure, code, and "how to tell whether to use it". Where the site matches its naming: the three-way split of creational/structural/behavioral, the four proxy variants (virtual, protection, remote, dynamic), and the composite-vs-decorator contrast. Difference: it treats "null object" as a standalone entry, which the site does not have; recorded in the differences table.

### SourceMaking [S17]

Design-pattern and anti-pattern entries come with UML and pros/cons sections. The structure of the site's four anti-pattern pages (shape, cause, cost, how to get out) follows its section order; the Chinese rendering of "spaghetti code" is consistent with how it handles Spaghetti Code.

### iluwatar/java-design-patterns [S18]

A Java implementation repo of roughly a hundred pattern entries, each with a class diagram and runnable example. Its entries that the site does not have are decided this round by whether they appear in an authoritative book catalog:

- With a book source (null object, repository, specification, bulkhead, circuit breaker) → circuit breaker is filled this round; the rest are recorded in the differences table;
- Community-only, no book source (for example "role object", "environment object") → not included.

## Results of cross-checking

1. The site's concurrency pages' standard-library names are consistent with the Java SE docs; the two new pages this round, thread pool and read-write lock, take `ThreadPoolExecutor` and `ReentrantReadWriteLock` as the standard.
2. The site's C++ examples use copy-and-swap for smart-pointer assignment, consistent with the Guidelines' resource-management intent (this round also fixed the older hand-written self-assignment check).
3. Go examples do not contain the word "inheritance"; composition is expressed with embedding.
4. Front-end examples do not use Vue 2 options or React class components; everything uses the Composition API and function components.

## Sources

- [SourceMaking · Design Patterns](https://sourcemaking.com/design_patterns) ([S17])
- [iluwatar/java-design-patterns](https://github.com/iluwatar/java-design-patterns) ([S18])
- [Refactoring.Guru · Design Patterns](https://refactoring.guru/design-patterns)

<!-- BACKLINKS-AUTO -->
## Related pages

- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [coverage](coverage.md)
- [overview](overview.md)
