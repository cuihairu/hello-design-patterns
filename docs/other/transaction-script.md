# Transaction Script

A transaction script writes a business process as one procedural handling function: read the data, modify it step by step along the flow, write it back — every step inside one database transaction. It is the simplest of the four domain-logic styles in *Patterns of Enterprise Application Architecture* [S5]; the basis for choosing between it and the other three (Domain Model, Table Module, Active Record) is how many invariants and how many branches the flow has.

## Structure

```
Request → Controller → Transaction script function
                          ├─ Read the data (table mapping or SQL)
                          ├─ Modify the data in order, compute amounts, validate rules
                          └─ Commit once; roll back everything on failure
```

Three parts:

1. **Script function**: One entry point per business operation (place order, refund, reconcile); the function body is a sequence of linear steps.
2. **Table mapping**: The script reads and writes rows or simple objects directly, without building an object graph. See [ORM](/other/orm).
3. **Transaction boundary**: Open the transaction at the start of the function, commit at the end, roll back on exception.

## Applicable and inapplicable

**Applicable** ([S5]'s criteria, consistent with practice):

- The flow is linear and the rules travel with the flow, with no back-and-forth negotiation between objects;
- Operations map roughly one-to-one to database tables, and the read-modify-write order matches the table structure;
- Each operation stands alone and shares no complex intermediate state with the others.

**Inapplicable**:

- Rules repeat across several operations ("amount must not be negative" written once each in place order, refund, and change price) — this is the starting point of the [anemic domain model](/anti-patterns/anemic-domain-model);
- Objects collaborate (the order must notify inventory, apply the coupon, post to the ledger), the flow keeps growing, and things slide into [spaghetti code](/anti-patterns/spaghetti-code);
- You need to replay or audit the history of individual changes; transaction script only records the last state. See [Event Sourcing](/other/event-sourcing).

The dividing line: count how many scripts the same rule appears in. Once is a script; twice, be alert; three times, move it into a domain object.

## Example

Java: a refund flow, with the transaction boundary on the method and all the rules inside the function.

```java
@Service
public class RefundScript {
    private final JdbcTemplate jdbc;

    @Transactional
    public RefundResult refund(long orderId, long amount) {
        Map<String, Object> order = jdbc.queryForMap(
                "SELECT status, paid_amount FROM orders WHERE id = ?", orderId);

        if (!"PAID".equals(order.get("status"))) {
            throw new IllegalStateException("only paid orders can be refunded");
        }
        long paid = (Long) order.get("paid_amount");
        if (amount <= 0 || amount > paid) {          // Rule 1: amount boundary
            throw new IllegalArgumentException("invalid refund amount");
        }
        jdbc.update("UPDATE orders SET status = 'REFUNDED', paid_amount = paid_amount - ? WHERE id = ?",
                amount, orderId);                    // Rule 2: change status and amount together
        jdbc.update("INSERT INTO refund_events (order_id, amount) VALUES (?, ?)",
                orderId, amount);
        return new RefundResult(orderId, paid - amount);
    }
}
```

Contrast with the rich-domain-object version: the rules move into `Order.refund(amount)`, and the script shrinks to "load the object → call the method → save it back". See the refactoring example in [anemic domain model](/anti-patterns/anemic-domain-model). Both work; the difference is where the rules live and how many places share them.

## Relationship to related entries

- **The anemic domain model is its object-oriented shell**: move the script into a service and the data into an entity, and the flow is still linear — you have only added a layer of copying [S26].
- **The domain model is its replacement**: switch when the number of rules exceeds the number of flow steps; for how, see the "order you walk out" in [anemic domain model](/anti-patterns/anemic-domain-model).
- **[Command](/behavioral/command)**: once the script function is wrapped in an object, undo, replay, and audit require no change to the function body.
- **[Event Sourcing](/other/event-sourcing)**: the script commits only the final state, while event sourcing records every step of the change; the two differ in the strength of "audit".

## Cost

Do the math on the script style: a single function is worthwhile up to a few hundred lines; past that, the lookup cost of each rule grows quadratically with the number of scripts (you search N scripts for the same rule). The trigger for switching to a domain model is exactly that crossover point, not the line count.

## Related articles

- [Anemic domain model](/anti-patterns/anemic-domain-model): two ways to lay out the same flow.
- [ORM](/other/orm): the mapping layer the script uses to read and write data.
- [MVC](/other/mvc): the script is usually called by a controller, and the controller itself holds no rules.
- [Transactions and concurrency](/concurrency/read-write-lock): how the script's transaction boundary relates to row locks and optimistic locking.
- [Event Sourcing](/other/event-sourcing): the other route when you need a change history.

## Sources

- [S5] Martin Fowler, *Patterns of Enterprise Application Architecture*, 2002, the domain-logic chapter.
- [S26] martinfowler.com bliki, Anemic Domain Model.

<!-- BACKLINKS-AUTO -->
## Related pages

- [anemic-domain-model](/anti-patterns/anemic-domain-model.md)
- [god-object](/anti-patterns/god-object.md)
- [overview](/anti-patterns/overview.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [overview](overview.md)
- [repository](repository.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
- [remote-facade](/structural/remote-facade.md)
