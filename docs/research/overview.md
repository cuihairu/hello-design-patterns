# Research Overview

This page explains three things: which sources were surveyed, how in-site coverage was checked, and what differences were found. Detailed breakdowns are in [Books and Standards](/research/books), [Official and Community Docs](/research/official-docs), and [Applications and Language](/research/applications); item-by-item check results are in [Coverage and Differences](/research/coverage).

## Scope of the survey

Three categories of sources, each with its own use:

1. **Books and standards catalogs**. Taking GoF's 1994 book and its 23 patterns as the baseline, we took the catalogs of *Head First Design Patterns*, *Clean Architecture*, *Patterns of Enterprise Application Architecture*, *Refactoring*, *AntiPatterns*, *Pattern-Oriented Software Architecture*, *Enterprise Integration Patterns*, *Domain-Driven Design*, and *Release It!* and checked whether the site has corresponding pages.
2. **Official and community documentation**. Official docs for Java SE, C++ Core Guidelines, Go, Vue, React, .NET, and Spring are used to check API names and language-feature wording; community sites such as Refactoring.Guru, SourceMaking, and iluwatar/java-design-patterns are used to check pattern classification and aliases.
3. **Application scenarios**. We map patterns back to their concrete landing spots in specific languages and frameworks — for example Java's `java.util.concurrent`, Spring's dependency injection, the C++ standard library's smart pointers and `std::function`, Go's struct embedding and channels, and Vue/React's composition-style approach.

## Verification method

First, each authoritative source's catalog is split into entries, then each entry is matched one-to-one against files under `docs/` on the site:

- An entry that has a body page on the site is marked "covered";
- An entry that is only mentioned in the [design patterns overview](/introduction) on the site and has no body page is marked "declared but not implemented";
- An entry that is entirely absent from the site is marked "gap", and the differences table gives a disposition for it (add, merge into an existing page, or do not include for now).

