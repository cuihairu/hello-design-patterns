# Remote Facade and Data Transfer Object

Putting domain object methods directly on the network boundary means every field a client reads costs a round trip, and the server's internal structure is forced into a frozen state. The remote facade's answer is: put no objects on the boundary — put a coarse-grained interface sliced by use case, whose parameters and return values are dedicated transfer objects. Both concepts come from Fowler's *Patterns of Enterprise Application Architecture* [S5]; the former belongs to the "distributing" set, while the latter is a pure data carrier that crosses the boundary, and the two usually appear as a pair.

Site convention (this also defines the division of labor between this page and [Remote Proxy](/structural/remote-proxy), and is the premise that makes it work):

- **The remote proxy governs "transparency"**: the client thinks it is calling a local object, granularity follows the object interface, and the proxy swallows the network details.
- **The remote facade governs "the boundary"**: no transparency is sought — it openly says this is a service interface, with methods designed around business use cases (`PlaceOrder` rather than `setCustomerName`), and granularity determined by call cost.

A remote call is not a method call — a round trip has latency, can fail, and may incur a charge. Transparency across processes is a liability: it encourages fine-grained calls, which are free locally and a disaster over the network.

## Mechanism

Two layers, each owning one thing:

```
Client ──► OrderFacade.PlaceOrder(req PlaceOrderRequest)
                 │            └── DTO: carries only the fields this use case needs
                 ▼
        Repository / Payment / Inventory (domain objects never cross the boundary)
```

- **The facade sets the interface**: each method corresponds to one business use case, and one call does one thing. Transaction boundaries, authorization points, and rate-limit points all land here — they all need the semantics of "one call = one business action," which fine-grained object interfaces cannot provide.
- **The DTO sets the payload**: request and response are each a flat structure carrying only the fields this use case needs. Domain objects (aggregates, lazily-loaded associations, business methods) stay inside the server, so each side of the boundary can evolve on its own.

Three direct benefits of separating DTOs from domain objects:

1. **Version freedom**: refactoring the internal model does not change the API; adding a field to a DTO is a compatible change, whereas renaming a field on a domain object is not.
2. **Pruning is safety**: fields are supplied per use case as an allowlist, so internal identifiers and sensitive fields are not leaked along with serialization.
3. **Serialization under control**: flat structures are friendly to JSON, Protobuf, and gRPC; domain models with object graphs and circular references are not.

## When to use and when not to

Use it for:

1. Cross-process service interfaces (HTTP APIs, gRPC services) — as long as the call crosses the network, a coarse-grained facade is the default choice.
2. Systems with a complex domain model and diverse clients — web, mobile, and third-party integrations each need different fields, so DTOs are pruned per client while the domain model stays single.
3. Systems that need transactions, authorization, and rate limiting concentrated at the boundary — this cross-cutting logic must hang off the "use case" granularity, and the facade is a natural attachment point.

Three cases where it does not fit:

1. **In-process calls**: with no network cost, use the domain interface directly; adding a facade just passes one extra layer for nothing (the simplified entry point inside a process is the [Facade](/structural/facade)).
2. **Pass-through gateways**: if it only forwards requests without aggregating or pruning, that is the job of a [Remote proxy](/structural/remote-proxy) or a load balancer; writing it as a facade adds a flange to the pipe.
3. **CRUD straight-through**: for creating, deleting, and updating resources with no domain rules, the controller can operate the data source directly; wrapping it in a facade plus DTOs adds two flanges to the pipe.

## Relations with other patterns

- With [Remote proxy](/structural/remote-proxy): two orientations for the same "cross-process" scenario. The proxy keeps transparency with object-level granularity; the facade gives up transparency and follows use-case granularity. A well-designed facade service interface makes client code read like local method calls, but the signatures are business actions rather than object getters.
- With [Facade](/structural/facade): the in-process version of the same intent. Everything the remote facade adds on top — DTOs, serialization, versions, attachment points for timeouts and retries — comes entirely from the fact that "a process was crossed."
- With [Repository and Unit of Work](/other/repository): the repository returns domain objects; DTO conversion happens at the boundary (the facade or controller), so do not let DTOs come out of the repository — that would push the interface layer's pruning needs into the domain layer.
- With the [Anemic model](/anti-patterns/anemic-domain-model): DTOs are naturally anemic, and that is correct — they are data carriers, not models. The danger is using a DTO as the domain model: rules scatter across the conversion code, and a check like "amount must not be negative" gets duplicated in three places. A textbook anemic anti-pattern; see the anti-patterns section.
- With [Transaction Script](/other/transaction-script): one method of a facade often maps one-to-one to one flow of a transaction script; when things get complex enough to require aggregates and invariants, the facade routes through the domain model internally while the facade itself stays unchanged.
- With [Event Sourcing](/other/event-sourcing): events are another kind of cross-boundary payload — they record "what happened" rather than "what it looks like now," and complement DTOs rather than replace them.

