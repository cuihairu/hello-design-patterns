# Behavioral Patterns Overview

**The main problem they solve**: how objects collaborate and how responsibilities are divided among them. These patterns concern algorithms, responsibility assignment, and communication between objects.
Behavioral patterns focus on responsibility assignment and communication between objects. Common techniques include wrapping algorithms in interchangeable objects, wrapping requests in objects, and introducing mediating or observer relationships between objects, thereby reducing coupling between objects.

### Patterns in this directory

- [Strategy](/behavioral/strategy): Defines a family of interchangeable algorithms so that variations in an algorithm are independent of the clients that use it.
- [Observer](/behavioral/observer): Establishes a one-to-many dependency relationship so that when one object changes state, all of its dependents are notified and updated automatically.
- [Command](/behavioral/command): Encapsulates a request as an object, supporting parameterization, queuing, logging, and undo.
- [Chain of Responsibility](/behavioral/chain-of-responsibility): Lets several objects each have a chance to handle the request, passing it down the chain until one handles it.
- [Mediator](/behavioral/mediator): Uses a mediator object to encapsulate the interactions among a group of objects, avoiding direct references between them.
- [Iterator](/behavioral/iterator): Accesses the elements of an aggregate object sequentially without exposing its underlying representation.
- [Template Method](/behavioral/template-method): Defines the skeleton of an algorithm, deferring some steps to subclasses.
- [State](/behavioral/state): An object can alter its behavior when its internal state changes.
- [Memento](/behavioral/memento): Captures and restores an object's internal state without breaking encapsulation.
- [Snapshot](/behavioral/snapshot): Another common name for the Memento pattern, with an emphasis on creating and restoring snapshots.
- [Interpreter](/behavioral/interpreter): For a language, defines a representation of its grammar along with an interpreter that interprets sentences in that language.
- [Visitor](/behavioral/visitor): Represents an operation to be performed on the elements of an object structure, allowing new operations to be defined without changing the classes of the elements.
- [Callback](/behavioral/callback): Passes the handling logic in as a callback, which is invoked when an asynchronous operation completes or an event occurs.
- [Domain-Specific Language (DSL)](/behavioral/dsl): Designs a purpose-built language or language extension for a specific domain, improving expressive efficiency.

### Selection guidance

- Use Strategy when an algorithm needs to be swappable; use State when behavior varies with state.
- Use Observer for one-to-many state notifications; use Chain of Responsibility when the handler of a request is uncertain.
- Use Command for requests that need undo, queuing, or logging; use Memento when you need to save historical states.
- Use Iterator to separate traversal logic from the container implementation; use Visitor for frequent additions of operations over a stable structure.

## Sources

- [S1] The GoF catalog lists behavioral patterns as the third group (11 patterns); this section follows that and additionally includes pages for callback, DSL, and snapshot.
- [Refactoring.Guru · Behavioral patterns](https://refactoring.guru/design-patterns/behavioral-patterns)
- [Wikipedia · Software design pattern](https://en.wikipedia.org/wiki/Software_design_pattern)

<!-- BACKLINKS-AUTO -->
## Related pages

- [reference](/reference.md)
