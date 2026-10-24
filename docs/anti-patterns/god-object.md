# God Object

A God Object is a single class that has taken on too much of the system's state and decisions: it knows what it should do, and also what everyone else should do, and every object holds a reference to it. Also called God Class or Central Object [S25].

## Shape

If three of the following four are true, start suspecting:

1. The number of fields in a single class clearly exceeds the domain it is responsible for. A rule of thumb is 20 or more instance fields, or a class that fills three or four screens and is still not finished.
2. Most objects in the system can reach it through some field, and the reverse holds too: changing it requires notifying a whole chain of objects.
3. Its methods are grouped by "who they serve" — one group for the UI, one for the database, one for logging — all sharing the same set of fields.
4. To unit-test it you must first construct half the system. The mocked-out dependencies outnumber the logic under test; a passing test does not mean the logic is correct.

## Cost

- Large change fan-out: adding one field requires re-checking consistency across every branch that reads or writes it, and the regression surface scales with the number of references to the class.
- Lock granularity is bound to it: once fields pile up enough you can only lock the whole object, serializing calls that could otherwise run in parallel.
- High testing cost: one setup requires stand-ins for the network, the clock, and configuration; the test code ends up longer than the business code.
- Merge conflicts concentrate: when several people edit the same class, it is always the file that conflicts.

## Causes

Most God Objects are not written in one go. Three common paths:

1. **"Put it here for now, split it up later"**: temporary state has nowhere to belong, so it gets parked in whichever class looks most fitting.
2. **Transaction script takeover**: business flows grow longer and longer, and every intermediate value hangs off the flow's owner. See [Transaction Script](/other/transaction-script).
3. **God's-eye-view domain class**: interpreting "the domain model must carry the business" as "one model carries all the business." This is the opposite pole from the [Anemic Domain Model](/anti-patterns/anemic-domain-model).

## Getting out

Split in this order; after each step you can commit once, no need to wait until everything is split:

1. **Stop new additions**: no new fields may enter this class anymore; where they go is decided in the next step.
2. **Group by invariants**: split fields into groups that "must change together to hold," keeping only those with invariants within a group together.
3. **Move out the groups that do not look at it**: take the set of methods that is only called externally and reads no other fields, move it as a whole into a new class, and have the original class hold a reference and forward. This step is the lowest risk; do it first.
4. **Invert the dependency**: let the remaining core state stay with it, and change objects that need it to obtain it through an interface, rather than holding a reference everywhere.
5. **Break the reference**: once only two or three external callers remain, change the shared reference to parameter passing or event notification.

You can stop once a unit test only needs the object itself plus one stand-in; there is no need to force every method to be moved out.

## Example

Anti-pattern: one `OrderSystem` class manages orders, inventory, messaging, and metrics at the same time.

```java
class OrderSystem {
    private final Map<String, Integer> inventory = new HashMap<>();
    private final List<String> auditLog = new ArrayList<>();
    private int todayOrders;
    private String notificationChannel;

    // Orders, inventory, notifications, and metrics — four things all crammed into this one class
    public void placeOrder(String sku, int qty) {
        int left = inventory.getOrDefault(sku, 0) - qty;
        if (left < 0) { throw new IllegalStateException("Insufficient stock"); }
        inventory.put(sku, left);
        auditLog.add("order:" + sku + ":" + qty);
        todayOrders++;
        notifyUser("Order placed for " + sku);  // and here it calls its own notification method again
    }

    private void notifyUser(String msg) {
        auditLog.add("notify:" + notificationChannel + ":" + msg);
    }

    public int getTodayOrders() { return todayOrders; }
}
```

The shape after splitting: the inventory invariant belongs to `Inventory`, notifications to `Notifier`, and the order flow only orchestrates.

```java
class OrderService {
    private final Inventory inventory;
    private final Notifier notifier;
    private final OrderMetrics metrics;

    OrderService(Inventory inventory, Notifier notifier, OrderMetrics metrics) {
        this.inventory = inventory;
        this.notifier = notifier;
        this.metrics = metrics;
    }

    public void placeOrder(String sku, int qty) {
        inventory.reserve(sku, qty);   // throws if inventory is insufficient; the invariant lives inside Inventory
        metrics.recordOrder();
        notifier.orderPlaced(sku, qty);
    }
}
```

All three dependencies can be constructed independently, and `OrderService`'s unit tests no longer touch the database or the message channel.

## Related readings

- [Facade](/structural/facade): the Facade also centralizes the entry point, but it only forwards calls and holds no state — that is the dividing line from a God Object.
- [Mediator](/behavioral/mediator): collects the mutual references between objects into a mediator; the mediator can manage messages only and not the data.
- [Transaction Script](/other/transaction-script), [Anemic Domain Model](/anti-patterns/anemic-domain-model): two sides of the same family of problems.
- [Big Ball of Mud](/anti-patterns/big-ball-of-mud): loss of control at the single-class level and loss of control at the system level.

## Sources

- [S6] *Refactoring*, 2nd edition, the "Large Class" and "Long Parameter List" code smells.
- [S25] Wikipedia's God object entry, for aliases and shape description.

<!-- BACKLINKS-AUTO -->
## Related pages

- [anemic-domain-model](anemic-domain-model.md)
- [big-ball-of-mud](big-ball-of-mud.md)
- [overview](overview.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