In-site cross-references (intro pages, reference pages, sidebar configuration, and each catalog's overview) are checked as well; inconsistencies are listed in the third table of the differences section.

## Conclusions (in numbers)

- All 23 GoF patterns have body pages on the site, coverage 23/23 — nothing needs to be added.
- Before the survey, the site had 47 pattern body pages, plus 1 snapshot pattern page that redirects into the memento pattern, 5 catalog overview pages, and 3 home/intro/reference pages — 56 Markdown pages in total.
- The survey found 14 gaps; this round adds them all as new pages: 6 anti-patterns, 4 modern evolutions, 3 concurrency, 1 other pattern.
- 6 cross-reference inconsistencies were found and fixed in this same commit.
- After filling the gaps, in-site Markdown goes from 56 to 75 pages (59 body pages; the 14 new pages include 2 section overviews).

## Source list

In the body, numbers like `[S1]` point back to this list. There are 28 entries in total.

### Books

- [S1] Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides, *Design Patterns: Elements of Reusable Object-Oriented Software*, Addison-Wesley, 1994. The original catalog of the 23 patterns: 5 creational, 7 structural, 11 behavioral.
- [S2] Eric Freeman et al., *Head First Design Patterns* (2nd edition), O'Reilly, 2020. A case-driven introductory book covering strategy, observer, command, adapter and facade, template method, iterator and composite, state, singleton, decorator, factory method, abstract factory, and proxy; the 2nd edition adds Lambda and functional-interface idioms, and the observer chapter also discusses the open-closed principle.
- [S3] Robert C. Martin, *Clean Architecture*, Prentice Hall, 2017. The Chinese edition is titled *Clean Architecture*. Gives the five SOLID principles, the dependency rule, and component-level design principles.
- [S4] Robert C. Martin, *Agile Software Development: Principles, Patterns, and Practices*, Prentice Hall, 2002. The original source of the five SOLID principles.
- [S5] Martin Fowler, *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002. An enterprise-application catalog grouped by domain logic, data source, Web presentation, and concurrency and transactions, including transaction script, active record, data mapper, repository, unit of work, front controller, and so on.
- [S6] Martin Fowler et al., *Refactoring: Improving the Design of Existing Code* (2nd edition), Addison-Wesley, 2018. Catalog of code smells and refactoring techniques.
- [S7] William J. Brown, Raphael C. Malveau, Hays W. McCormick, Thomas J. Mowbray, *AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis*, Wiley, 1998. One of the sources for anti-pattern catalogs; covers anti-patterns at the requirements, architecture, project-management, and enterprise levels.
- [S8] Brian Foote, Joseph Yoder, *Big Ball of Mud*, Proceedings of the 4th Conference on Pattern Languages of Programs (PLoP), 1997. Describes the shape and the way out of runaway legacy systems.
- [S9] Frank Buschmann et al., *Pattern-Oriented Software Architecture* (POSA series, volume 1 on architecture and communication, volume 2 on concurrent and network objects), Wiley. An architecture-level pattern catalog including layering, pipes-and-filters, blackboard, and proxy; volume 2 includes reactor, proactor, and active object.
- [S10] Gregor Hohpe, Bobby Woolf, *Enterprise Integration Patterns*, Addison-Wesley, 2002. A catalog of integration patterns covering message channels, routing, and transformation; the site is enterpriseintegrationpatterns.com.
- [S11] Eric Evans, *Domain-Driven Design*, Addison-Wesley, 2003. Strategic and tactical vocabulary: bounded context, aggregate, repository, specification, and so on.
- [S12] Michael T. Nygard, *Release It!* (2nd edition), Pragmatic Bookshelf, 2018. Production-stability patterns including circuit breaker, bulkhead, timeout, retry, and steady state.
- [S13] Chris Richardson, *Microservices Patterns*, Manning, 2018. Patterns for microservices landing: API gateway, service discovery, Saga, event sourcing, and so on; the site is microservices-patterns.com.
- [S14] Joshua Kerievsky, *Refactoring to Patterns*, Addison-Wesley, 2004. Evolution paths from code smells to patterns.
- [S15] Bilgin Ibryam, Roland Huß, *Kubernetes Patterns*, O'Reilly, 2019. A pattern catalog for container-orchestration platforms; the site is kubernetespatterns.com.

### Official and community docs

- [S16] Refactoring.Guru (refactoring.guru): A design-pattern catalog with per-language example switching, refactoring techniques, and code-smell explanations.
- [S17] SourceMaking (sourcemaking.com): A site for design-pattern and anti-pattern entries with UML and pros/cons.
- [S18] iluwatar/java-design-patterns (github.com/iluwatar/java-design-patterns): An open-source Java implementation of patterns, roughly a hundred entries, each with an explanation plus a runnable example.
- [S19] Java SE API documentation for the `java.util.concurrent` package (docs.oracle.com): Standard-library implementations of concurrency patterns such as Executor, Future, Semaphore, ReadWriteLock, and CountDownLatch.
- [S20] C++ Core Guidelines (isocpp.github.io/cppcoreguidelines): Official recommendations on resource management and smart pointers, RAII, and interface design.
- [S21] Go official docs and blog (go.dev): Effective Go, Pipelines and cancellation, and so on, giving idiomatic usage of channels, goroutines, and interface composition.
- [S22] Vue.js official docs (vuejs.org): Motivation for the Composition API, `setup`, and logic-reuse idioms.
- [S23] React official docs (react.dev): Component composition, lifting state up, and custom Hook idioms.
- [S24] Microsoft Learn .NET design guidelines (learn.microsoft.com): Framework design guidelines and common naming and extensibility conventions.
- [S25] Wikipedia entries for Software design pattern, Software antipattern, God object, Big Ball of Mud, and so on: used to check definitions and aliases.
- [S26] martinfowler.com: eaaCatalog (enterprise application patterns catalog) and bliki (including the Anemic Domain Model entry).
- [S27] Spring official docs (docs.spring.io): The dependency-injection and application-context chapters.
- [S28] MDN Web Docs (developer.mozilla.org): Language-level JavaScript entries for Proxy, the iterator protocol, and the EventTarget event model, used to check front-end landing idioms.

### Citation conventions

- The `[S1]` references in survey pages point back to this page's list; the corresponding bibliography also has book entries in [References](/reference);
- In-site body pages carry a "Sources" subsection at the end: books are referenced with `[S#]` pointing back to this list without repeating details; online entries give directly clickable deep links;
- Publication year, edition, and chapter attribution follow the editions listed above; this list is updated whenever they change.

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [introduction](/introduction.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [books](books.md)
- [coverage](coverage.md)
