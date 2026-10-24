# Anemic Domain Model

An Anemic Domain Model means data and behavior have been separated: entity classes hold only fields and getter/setter, business rules are written in a pile of stateless services, and the business is carried out by manipulating the entities' fields. Martin named it Anemic Domain Model in a bliki entry [S26] and pointed out that it is essentially a regression to a procedural transaction script, just with a layer of object shell on the outside.

## Shape

1. **Entities are data only**: the `Order` class is full of `getTotal()`, `setStatus()`, and not a single rule.
2. **Services are all flow**: `OrderService` has dozens of methods, each written in the order "fetch object → change field → save back."
3. **Validation scattered**: the same rule, "amount cannot be negative," appears in the service, the controller, and DTO conversion — three places.
4. **Objects do not talk to each other**: objects are data bags, interaction must go through the service layer, and services call each other to form a web.

The judgment line is more practical than "has no getter": **who guarantees the business invariants**. Fields with no constraints, relying on the caller to remember to validate first — that is anemic.

## Cost

- Rules are not reusable: the same rule is written in multiple services, and missing one update produces inconsistent business results.
- Domain knowledge is not on domain objects: reading `OrderService` from top to bottom is the only way to learn the ordering rules; reading `Order` teaches you nothing.
- Tests require services and repositories: testing "can an order be refunded" requires preparing a repository first, when this rule could have been tested on a pure object.
- Complexity rooted in the same place as transaction scripts: the longer a service method, the more rollback points and log lines, and the risk of [Spaghetti Code](/anti-patterns/spaghetti-code) rises in step.

## Causes

1. **Database first**: entities are generated from table structures, and rules that do not exist in the table naturally do not live on the entity.
2. **Layering dogma**: reading "business logic goes in the service layer" as "business logic can only live in the service layer."
3. **Anemic tooling convenience**: ORMs and DTO conversions only want getter/setter, and writing rules means doing extra mapping work.
4. **Team habit**: teams that migrated from stored procedures and scripts naturally treat objects as records.

An Anemic Domain Model is not a synonym for error. Entities generated from database table structures and pure data bags for transfer never had rules to speak of; the real problem is that the location where rules appear is decoupled from objects.

## When not to change it

- The entity is a configuration table or a pure data bag for transfer, with no rules to speak of: keeping it anemic is less trouble.
- The rules themselves are "process a batch of records step by step," which is flow rather than domain: putting them in [Transaction Script](/other/transaction-script) is correct, and forcing them into objects would only tear the flow apart.
- The team and codebase are already uniformly organized as transaction scripts, and no rule duplication has appeared: switching styles costs more than it gains.

The signal to change is the second one: the same rule starts appearing in three places.

## Getting out

1. **Pick the most painful rule**: find the one duplicated most often (common ones include state transitions, amount calculation, quota checks) and list where it is currently scattered.
2. **Move it into the object**: turn this rule into an entity method or a controlled state change; fields are no longer writable from outside, and the service layer only calls methods.
3. **Retreat the service to orchestration**: the service keeps transaction boundaries, external calls, and cross-aggregate coordination, and stops touching individual objects' internal fields.
4. **Collect validation**: validate in the constructor when creating a new object, and if that cannot be done, provide factory methods. See [Factory Method](/creational/factory-method).
5. **Stop per aggregate**: there is no need to make the whole model rich; move aggregate by aggregate, and each one can be accepted once it is done.

The standard for whether you have done it well: write a test that does not connect to a database — can it exercise this business rule end to end?

## Example

Anemic: the rule lives in the service, and the entity only provides access.

```java
class Order {                       // fields only
    private String status;
    private double amount;
    public String getStatus() { return status; }
    public void setStatus(String s) { this.status = s; }
    public double getAmount() { return amount; }
    public void setAmount(double a) { this.amount = a; }
}

class OrderService {
    private final OrderRepository repo;

    public void confirm(Order order) {
        if (!"PAID".equals(order.getStatus())) {     // rule written in the service
            throw new IllegalStateException("Cannot ship unpaid orders");
        }
        if (order.getAmount() <= 0) {                // a second validation, and other places have to do it again
            throw new IllegalStateException("Invalid amount");
        }
        order.setStatus("SHIPPED");
        repo.save(order);
    }
}
```

After the change: state and rules live in the same class, fields cannot be rewritten from outside, and the service only orchestrates.

```java
class Order {
    private Status status;
    private final double amount;

    Order(double amount) {
        if (amount <= 0) { throw new IllegalArgumentException("Amount must be positive"); }
        this.amount = amount;
        this.status = Status.PAID;
    }

    void ship() {
        if (status != Status.PAID) { throw new IllegalStateException("Cannot ship unpaid orders"); }
        this.status = Status.SHIPPED;                 // the change happens only here
    }

    Status status() { return status; }
    double amount() { return amount; }
}

class OrderService {
    private final OrderRepository repo;

    public void confirm(long orderId) {
        Order order = repo.find(orderId);
        order.ship();                                 // the rule check lives inside Order
        repo.save(order);
    }
}
```

Tests can simply `new Order(100)` and then assert the behavior of `ship()`, without a repository or service.

## Related readings

- [Transaction Script](/other/transaction-script): the procedural kernel of an Anemic Domain Model; read the two side by side.
- [Factory Method](/creational/factory-method), [Builder](/creational/builder): two entry points for making "construct is validate" real.
- [God Object](/anti-patterns/god-object): the opposite pole, where all rules are stuffed into one class.
- [ORM](/other/orm): the relationship between database mapping and domain objects; anemic models are often caused by mapping-layer convenience.

## Sources

- [S26] martinfowler.com bliki: Anemic Domain Model.
- [S5] Martin Fowler, *Patterns of Enterprise Application Architecture*, 2002, the four styles of domain logic.

<!-- BACKLINKS-AUTO -->
## Related pages

- [god-object](god-object.md)
- [overview](overview.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [overview](/other/overview.md)
- [repository](/other/repository.md)
- [transaction-script](/other/transaction-script.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
- [remote-facade](/structural/remote-facade.md)
