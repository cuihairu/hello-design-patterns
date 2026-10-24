# Other Patterns Overview

There are also some common patterns that are hard to classify.

These patterns are widely used in scenarios such as layered architecture, data access, and state management. Although they do not fit well into the three classic categories, they are equally important in engineering practice.

### Patterns in this directory

- [MVC](/other/mvc): Splits an application into model, view, and controller to achieve separation of concerns.
- [MVVM](/other/mvvm): Introduces a ViewModel on top of MVC, separating the view from business logic through data binding.
- [Object-Relational Mapping (ORM)](/other/orm): Maps database tables to objects so the database can be manipulated in an object-oriented way.
- [Event Sourcing](/other/event-sourcing): Records state-change events rather than final state, rebuilding state from them and supporting audit and traceability.
- [Transaction Script](/other/transaction-script): Writes a business operation as a linear processing function; the rules travel with the flow. It is the counterpart of the [anemic domain model](/anti-patterns/anemic-domain-model).
- [Repository and Unit of Work](/other/repository): A collection-like interface the domain layer uses to access aggregate roots, with the implementation in the infrastructure layer; Unit of Work bundles all changes from one business transaction into a single database transaction.

## Sources

- [S5] PoEAA *Patterns of Enterprise Application Architecture*, the enterprise application pattern catalog.
- [Fowler · eaaCatalog](https://martinfowler.com/eaaCatalog/) (the online catalog of [S5], [S26])

<!-- BACKLINKS-AUTO -->
## Related pages

- [reference](/reference.md)
- [coverage](/research/coverage.md)
