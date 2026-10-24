# Knowledge Points

The five research pages answer "what the authoritative sources say, how much the site covers, and how the gaps were handled" (see the [research overview](/research/overview)). This page collects those evidence-backed conclusions into a single knowledge web. Source IDs S1-S28 follow the [source list in the research overview](/research/overview#source-list); to trace how a conclusion was reached, follow the entry's links back to the research page or the on-site landing page. English-Chinese term pairs and one-sentence definitions live in the [glossary](/glossary).

## Core Concepts

### The GoF 23 is a baseline, not a boundary

All 23 GoF patterns have full articles on the site (5 creational, 7 structural, 11 behavioral), coverage check 23/23. The site also collects entries GoF didn't have; at the time of the check (2026-10-08) that was 24: Multiton, Object Pool, Service Locator, the four proxy variants, Smart Pointer, Bidirectional Bridge, Dependency Injection, Callback, DSL, plus the concurrency and domain-specific groups (the snapshot page is a redirect for Memento, not counted). The research also drew the boundary: aggregates and bounded contexts are strategic-design vocabulary, API gateway and Saga belong to distributed-system design — none of these fall within the "object-level pattern" scope, with per-entry reasons in [coverage and differences](/research/coverage) (source: [books and standards research](/research/books), [S1]). Boundary criterion finalized 2026-10-10: component-level collaboration patterns that can be implemented independently and are standardized by frameworks — collected, the [Integration Patterns](/integration/overview) section follows this rule; architectural styles that constrain whole-system topology — not collected, so layering, pipes-and-filters, etc. remain excluded.

### Code smells, anti-patterns, and patterns form a three-tier relationship

The smell catalog in *Refactoring* 2nd edition (long method, shotgun surgery, feature envy) is the code-layer basis; AntiPatterns and Big Ball of Mud give architecture- and project-layer entries; patterns are the road walked. Anti-pattern pages follow a four-part structure — "shape, cause, cost, way out" — reusing SourceMaking's entry skeleton ([S6][S7][S17]).

### SOLID's origin traces to the 2002 book

The five principles first appeared in Martin's 2002 *Agile Software Development: Principles, Patterns, and Practices* [S4]; Clean Architecture [S3] folded them into the dependency rule. The site discusses only dependency direction in [SOLID and Dependency Rules](/evolution/solid); architectural layering and component-level principles don't have standalone pages yet, because the boundary with "pattern" scope needs to be established first (source: [books research](/research/books) §3).

### Composition over inheritance is the language default in Go and on the front end

Go has no inheritance; reuse comes from struct embedding plus small interfaces. Vue's Composition API gathers the logic, state, and lifecycle of one feature into a single function; React uses component nesting plus custom hooks to converge. These are the same principle landing on different platforms, all covered in [Composition over Inheritance](/evolution/composition-over-inheritance) ([S21][S22][S23]).

### Stability patterns come from *Release It!*; circuit breaker has the widest application

The circuit breaker simultaneously serves rate limiting, degradation, and fault isolation; it is now standard in gateways and RPC clients. The breakers in Resilience4j, Polly, and Sentinel are the same model — if the failure rate in a stats window exceeds the threshold, fail directly instead of hitting the downstream. The other three from the same book are also covered ([Bulkhead](/evolution/bulkhead), [Timeout](/evolution/timeout), [Retry](/evolution/retry)), each covering one aspect: bulkhead caps simultaneous usage, timeout bounds a single call, retry recovers transient faults, circuit breaker trips during sustained failures. Steady state prescribes "every consumable resource needs a replenishment mechanism" — a capacity discipline, not a standalone page [S12].

### Some patterns don't need to be written in some languages

Strategy in Java passes a `Function`, in C++ a `std::function` or a template parameter, in TypeScript a function property — none need a subclass per algorithm. Observer in the browser is `EventTarget`'s `addEventListener` [S28]; dynamic proxy in JavaScript is the language-built-in `Proxy` object. Languages swallowing patterns is the norm; example code follows language convention and doesn't force class diagrams (source: [applications and language](/research/applications)).

## Authoritative Book Highlights

Per-book cross-reference is in [books and standards research](/research/books); here is the condensed positioning table:

| Book | Author / Publisher | Corresponding knowledge point |
| --- | --- | --- |
| Design Patterns (GoF) [S1] | Gamma et al., Addison-Wesley, 1994 | 23-pattern baseline: 5 creational, 7 structural, 11 behavioral |
| Head First Design Patterns (2nd ed.) [S2] | Freeman et al., O'Reilly, 2020 | Case-driven teaching order; the Observer chapter covers open-closed principle, 2nd ed. adds lambda form |
| Clean Architecture [S3] | Robert C. Martin, 2017 | SOLID, dependency rule, component-level principles |
| Agile SW Development [S4] | Robert C. Martin, 2002 | Original source of SOLID |
| Patterns of Enterprise Application Architecture [S5] | Martin Fowler, 2002 | Transaction Script, Active Record, Data Mapper, Repository, Unit of Work; the four domain-logic styles and four data-source styles |
| Refactoring (2nd ed.) [S6] | Martin Fowler, 2018 | Code-smell catalog, code-layer basis for anti-patterns |
| AntiPatterns [S7] | Brown et al., Wiley, 1998 | Source of Golden Hammer and Spaghetti Code |
| Big Ball of Mud [S8] | Foote, Yoder, PLoP 1997 | Original Big Ball of Mud paper |
| POSA vol. 1, vol. 2 [S9] | Buschmann et al., Wiley | Layering, pipes-and-filters, reactor, proactor, active object |
| Enterprise Integration Patterns [S10] | Hohpe, Woolf, 2002 | Message channel, router, translator, publish-subscribe; section opened, see [Integration Patterns](/integration/overview) |
| Domain-Driven Design [S11] | Eric Evans, 2003 | Strategic-design vocabulary; not collected by this site, see difference table |
| Release It! (2nd ed.) [S12] | Nygard, 2018 | Circuit Breaker, Bulkhead, Timeout, Retry, steady state |
| Microservices Patterns [S13] | Richardson, 2018 | Source for API gateway, Saga, event sourcing topics |
| Refactoring to Patterns [S14] | Kerievsky, 2004 | Evolution path from smells to patterns |
| Kubernetes Patterns [S15] | Ibryam, Huss, 2019 | Container-platform patterns, topic source |

Two books drove extra requirements: Head First's Singleton cost discussion (global state, hard to test, serialization and reflection breakage) is carried by the negative-angle coverage in [God Object](/anti-patterns/god-object) and [Golden Hammer](/anti-patterns/golden-hammer); of PoEAA's four domain-logic styles only Transaction Script lacked a page, added as [Transaction Script](/other/transaction-script) and contrasted with [Anemic Domain Model](/anti-patterns/anemic-domain-model); the four data-source styles are covered by the [ORM page](/other/orm) and not duplicated.

## Official Documentation Highlights

Cross-reference of 8 official docs and 3 community sites is in [official and community docs research](/research/official-docs). The condensed takeaways, with entry links registered under official domains:

| Source | Entry | Key points |
| --- | --- | --- |
| Java SE `java.util.concurrent` [S19] | [docs.oracle.com](https://docs.oracle.com/) | Concurrency terminology baseline; `Future.get()` blocks, composition and callbacks need `CompletableFuture`; `Semaphore`'s `acquire` is interruptible — release only after acquiring |
| C++ Core Guidelines [S20] | [isocpp.github.io](https://isocpp.github.io/CppCoreGuidelines/) | Resources expressed via RAII; `unique_ptr`/`shared_ptr` parameter passing per R.30/R.31; site examples follow "pass by value + move" |
| Go official docs [S21] | [go.dev](https://go.dev/) | No inheritance; implicit interface implementation plus struct embedding; `context.Context` as first param for timeout and cancellation; pipeline `close`, `range`, `select` per official blog |
| Vue.js docs [S22] | [vuejs.org](https://vuejs.org/) | Composition API: logic reuse via function return values, not mixins |
| React docs [S23] | [react.dev](https://react.dev/) | Component nesting + props composition, state lifting, repeated logic via custom hooks |
| .NET design guidance [S24] | [learn.microsoft.com](https://learn.microsoft.com/) | Dependencies via constructor injection; extension points via interfaces, not virtual-method base classes |
| Spring docs [S27] | [docs.spring.io](https://docs.spring.io/) | IoC — the container assembles; difference from [Service Locator](/creational/service-locator) is who initiates wiring |
| MDN [S28] | [developer.mozilla.org](https://developer.mozilla.org/) | `Proxy`, iterator protocol, `EventTarget` are the three front-end language-built-in pattern landings |
| Refactoring.Guru [S16] | [refactoring.guru](https://refactoring.guru/) | Three-way classification and four proxy variants match the naming; it gives Null Object a standalone entry, this site folds it into the Strategy section |
| SourceMaking [S17] | [sourcemaking.com](https://sourcemaking.com/) | Source of the four-part anti-pattern skeleton |
| iluwatar/java-design-patterns [S18] | [github.com](https://github.com/iluwatar/java-design-patterns) | Collection criterion is "does it have a book source": Circuit Breaker does (*Release It!*), but purely community entries like Category Object and Environment Object are not collected |

## Application Scenarios

The full scenario-to-pattern table is in [applications and language](/research/applications). The six-group skeleton:

| Scenario | Representative patterns | Landing form |
| --- | --- | --- |
| Object creation and assembly | Abstract Factory, Builder, Singleton, Object Pool | Java/C# assembled by a container; Go written in `main` |
| Interface adaptation and access control | Adapter, Facade, four proxy variants, Decorator | Java `java.lang.reflect.Proxy`, JS `Proxy`, C++ wrapper classes |
| Behavior and flow | Strategy, Template Method, Observer, Chain of Responsibility, State, Visitor | Middleware stacks are Chain of Responsibility in web frameworks |
| Concurrency and async | Thread Pool, Read-Write Lock, Work Stealing, Producer-Consumer, Future | Terminology per `j.u.c` docs |
| Data and layering | ORM, Transaction Script, Event Sourcing, MVC/MVVM | Event sourcing records processes, memento records instants |
| Distributed and cloud | Circuit Breaker, Bulkhead, Timeout, Retry | Same model in Resilience4j, Polly, Sentinel — four parallel modules in Resilience4j |
| Integration and decoupling | Message Channel, Message Router, Message Translator, Publish-Subscribe | Spring Integration and Apache Camel use the same vocabulary |

Four multi-language conventions: polymorphism per language habit (Java/C# interfaces, C++ abstract classes, Go small interfaces + embedding); reuse logic uniformly rewritten as composition; Singleton costs are most visible in Java/C#, Go package-level variables are equally untestable; thread models drive concurrency examples (Java thread pools, C++ `std::jthread` + `std::stop_token`, Go goroutines + channels).

## Common Pitfalls and Misconceptions

| Pitfall | Fact | Expansion page |
| --- | --- | --- |
| Using `Future` for async composition | `Future.get()` blocks; composition and callbacks need `CompletableFuture` | [Future](/concurrency/future) |
| `Semaphore` released before acquired | `acquire` is interruptible; a permit must be released only while held — reversing the order means no limit at all | [Semaphore](/concurrency/semaphore) |
| Hand-writing self-assignment checks in C++ | The old form is superseded by copy-and-swap, consistent with the Guidelines' resource-management intent | [Smart Pointer](/structural/smart-pointer) |
| Cross-language literal translation of patterns | Go's template method has no abstract class; express the same skeleton with interfaces plus embedding — copying a Java class diagram doesn't hold | [Template Method](/behavioral/template-method) |
| Hand-writing double-dispatch tables in C++ | The idiom is `std::variant` + `std::visit`, leaving branch handling to the standard library | [Visitor](/behavioral/visitor) |
| Front-end examples using old paradigms | Vue 2 options API and React class components are not written; uniformly use Composition API and function components | [Composition over Inheritance](/evolution/composition-over-inheritance) |
| Retrying non-idempotent operations directly | Retrying a debit once means two debits — add an idempotency key first, or check the result before retrying | [Retry](/evolution/retry) |
| Setting a timeout shorter than the downstream P99 | Normal slow requests get killed, but the downstream side effect already happened — set read timeouts at 1.5-2x the downstream P99 | [Timeout](/evolution/timeout) |
| Using Null Object as Optional | Null Object is "present but does nothing" — callers are unaware; Optional is "may be absent" — callers still handle the missing branch. They solve different problems | [Strategy](/behavioral/strategy) |

## Coverage Check Conclusions

The per-entry check table is in [coverage and differences](/research/coverage). The numbers condensed:

- GoF 23/23 all have full articles — no gaps.
- Research found 14 gaps, all filled as new pages: 6 anti-patterns, 4 modern evolution, 3 concurrency (thread pool, read-write lock, work stealing — declared in overview but missing pages), 1 other (Transaction Script).
- 12 rows found in research but not added at check time ([coverage and differences](/research/coverage) table 2b), each with a reason: aggregates and bounded contexts are outside the "pattern" scope, architectural styles stay excluded per the criterion. Of these, 5 were completed per the criterion (2026-10-10) — bulkhead/timeout/retry, Repository and Unit of Work, null object (folded into [Strategy](/behavioral/strategy)), the four integration-pattern pages, and Remote Facade and Data Transfer Object — totaling 11 entries; steady state is decided against a standalone page, so the difference table has no outstanding candidates.
- 6 on-site cross-reference inconsistencies, fixed in this revision (Smart Pointer typo, overview missing DSL and the three concurrency pages, reference index missing three book groups).
- On-site Markdown grew from 56 to 75 pages, pattern body from 47 to 59 (of the 14 new pages, 2 are section overviews and not counted as body); after adding this page 76; after the three stability pages 79, pattern body 62; after Repository and Unit of Work 80, pattern body 63; after the five integration-pattern pages 85, pattern body 67; after Remote Facade and Data Transfer Object 86, pattern body 68.

## Sources and Scope

- Source IDs and book publication info are per the [source list in the research overview](/research/overview#source-list); maintain that list when revising.
- Check method: book catalogs broken into entries, each checked against files under `docs/`; verdicts have only three tiers — has full article, declared but unimplemented, gap. Check date 2026-10-08.
- Verification: on-site links are all absolute paths; `npm run docs:build` dead-link check is the backstop.

## References

- [Research Overview](/research/overview) — scope, method, conclusions, and the 28-entry source list
- [Books and Standards](/research/books) — per-book cross-reference of 15 books
- [Official and Community Docs](/research/official-docs) — 8 official docs and 3 community sites
- [Applications and Language](/research/applications) — scenario-to-API cross-reference table
- [Coverage and Differences](/research/coverage) — three tables: coverage, gaps, cross-reference revisions

<!-- BACKLINKS-AUTO -->
## Related pages

- [reference](reference.md)
- [coverage](/research/coverage.md)
