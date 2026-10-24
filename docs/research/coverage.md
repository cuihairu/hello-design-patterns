# Coverage and Differences

Check standard: break the catalogs of authoritative books and documents into entries, and check each entry against files under `docs/` on the site; the site's own three sets of cross-references (intro, reference, and sidebar plus each catalog overview) are checked for consistency separately. Check date: 2026-10-08. Source numbers are in the [source list of the Research Overview](/research/overview#source-list).

Counting standard: total documents = all Markdown under `docs/`; pattern body = total documents − 5 pages (home/intro/reference/knowledge/glossary) − 1 snapshot redirect page − 8 section overview pages − 5 survey pages. As of 2026-10-14: total documents 87, pattern body 68.

## Table 1: GoF 23 patterns × in-site coverage

Conclusion: 23/23 all have body pages, nothing needs to be added.

| Category | Patterns and in-site links | Coverage |
| --- | --- | --- |
| Creational 5 | [Abstract Factory](/creational/abstract-factory), [Builder](/creational/builder), [Factory Method](/creational/factory-method), [Prototype](/creational/prototype), [Singleton](/creational/singleton) | 5/5 |
| Structural 7 | [Adapter](/structural/adapter), [Bridge](/structural/bridge), [Composite](/structural/composite), [Decorator](/structural/decorator), [Facade](/structural/facade), [Flyweight](/structural/flyweight), [Proxy](/structural/proxy) | 7/7 |
| Behavioral 11 | [Chain of Responsibility](/behavioral/chain-of-responsibility), [Command](/behavioral/command), [Interpreter](/behavioral/interpreter), [Iterator](/behavioral/iterator), [Mediator](/behavioral/mediator), [Memento](/behavioral/memento), [Observer](/behavioral/observer), [State](/behavioral/state), [Strategy](/behavioral/strategy), [Template Method](/behavioral/template-method), [Visitor](/behavioral/visitor) | 11/11 |

The 24 entries the site has beyond GoF (multiton, object pool, service locator, dynamic/protection/remote/virtual proxy, smart pointer, two-way bridge, dependency injection, callback, DSL, snapshot, 8 concurrency entries, 4 other entries) are not in this table; their dispositions are in Table 2. The 2026-10-10 increment also added three stability entries and one repository entry, with dispositions in Table 2c.

## Table 2: Survey entries × in-site gaps

### 2a. The 14 gaps filled this round

| # | Gap entry | Source | New page |
| --- | --- | --- | --- |
| 1 | Anti-pattern methodology (the three-layer relationship smell — anti-pattern — pattern) | [S6][S7] | [Anti-Patterns Overview](/anti-patterns/overview) |
| 2 | God Object | [S6][S25] | [God Object](/anti-patterns/god-object) |
| 3 | Big Ball of Mud | [S8] | [Big Ball of Mud](/anti-patterns/big-ball-of-mud) |
| 4 | Golden Hammer | [S7][S17] | [Golden Hammer](/anti-patterns/golden-hammer) |
| 5 | Spaghetti Code | [S7][S17] | [Spaghetti Code](/anti-patterns/spaghetti-code) |
| 6 | Anemic Domain Model | [S26][S5] | [Anemic Domain Model](/anti-patterns/anemic-domain-model) |
| 7 | Modern evolution topic framing (where patterns go after GoF) | [S2][S3] | [Modern Evolution Overview](/evolution/overview) |
| 8 | Composition over inheritance / composition-based design | [S1][S2][S22][S23] | [Composition over Inheritance](/evolution/composition-over-inheritance) |
| 9 | The five SOLID principles and the dependency rule | [S3][S4] | [SOLID and Dependency Rule](/evolution/solid) |
| 10 | Circuit Breaker | [S12] | [Circuit Breaker](/evolution/circuit-breaker) |
| 11 | Thread Pool (declared in the overview, no in-site page) | [S19] | [Thread Pool](/concurrency/thread-pool) |
| 12 | Read-Write Lock (declared in the overview, no in-site page) | [S19] | [Read-Write Lock](/concurrency/read-write-lock) |
| 13 | Work Stealing (declared in the overview, no in-site page) | [S19] | [Work Stealing](/concurrency/work-stealing) |
| 14 | Transaction Script (declared in the overview, no in-site page) | [S5] | [Transaction Script](/other/transaction-script) |

