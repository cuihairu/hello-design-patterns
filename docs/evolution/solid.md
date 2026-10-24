# SOLID and Dependency Rules

SOLID is an acronym for five design principles for classes and components. It comes from Martin's 2002 book [S4], and *Clean Architecture* (2017) presents it together with the dependency rule and component principles [S3]. Its purpose is not to make code "more elegant" but to give a checkable judgment: when you change one requirement, how many files do you need to touch.

## The five principles and their counterparts on this site

### Single Responsibility (SRP)

A class has only one reason to change. The way to judge: list the reasons it might change in the future, and if there is more than one, it should be split.

Counterpart on this site: the [God Object](/anti-patterns/god-object) is SRP's extreme negative form, and its "group fields by invariants and move them" splitting method is exactly splitting by responsibility.

### Open/Closed (OCP)

Open for extension, closed for modification. Adding a new case should add a file, not add a branch inside an existing `switch`.

Counterpart on this site: [Strategy](/behavioral/strategy) makes "the algorithm can be swapped" into "add a class"; [Factory Method](/creational/factory-method) and [Abstract Factory](/creational/abstract-factory) move "which class gets instantiated" out of the caller; [Decorator](/structural/decorator) stacks responsibilities without changing the original class. The Observer chapter in Head First teaches exactly this one [S2].

### Liskov Substitution (LSP)

After a subclass replaces its parent, the caller should not be able to tell. Typical violations: the subclass throws an exception the parent never throws, or requires the caller to first call some subclass-specific method.

Counterpart on this site: composition in place of inheritance can bypass this constraint outright — see [Composition over Inheritance](/evolution/composition-over-inheritance); the inheritance that remains requires subclasses to implement the full semantics, and it is this convention that lets [Template Method](/behavioral/template-method)'s skeleton methods work.

### Interface Segregation (ISP)

Do not force implementers to implement methods they do not use. Split interfaces by the needs of consumers, not by listing a provider's capabilities.

Counterpart on this site: Go's "interfaces are defined by consumers" is ISP realized at the language level [S21]; [Adapter](/structural/adapter) often does exactly this — cutting a fat interface into several small ones and providing each separately.

### Dependency Inversion (DIP)

High-level modules do not depend on low-level modules; both depend on abstractions. Abstractions do not depend on details; details depend on abstractions.

Counterpart on this site: [Dependency Injection](/structural/dependency-injection) is DIP's wiring mechanism, and [Service Locator](/creational/service-locator) is another approach but hides dependencies inside the implementation (Fowler lists the latter as an anti-pattern [S26]). Read the two side by side.

## The dependency rule

*Clean Architecture* [S3] adds a direction constraint on top of the five: source-code dependencies may only point inward, and the inner layers do not know the outer layers exist.

```
Entities (enterprise rules) ← Use cases (application rules) ← Interface adapters ← Frameworks & drivers
        Inner is more stable, outer is more volatile
```

The implication is concrete: the domain layer must not import framework annotations, and must not contain words like database connections or HTTP requests. The reason [Anemic Domain Model](/anti-patterns/anemic-domain-model) refactoring moves rules back into entities is precisely so that the inner layer no longer depends on the outer layer's repositories and services.

## Three component-level principles (extension)

*Clean Architecture* also gives three at the package and component level: the equivalence of reuse and use (you cannot have a component both being used and depending on its user), stable dependencies (unstable things depend on stable ones), and no-cycle dependencies (packages must not form cycles, broken with dependency inversion). This site currently has no dedicated component-design piece; the same book's layered architecture and pipes-and-filters remain excluded under the criterion already set in the [difference table](/research/coverage) (architecture styles that constrain whole-system topology are not collected). When needed, refer to [S3] itself.

## Use it for a health check

Run these five steps over a module; the output is several actionable lists, not a score:

1. List each class's "reason to change" in the module, merge duplicates, and flag any class with more than one as an SRP issue.
2. Find every place with `switch`/`if-else` branching on type, and for each ask "how many files to change to add a new one," flagging two or more as an OCP issue.
3. Find subclasses, and check for exceptions a subclass throws or swallows that the parent never required, flagging them as LSP issues.
4. Find methods an implementer never uses, flagging them as ISP issues.
5. Find framework annotations, SQL strings, or URL literals in domain code, flagging them as DIP issues.

Once flagged, sort by "how many files change for one requirement" and start with the most painful one. This is more effective than fixing all issues at once: a one-shot fix usually has no regression protection — see step 1 of [Spaghetti Code](/anti-patterns/spaghetti-code).

## The five principles are not the goal

Principles are a way of accounting for cost. Every `interface` pays a cost of one extra indirection in reading, and every class split pays a cost of one extra hop in reading. When is it worth it: only places expected to change are worth cutting along the principles; cutting a one-off script by principle makes it harder to read. Martin's own criterion in [S3] is also to layer by stability, not to demand all code meet all five.

## Related readings

- [Composition over Inheritance](/evolution/composition-over-inheritance): the way around LSP, and also the shared foundation of the five principles.
- [Dependency Injection](/structural/dependency-injection), [Service Locator](/creational/service-locator): two ways DIP lands.
- [Strategy](/behavioral/strategy), [Factory Method](/creational/factory-method), [Decorator](/structural/decorator): three common tools for OCP.
- [Anti-Patterns Overview](/anti-patterns/overview): the negative examples for the five principles live here.

## Sources

- [S3] Robert C. Martin, *Clean Architecture*, 2017. The dependency rule and component principles.
- [S4] Robert C. Martin, *Agile Software Development: Principles, Patterns, and Practices*, 2002. The source of SOLID.
- [S2] *Head First Design Patterns*, 2nd edition, 2020, an introductory treatment of the Open/Closed principle.
- [S26] martinfowler.com bliki, the argument for the Service Locator as an anti-pattern.

<!-- BACKLINKS-AUTO -->
## Related pages

- [composition-over-inheritance](composition-over-inheritance.md)
- [overview](overview.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
