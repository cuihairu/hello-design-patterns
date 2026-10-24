# Event Sourcing

#### Overview

Event Sourcing is a software design pattern that builds the system's state by recording all state-change events instead of only the current state. This provides a much finer-grained history and replay capability, greatly strengthening the system's auditability and reliability.

#### Core concepts

1. **Event**:
   - An object describing a state change; an immutable fact about what the system did.

2. **Event Store**:
   - The storage mechanism that persists events; it can be a database or a dedicated event store system.

3. **Aggregate**:
   - Manages and encapsulates the series of events and logic related to a domain object.

4. **Command**:
   - A request that triggers a state change, usually initiated by an external system or a user.

5. **Read Model**:
   - To improve query performance, event sourcing systems often build different read models (projections), which derive the current state from the event stream.

6. **Event Processor**:
   - Handles events and updates the read models.

#### Advantages

- **Complete history**: Every state change is recorded, so it can be traced back and audited.
- **Improved extensibility**: Through the event stream, new features and services can be added easily.
- **Flexible read models**: Read models can be adjusted independently according to query needs, without affecting the write model.

#### Disadvantages

- **Complexity**: Implementing and maintaining an event sourcing system is fairly complex.
- **Storage requirements**: Over time, the event store grows quickly and needs proper storage and compression strategies.
- **Consistency challenges**: Maintaining consistency and event ordering in a distributed system is a challenge.

#### Use cases

- **Financial systems**: Require complete transaction records and auditing.
- **E-commerce platforms**: Complex state changes in orders, payments, and inventory management.
- **Task tracking systems**: Tracking the creation, update, and completion of tasks.

#### Example

##### Java example

1. **Event**

```java
public class AccountCreatedEvent {
    private final String accountId;
    private final double initialBalance;

    public AccountCreatedEvent(String accountId, double initialBalance) {
        this.accountId = accountId;
        this.initialBalance = initialBalance;
    }

    public String getAccountId() { return accountId; }
    public double getInitialBalance() { return initialBalance; }
}
```

2. **Command**

```java
public class CreateAccountCommand {
    private final String accountId;
    private final double initialBalance;

    public CreateAccountCommand(String accountId, double initialBalance) {
        this.accountId = accountId;
        this.initialBalance = initialBalance;
    }

    public String getAccountId() { return accountId; }
    public double getInitialBalance() { return initialBalance; }
}
```

3. **Aggregate**

```java
import java.util.ArrayList;
import java.util.List;

public class AccountAggregate {
    private String accountId;
    private double balance;

    public void apply(AccountCreatedEvent event) {
        this.accountId = event.getAccountId();
        this.balance = event.getInitialBalance();
    }

    public List<Object> handle(CreateAccountCommand command) {
        List<Object> events = new ArrayList<>();
        events.add(new AccountCreatedEvent(command.getAccountId(), command.getInitialBalance()));
        return events;
    }
}
```

4. **Event Store**

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EventStore {
    private final Map<String, List<Object>> store = new HashMap<>();

    public void saveEvents(String aggregateId, List<Object> events) {
        store.putIfAbsent(aggregateId, new ArrayList<>());
        store.get(aggregateId).addAll(events);
    }

    public List<Object> getEvents(String aggregateId) {
        return store.getOrDefault(aggregateId, Collections.emptyList());
    }
}
```

5. **Read Model**

```java
import java.util.HashMap;
import java.util.Map;

public class AccountReadModel {
    private final Map<String, Double> accounts = new HashMap<>();

    public void apply(AccountCreatedEvent event) {
        accounts.put(event.getAccountId(), event.getInitialBalance());
    }

    public Double getBalance(String accountId) {
        return accounts.get(accountId);
    }
}
```

6. **Event Processor**

```java
public class EventProcessor {
    private final AccountReadModel readModel = new AccountReadModel();

    public void process(List<Object> events) {
        for (Object event : events) {
            if (event instanceof AccountCreatedEvent) {
                readModel.apply((AccountCreatedEvent) event);
            }
        }
    }

    public AccountReadModel getReadModel() { return readModel; }
}
```

7. **Client demo**

```java
import java.util.List;

public class Main {
    public static void main(String[] args) {
        AccountAggregate aggregate = new AccountAggregate();
        EventStore store = new EventStore();

        // Command -> events, and persist the events
        List<Object> events = aggregate.handle(new CreateAccountCommand("acc-1", 100.0));
        store.saveEvents("acc-1", events);
        // Rebuild the aggregate from the event stream
        for (Object event : store.getEvents("acc-1")) {
            if (event instanceof AccountCreatedEvent) {
                aggregate.apply((AccountCreatedEvent) event);
            }
        }

        // Query through the read model (projection)
        EventProcessor processor = new EventProcessor();
        processor.process(store.getEvents("acc-1"));
        System.out.println("balance = " + processor.getReadModel().getBalance("acc-1"));
    }
}
```

##### Python example

1. **Event**

```python
class AccountCreatedEvent:
    def __init__(self, account_id, initial_balance):
        self.account_id = account_id
        self.initial_balance = initial_balance
```

2. **Command**

```python
class CreateAccountCommand:
    def __init__(self, account_id, initial_balance):
        self.account_id = account_id
        self.initial_balance = initial_balance
```

3. **Aggregate**

```python
class AccountAggregate:
    def __init__(self):
        self.account_id = None
        self.balance = 0

    def apply(self, event):
        if isinstance(event, AccountCreatedEvent):
            self.account_id = event.account_id
            self.balance = event.initial_balance

    def handle(self, command):
        if isinstance(command, CreateAccountCommand):
            return [AccountCreatedEvent(command.account_id, command.initial_balance)]
```

4. **Event Store**

```python
class EventStore:
    def __init__(self):
        self.store = {}

    def save_events(self, aggregate_id, events):
        if aggregate_id not in self.store:
            self.store[aggregate_id] = []
        self.store[aggregate_id].extend(events)

    def get_events(self, aggregate_id):
        return self.store.get(aggregate_id, [])
```

5. **Read Model**

```python
class AccountReadModel:
    def __init__(self):
        self.accounts = {}

    def apply(self, event):
        if isinstance(event, AccountCreatedEvent):
            self.accounts[event.account_id] = event.initial_balance

    def get_balance(self, account_id):
        return self.accounts.get(account_id)
```

6. **Event Processor**

```python
class EventProcessor:
    def __init__(self):
        self.read_model = AccountReadModel()

    def process(self, events):
        for event in events:
            self.read_model.apply(event)
```

### Summary

By recording state-change events rather than the current state, the event sourcing pattern provides a complete history and flexible read models. However, its implementation is fairly complex and requires proper storage and consistency management strategies. For systems that need detailed history and high auditability, event sourcing is a powerful design approach.

## Sources

- [Fowler · Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) (no standalone Wikipedia entry yet, [S26]).
- [S13] *Microservices Patterns*, the event-driven chapter (list in the research overview)

<!-- BACKLINKS-AUTO -->
## Related pages

- [big-ball-of-mud](/anti-patterns/big-ball-of-mud.md)
- [glossary](/glossary.md)
- [publish-subscribe](/integration/publish-subscribe.md)
- [overview](overview.md)
- [transaction-script](transaction-script.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [remote-facade](/structural/remote-facade.md)