All 14 gaps filled, `gaps_filled = 14`.

### 2b. Entries surveyed but not added this round

Everything not added states its reason, so the next survey does not have to re-audit.

| Entry | Source | Disposition and reason |
| --- | --- | --- |
| Null Object | [S16] | Merged into the [Strategy pattern](/behavioral/strategy) section per the established standard (2026-10-10); not a standalone page |
| Repository, unit of work | [S5][S11] | Filled on 2026-10-10 (see Table 2c); standard: repository = the domain-layer interface between aggregate root and persistence, ORM handles table ↔ object mapping |
| Active Record, table gateway, row data gateway | [S5] | Covered by the [ORM page](/other/orm); not repeated as a page |
| Front controller, page controller, template view | [S5] | Partially covered by the [MVC page](/other/mvc); not a standalone page for now |
| Remote facade, data transfer object | [S5] | Differs in angle from [Remote Proxy](/structural/remote-proxy); not added for now, recorded as a candidate (filled on 2026-10-10, see Table 2d) |
| Layered architecture, pipes-and-filters, blackboard, microkernel | [S9] | Kept excluded (standard settled, 2026-10-10): include patterns of component-level collaboration that can be implemented independently and standardized by frameworks; exclude architecture styles that constrain system-wide topology. The criterion is recorded on the [Knowledge page core concepts](/knowledge) |
| Half-sync/half-async | [S9] | Overlaps with [Active Object](/concurrency/active-object); not added for now |
| Bulkhead, timeout, retry, steady state | [S12] | Bulkhead, timeout, and retry were filled on 2026-10-10 (see Table 2c); steady state is a capacity discipline, not an encapsulable pattern, so not a standalone page |
| Message channel, message routing, message transformation, publish-subscribe | [S10] | Opened as the "integration patterns" section on 2026-10-10 (see Table 2c) |
| Aggregate, bounded context, specification | [S11] | Strategic-design vocabulary, outside this repo's "pattern" scope |
| API gateway, service discovery, Saga, Sidecar | [S13][S15] | Distributed system design, outside the current scope |
| Role object, environment object, and other community-only entries | [S18] | No book source; not included |

### 2c. 2026-10-10 increment

On the same day, the site first added the [Knowledge roundup](/knowledge) page (consolidating survey conclusions; not counted in pattern body), taking total documents 75 → 76. The counts in the tables below are on that base. The stability-pattern row in Table 2b is then landed as follows:

| Entry | Source | New page |
| --- | --- | --- |
| Bulkhead | [S12] | [Bulkhead](/evolution/bulkhead) |
| Timeout | [S12] | [Timeout](/evolution/timeout) |
| Retry | [S12] | [Retry](/evolution/retry) |
| Steady State | [S12] | Not a standalone page. It says "every consumable resource needs a replenishment mechanism" — an operational discipline of capacity and degradation, not an encapsulable object-level pattern |

After filling, total documents 76 → 79, pattern body 59 → 62.

One more item added on 2026-10-10:

| Entry | Source | New page |
| --- | --- | --- |
| Repository, unit of work | [S5][S11] | [Repository and Unit of Work](/other/repository) |

Standard: repository = the domain-layer interface between aggregate root and persistence (interface in the domain layer, implementation in the infrastructure layer), ORM handles table ↔ object mapping. After filling, total documents 79 → 80, pattern body 62 → 63.

The integration-patterns section was landed on 2026-10-10:

| Entry | Source | New page |
| --- | --- | --- |
| Integration-patterns topic framing (EIP section) | [S10] | [Integration Patterns Overview](/integration/overview) |
| Message Channel | [S10] | [Message Channel](/integration/message-channel) |
| Message Router | [S10] | [Message Router](/integration/message-router) |
| Message Translator | [S10] | [Message Translator](/integration/message-translator) |
| Publish-Subscribe | [S10] | [Publish-Subscribe](/integration/publish-subscribe) |

Section criterion: EIP [S10] as the source; landing in both Spring Integration and Apache Camel meets the consensus standard; each entry is component-level collaboration (independently implementable, replaceable), not system-wide topology. After filling, total documents 80 → 85, pattern body 63 → 67.