## Example

Go implementation: the facade exposes use-case-level methods whose parameters and return values are DTOs, and domain objects never cross the boundary.

```go
// facade/dto.go —— boundary payload: flat, containing only the fields the use case needs
package facade

import "time"

type PlaceOrderRequest struct {
	UserID    int64
	ItemID    int64
	Quantity  int
	PaymentID string
}

type PlaceOrderResponse struct {
	OrderID   int64
	PlacedAt  time.Time
	Charged   bool
	Message   string
}
```

```go
// facade/order.go —— facade: one call per use case; cross-cutting logic hangs here
package facade

import (
	"context"
	"fmt"
)

type OrderFacade struct {
	orders    OrderRepo    // domain-layer repository, returns domain objects
	payments  PaymentClient
	inventory StockClient
}

// PlaceOrder one method = one business use case = one transaction boundary.
// The domain object Order never leaves this package; from the outside only the DTO is seen.
func (f *OrderFacade) PlaceOrder(ctx context.Context, req PlaceOrderRequest) (PlaceOrderResponse, error) {
	if err := f.payments.Charge(ctx, req.PaymentID, req.ItemID, req.Quantity); err != nil {
		return PlaceOrderResponse{}, fmt.Errorf("payment: %w", err)
	}
	order, err := f.orders.Place(ctx, req.UserID, req.ItemID, req.Quantity)
	if err != nil {
		f.payments.Refund(ctx, req.PaymentID) // compensation, still at the facade layer
		return PlaceOrderResponse{}, err
	}
	return PlaceOrderResponse{ // conversion done at the boundary, fields taken as an allowlist
		OrderID:  order.ID,
		PlacedAt: order.PlacedAt,
		Charged:  true,
		Message:  "ok",
	}, nil
}
```

The Java side does not need to be written by hand: a Spring MVC `@RestController` method signature (`@RequestBody PlaceOrderRequest` in, `Response` out) is the canonical shape of a remote facade, and the Session Facade of the EJB era is its predecessor; a gRPC/Protobuf `message` definition is a DTO — the classes `protoc` generates are naturally flat and come with version-compatibility rules.

## Three things to watch when adopting it

1. **Name methods after use cases**: when `setXxx`/`getXxx` shows up in a signature, stop and ask yourself — fine-grained style is creeping back; can this call be merged into a single business action?
2. **Define DTOs separately; never use domain objects directly**: one "to save trouble" decision welds the API signature to the internal model, after which every refactor is a breaking change.
3. **Convert only once, only at the boundary**: perform the DTO ↔ domain object conversion at a single point inside the facade or controller; if conversion logic scatters across multiple places, field pruning loses its single source of truth.

## Related articles

- [Remote Proxy Pattern](/structural/remote-proxy): the transparent orientation across processes, a foil to this page's boundary orientation.
- [Facade](/structural/facade): the in-process version — the same intent at a different scope.
- [Repository and Unit of Work](/other/repository): the layer beneath the facade's orchestration; DTOs do not come out of the repository.
- [Anemic Model](/anti-patterns/anemic-domain-model): what grows when a DTO is mistaken for a domain model.

## Sources

- [S5] Martin Fowler, *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002. The original source of the remote facade and the data transfer object.
- [S13] Chris Richardson, *Microservices Patterns*, Manning, 2018. The practical view on API contracts and DTOs at microservice boundaries.

<!-- BACKLINKS-AUTO -->
## Related pages

- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
- [overview](overview.md)
- [remote-proxy](remote-proxy.md)
