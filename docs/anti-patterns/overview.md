# Anti-Patterns Overview

An anti-pattern is a way of writing and organizing code that "recurs, looks like it solves a problem, and actually makes the problem worse." It is the dark side of the same vocabulary as a pattern: patterns record solutions proven to work, anti-patterns record approaches proven to be harmful. Both require "recurrence" — code written wrong once is just a bug.

## Three layers

Code quality problems are usually handled in three layers, which live in different places on this site:

| Layer | Character | Example | How to handle |
| --- | --- | --- | --- |
| Code smell | Local, mechanically refactable | Long functions, large classes, duplicated code | Fix in place with the techniques in *Refactoring* [S6] |
| Anti-pattern | Structural, needs a change of thinking first | God object, big ball of mud, golden hammer | Identify the shape first, then migrate step by step |
| Failure mode | Reaches into the project and its decisions | Repeatedly flip-flopping on technology choices, rewriting as you go | Handled by process and review, not just code |

*Refactoring* covers the first layer; the book *AntiPatterns* [S7] covers the second and third; the *Big Ball of Mud* paper [S8] gives the full evolutionary path of "how a system rots to this degree." The criterion separating the three layers is scope of effect: what one refactoring can fix is a code smell; what requires redrawing boundaries and responsibilities is an anti-pattern.

## The four pieces in this directory + related readings

- [God Object](/anti-patterns/god-object): one class holds global state, and anyone changing anything must go through it.
- [Big Ball of Mud](/anti-patterns/big-ball-of-mud): the system has no main architecture and keeps running on patches and band-aids.
- [Golden Hammer](/anti-patterns/golden-hammer): there is only one tool in hand, and every problem is forced onto it.
- [Spaghetti Code](/anti-patterns/spaghetti-code): control flow is built from jumps and shared variables; fix one place, break three.
- [Anemic Domain Model](/anti-patterns/anemic-domain-model): objects have only fields and getters; business logic is scattered across services. Read alongside [Transaction Script](/other/transaction-script).

These four plus the anemic domain model are gaps filled by this round of research; see the [coverage check](/research/coverage) for the difference table.

## The three-part structure of an anti-pattern

Every anti-pattern on this site is written in the same order, to make cross-comparison easy:

1. **Shape**: what should make you suspicious — give countable features (how many fields, how many imports, how wide the fan-out).
2. **Cost**: what it concretely damages, written as verifiable descriptions (changing one field drags seven classes along, unit tests have to mock out half the system).
3. **Causes**: how the system slid into it step by step, avoiding putting a label only on the result.
4. **Getting out**: give a technique where it can be done in one step, give a migration order where it can only be done incrementally, and mark which step you can stop after.

## Relationship to patterns

An anti-pattern is not the opposite of a pattern; the two are often two sides of the same thing:

- Using Singleton on a resource that "is genuinely globally unique" is the [Singleton](/creational/singleton); using it to avoid passing dependencies slides into the [God Object](/anti-patterns/god-object).
- [Service Locator](/creational/service-locator) and [Dependency Injection](/structural/dependency-injection) solve the same lookup problem; the former is listed by Fowler as the Service Locator anti-pattern [S26], on the grounds that it hides dependencies inside the implementation so they are invisible during unit testing.
- Patterns like [Strategy](/behavioral/strategy) and [State](/behavioral/state) — "pulling branches out" — are exactly the first step out of spaghetti code.

The line of judgment is whether "who depends on whom" is written down clearly: a dependency visible to the type system or a constructor is a pattern; a dependency that can only be guessed by reading global variables is an anti-pattern.

## How to use this directory

1. First check against the Shape section to confirm you really hit it; do not judge a "somewhat large class" straight as a God Object.
2. Read the Cost section to judge whether it hurts right now. A non-painful anti-pattern can be noted and left alone for now.
3. The Getting-out section gives a migration order, not a rewrite plan; each piece marks which step you can stop at.
4. To see how these anti-patterns were systematically cataloged, see the AntiPatterns section of [authoritative books and standard catalogs](/research/books) [S7].

## Sources

- [S6] Martin Fowler et al., *Refactoring*, 2nd edition, 2018. Code smell catalog.
- [S7] Brown et al., *AntiPatterns*, Wiley, 1998. Anti-pattern catalog.
- [S8] Foote, Yoder, *Big Ball of Mud*, PLoP 1997.
- [S25] Wikipedia's Software antipattern and God object entries, used to cross-check aliases.
- [S26] martinfowler.com bliki and the Enterprise Application Patterns catalog.

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](/evolution/overview.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [introduction](/introduction.md)
- [reference](/reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