### 2d. 2026-10-10 candidate landed

The only candidate in Table 2b is landed as follows:

| Entry | Source | New page |
| --- | --- | --- |
| Remote facade, data transfer object | [S5] | [Remote Facade and Data Transfer Object](/structural/remote-facade) |

Standard: remote facade = a coarse-grained use-case interface at the service boundary (abandoning transparency, granularity follows the use case), in contrast to the transparency-oriented [Remote Proxy](/structural/remote-proxy); data transfer object = a pure data carrier across the boundary, domain objects do not leave the boundary. After filling, total documents 85 → 86, pattern body 67 → 68. This closes all dispositions in Table 2b, with no candidate left outstanding.

On 2026-10-14 the [Glossary](/glossary) was added (Chinese-English term pairs and sources; navigation in nature, not counted in pattern body), taking total documents 86 → 87, pattern body 68 unchanged; the same batch added a "Sources" subsection to the end of every body page (`[S#]` numbers plus clickable links, conventions in [Research Overview](/research/overview#citation-conventions)).

## Table 3: In-site cross-reference inconsistencies (6, fixed)

| # | Location | Problem | Disposition |
| --- | --- | --- | --- |
| 1 | [Reference](/reference) smart-pointer entry | Wrote "smart guideline pattern" | Changed to "smart pointer pattern" |
| 2 | [Design patterns overview](/introduction) behavioral list | Missed the in-site DSL page | Added the DSL entry |
| 3 | [Concurrency patterns overview](/concurrency/overview) | Missing thread pool, read-write lock, work stealing | Added the three to the catalog list and selection advice |
| 4 | [Other patterns overview](/other/overview) | Missing transaction script | Added to the catalog list |
| 5 | [Design patterns overview](/introduction) ending | No entry points for anti-patterns and modern evolution | Added two section entry points |
| 6 | [Reference](/reference) in-site index | Did not collect the three groups anti-patterns, modern evolution, and survey | Index completed, plus book entries for AntiPatterns, Release It!, DDD, and so on |

One more handled alongside: the [Snapshot pattern](/behavioral/snapshot) page is a redirect merged into the memento pattern, so it is not in the sidebar; the reference page keeps its pointer and is left unchanged.

A 2026-10-10 recheck added two more: the in-site index in [Reference](/reference) missed the thread pool, read-write lock, and work stealing pages plus the [Knowledge roundup](/knowledge) page, now added; a script was run against the sidebar, each section overview, the in-site index, and the actual files under `docs/` — all four now match.

## New page list (19 pages)

14 pattern-gap pages, see Table 2a; plus 5 survey pages:

- [Research Overview](/research/overview): scope, method, conclusions, and the 28-entry source list
- [Books and Standards](/research/books): 15 books checked one by one
- [Official and Community Docs](/research/official-docs): 8 official docs and 3 community sites
- [Applications and Language](/research/applications): scenario-to-API comparison tables
- This page: Coverage and Differences

## Check and acceptance method

1. The in-site file list is taken with `git ls-files docs | grep '\.md$'`, not from memory.
2. In-site links for new pages are written as absolute paths (`/section/file`) and backstopped by VitePress dead-link checking: if `npm run docs:build` does not pass, the work is considered incomplete.
3. The 23 GoF entries were checked against filenames one by one, see Table 1.
4. Referenced API names take the Java SE, C++ Core Guidelines, Go, Vue, and React official docs as the standard, see [Official and Community Docs](/research/official-docs).
5. After filling, total documents 56 → 75, of which pattern body 47 → 59 (2 of the 14 new pages are section overviews and not counted in the body).

## Sources

- The reconciliation baseline is [S1], the GoF 23 catalog.
- [Wikipedia · Software design pattern](https://en.wikipedia.org/wiki/Software_design_pattern)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](/anti-patterns/overview.md)
- [strategy](/behavioral/strategy.md)
- [overview](/evolution/overview.md)
- [solid](/evolution/solid.md)
- [overview](/integration/overview.md)
- [introduction](/introduction.md)
- [knowledge](/knowledge.md)
- [repository](/other/repository.md)
- [reference](/reference.md)
- [books](books.md)
- [overview](overview.md)
