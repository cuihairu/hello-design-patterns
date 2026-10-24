# Books and Standards

Entries are broken down per book, and each book is checked against in-site coverage. "Covered" means the site has a body page; "partial" means the site has an adjacent page but with different wording or angle; "gap" means no corresponding page. Item-by-item differences and dispositions are in [Coverage and Differences](/research/coverage).

## Design Patterns (GoF, 1994) [S1]

23 patterns: 5 creational, 7 structural, 11 behavioral. This is the baseline for this repo.

| Category | Patterns | In-site |
| --- | --- | --- |
| Creational (5) | Abstract Factory, Builder, Factory Method, Prototype, Singleton | 5/5 all have pages |
| Structural (7) | Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy | 7/7 all have pages |
| Behavioral (11) | Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor | 11/11 all have pages |

Beyond GoF, the site also collects entries it does not have: multiton, object pool, service locator (creational); dynamic proxy, protection proxy, remote proxy, virtual proxy, smart pointer, two-way bridge, dependency injection (structural); callback, DSL, snapshot (behavioral); plus two catalogs, concurrency and domain-specific.

## Head First Design Patterns (2nd edition, 2020) [S2]

A case-driven book; it has fewer patterns than GoF, but its teaching order follows "solve one problem first". Its catalog all lands in the site's existing pages on strategy, observer, command, adapter and facade, template method, iterator and composite, state, singleton, decorator, factory method, abstract factory, and proxy.

This book adds two requirements for this repo:

1. Its observer chapter discusses the open-closed principle, and the 2nd edition also adds Lambda and functional-interface idioms. The site had no page dedicated to the open-closed principle and SOLID, so this round adds [SOLID and Dependency Rule](/evolution/solid) under [Modern Evolution Overview](/evolution/overview).
2. It explicitly discusses the costs of singleton (global state, hard to test, broken by serialization and reflection). The site's [Singleton](/creational/singleton) page has implementation details but lacks the counter-perspective, which is picked up by [God Object](/anti-patterns/god-object) and [Golden Hammer](/anti-patterns/golden-hammer).

## Clean Architecture (2017) [S3]

Three blocks of content and how they map to the site:

- The five SOLID principles → new this round: [Composition over Inheritance](/evolution/composition-over-inheritance) and [SOLID and Dependency Rule](/evolution/solid);
- The dependency rule and layering (entities, use cases, interface adapters, frameworks and drivers) → the site has no architecture-layering page; this round does not expand it, only the SOLID page covers the direction of dependencies;
- The three component-level principles (replicated reuse, stable dependencies, acyclic dependencies) → same as above, listed under "further reading" in the SOLID page and not made into a separate page for now.

The earlier source of SOLID is Martin's 2002 book [S4]; the two are consistent.

## Patterns of Enterprise Application Architecture (2002) [S5]

This book's catalog is grouped into domain logic, data source architecture, Web presentation, distribution, and concurrency and transactions. Checked item by item:

- The four domain-logic styles (transaction script, domain model, table module, active record): the site only mentions active record and data mapper in passing in [ORM](/other/orm); transaction script is listed in the [design patterns overview](/introduction) but has no page. This round adds [Transaction Script](/other/transaction-script) and pairs it with [Anemic Domain Model](/anti-patterns/anemic-domain-model).
- The four data-source styles (table gateway, row data gateway, active record, data mapper): covered by the ORM page; not a separate page.
- Repository and unit of work: the site originally had neither; repository shares its origin with DDD's repository [S11]. Not added this round; listed under "not included for now" in the differences table, on the grounds that its boundary with the ORM page must be drawn first (filled on 2026-10-10 as [Repository and Unit of Work](/other/repository)).
- Web presentation (front controller, page controller, template view): partially covered by the MVC page; front controller is missing, not added this round.
- Remote facade and data transfer object: differs in angle from the site's [Remote Proxy](/structural/remote-proxy) — the former is oriented at the service boundary, the latter at object access. Not added this round; recorded in the differences table (filled on 2026-10-10 as [Remote Facade and Data Transfer Object](/structural/remote-facade)).

## Refactoring (2nd edition, 2018) [S6]

