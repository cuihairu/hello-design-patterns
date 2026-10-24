# Modern Evolution Overview

The GoF book was finished in 1994 [S1], solving the problem of "reusing objects within inheritance hierarchies." In the three decades since, three things changed the problem: languages stopped centering on inheritance (Go has no inheritance at all, and Java/C#'s default choice shifted from inheritance to interfaces and composition), code runs across machines and networks (failure changed from "written wrong" to "downstream unreachable"), and dependencies are wired uniformly by containers (objects no longer `new` their collaborators themselves). This directory collects seven pieces that have kept evolving after GoF and have already reached engineering consensus.

## The seven pieces in this directory

- [Composition over Inheritance](/evolution/composition-over-inheritance): how to actually implement composition first, with evidence from three directions — Go, Vue, and React. GoF themselves wrote in the book "favor object composition over class inheritance"; this piece covers how that is realized at the language level.
- [SOLID and Dependency Rules](/evolution/solid): five principles and dependency directions. Sources are Martin's 2002 and 2017 books [S3][S4]; Head First, 2nd edition, brought them into beginner material [S2].
- [Circuit Breaker](/evolution/circuit-breaker): when the failure rate of a cross-process call exceeds a threshold, short-circuit; comes from *Release It!* [S12]. GoF's Proxy and Decorator control in-process access; the breaker controls the network boundary.
- [Bulkhead](/evolution/bulkhead): resources pooled per downstream, so one slow downstream only eats up its own cell; comes from *Release It!* [S12].
- [Timeout](/evolution/timeout): every cross-process call carries a deadline, turning "slow" into "failed" first; comes from *Release It!* [S12].
- [Retry](/evolution/retry): transient faults retried with exponential backoff plus jitter, on the precondition of idempotency; comes from *Release It!* [S12].
- The [anti-pattern catalog](/anti-patterns/overview) is not in this directory, but it and this directory are each other's flip side; read them together when picking topics.

## Relationship to existing sections

| Problem | How the old sections solve it | What this directory adds |
| --- | --- | --- |
| Reuse and extension | [Inheritance](/behavioral/template-method), [Bridge](/structural/bridge), and [Decorator](/structural/decorator) can all solve it | When not to use inheritance, and how to write the equivalent with composition |
| Dependency direction | [Dependency Injection](/structural/dependency-injection) and [Service Locator](/creational/service-locator) each tell half the story | Five principles pin down "who should depend on whom" |
| Call failure | [Proxy](/structural/proxy) and [Chain of Responsibility](/behavioral/chain-of-responsibility) handle in-process failure | Network failure needs time windows, thresholds, and a half-open state; in-process patterns have none of these |

## Selection criteria

To enter this directory, three conditions must hold; missing any one goes into the difference table's "not yet included" under the [difference table](/research/coverage):

1. Has a source: from a book or official documentation, not community hearsay (corresponding to the source list [S1]–[S28]).
2. Has consensus: at least two mainstream languages or frameworks have standard implementations.
3. Complementary to GoF entries, not a rename: renames go into the alias section of the corresponding pattern page rather than getting a separate piece.

Bulkhead, timeout, and retry (all from *Release It!* [S12]) have been added under these criteria; repository and unit of work (from PoEAA [S5] and DDD [S11]) have been added under the "domain-layer interface" criterion — see [Repository and Unit of Work](/other/repository). Specifications are strategic-design vocabulary, outside the "pattern" criterion; architecture-style categories (layered, pipes-and-filters) remain excluded under the criteria already set in the [difference table](/research/coverage).

## How to read

Read [Composition over Inheritance](/evolution/composition-over-inheritance) first — it is the shared foundation of the pieces that follow; [SOLID and Dependency Rules](/evolution/solid) decides how dependencies should be laid out. The four cross-process pieces read as a chain: [Bulkhead](/evolution/bulkhead) divides the compartments first, [Timeout](/evolution/timeout) gives every call a deadline, [Retry](/evolution/retry) recovers transient faults, and [Circuit Breaker](/evolution/circuit-breaker) opens the gate when the fault persists.

## Sources

- [S12] The stability patterns in *Release It!*, the overall source for the four pieces in this section.
- [Azure · Cloud design patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/) (the cloud-side criterion, [S24])

<!-- BACKLINKS-AUTO -->
## Related pages

- [bulkhead](bulkhead.md)
- [circuit-breaker](circuit-breaker.md)
- [retry](retry.md)
- [timeout](timeout.md)
- [introduction](/introduction.md)
- [reference](/reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