The code-smell catalog (long functions, large classes, feature envy, data clumps, shotgun surgery, and so on) is the code-layer basis for the anti-pattern pages. The site originally had no code smells at all; this round uses [Anti-Patterns Overview](/anti-patterns/overview) to make the three-layer relationship "smell — anti-pattern — pattern" clear. The evolution paths of specific smells refer to Joshua Kerievsky's *Refactoring to Patterns* [S14]; the site does not copy the book's catalog item by item.

## AntiPatterns (1998) and Big Ball of Mud (1997) [S7][S8]

Two anti-pattern sources; this round lands 4 body pages:

| Entry | Source | In-site |
| --- | --- | --- |
| Spaghetti Code | AntiPatterns architecture anti-patterns [S7] | New |
| Golden Hammer | AntiPatterns common anti-patterns [S7] | New |
| God Object | Combined entry and code-smell synthesis [S25][S6] | New |
| Big Ball of Mud | PLoP paper [S8] | New |

[Anemic Domain Model](/anti-patterns/anemic-domain-model) comes from Martin's bliki entry [S26] and is paired with transaction script.

## Pattern-Oriented Software Architecture (POSA, volumes 1 and 2) [S9]

- Volume 1's layering, pipes-and-filters, blackboard, and proxy: the site has [Proxy](/structural/proxy); layering, pipes-and-filters, and blackboard are architecture styles that constrain system-wide topology. As of 2026-10-10 they were judged "not included" per the criteria; the disposition is recorded in the [differences table](/research/coverage).
- Volume 2's reactor, proactor, active object, producer-consumer, and half-sync/half-async: the first four all have pages on the site; half-sync/half-async is close to [Active Object](/concurrency/active-object), so not added this round.

## Enterprise Integration Patterns (2002) [S10]

Entries such as message channel, message router, message translator, and publish-subscribe: the site covers "notify and dispatch" in approximate form via [Observer](/behavioral/observer), [Mediator](/behavioral/mediator), and [Chain of Responsibility](/behavioral/chain-of-responsibility), but has no standalone pages for message pipelines and routing. Not added this round; recorded in the differences table, on the grounds that the repo first had to decide whether to open an "integration patterns" section (the section was opened on 2026-10-10 with four standalone pages; see [Integration Patterns Overview](/integration/overview)).

## Domain-Driven Design (2003) [S11]

Aggregate, repository, specification, bounded context: the site originally had none. Repository was filled on 2026-10-10 as [Repository and Unit of Work](/other/repository); specification is still not a standalone page for now; aggregate and bounded context belong to strategic design, outside this repo's "pattern" scope, so both are recorded under "not included for now" in the differences table with reasons.

## Release It! (2nd edition, 2018) [S12]

Among stability patterns, the site had none. Circuit breaker has the broadest application surface (used in rate limiting, degradation, and fault isolation alike), so this round adds [Circuit Breaker](/evolution/circuit-breaker). Bulkhead, timeout, and retry were filled in the same batch on 2026-10-10; steady state is an operational discipline of capacity and degradation, not made into a standalone page — see differences table 2c.

## Microservices and containers [S13][S15]

API gateway, service discovery, Saga, circuit breaker vs. fuse, Sidecar, declarative API: the site only has narrative around [Event Sourcing](/other/event-sourcing) and Saga. These two books' catalogs are recorded in the differences table as future topic sources; not added this round.

## Gaps identified this round from book catalogs

14 in total, all filled as new pages; item by item in the second table of [Coverage and Differences](/research/coverage):

- 6 anti-patterns: overview, god object, big ball of mud, golden hammer, spaghetti code, anemic domain model.
- 4 modern evolutions: overview, composition over inheritance, SOLID and dependency rule, circuit breaker.
- 3 concurrency: thread pool, read-write lock, work stealing ([design patterns overview](/introduction) already declared them; the site was missing the pages).
- 1 other: transaction script (also declared-but-missing in the overview).

## Sources

- The bibliography for this page is reconciled against the [source list in the Research Overview](/research/overview#source-list).
- [Wikipedia · Software design pattern](https://en.wikipedia.org/wiki/Software_design_pattern)
- [Fowler · eaaCatalog](https://martinfowler.com/eaaCatalog/)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](/anti-patterns/overview.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [coverage](coverage.md)
- [overview](overview.md)
