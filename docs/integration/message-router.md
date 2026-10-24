# Message Router

A message router reads an incoming message and, by rule, picks one output channel to write it to: one channel in, several channels out, and the judgement "who should this message go to" is separated into a component of its own. It comes from *Enterprise Integration Patterns* [S10], and the problem it solves is that sender and receiver hard-code the dispatch logic into business code — adding one more downstream means changing the sender, and adjusting one rule means redeploying the whole service. The router turns the rule into a component that can be modified on its own: the sender only has to drop the message into the router, and adding or removing downstreams is invisible to it.

## Common forms

- **Content-based router**: picks the channel by message content — order messages are split by type into a domestic warehouse and an overseas one.
- **Message filter**: messages that do not match the rule are dropped outright, so each downstream receives only the subset it cares about.
- **Recipient list**: broadcasts to a fixed set of channels named in configuration; the list is edited in configuration.
- **Splitter / aggregator**: one large message is split into several for parallel processing, and the results are aggregated back, paired by correlation ID.

## When to use and when not to

Use it for: dispatch rules that change frequently or must be configured dynamically; several downstreams each taking what they need by message characteristics; a sender that should not know the downstream list.

Do not use it for:

1. A single, stable dispatch rule: one if statement is enough, and a separate router component is over-engineering.
2. All downstreams must negotiate a result: that is orchestration's job — the router does only one-way dispatch and does no callback aggregation.
3. Dispatch by type inside a process: polymorphism and method dispatch are routing built into the language; do not route around the language's mechanism with a configuration table.

## Relations with other patterns

- With [Chain of Responsibility](/behavioral/chain-of-responsibility): the chain tries handlers one by one in order and the message may be consumed by an intermediate link; the router targets once by rule and forwards the message unchanged.
- With [Strategy](/behavioral/strategy): the routing rule itself is a replaceable strategy, and the rule table is the configured form of a strategy.
- With [Message Channel](/integration/message-channel): the router stands between several channels and is the orchestrator of channels.
- With [Observer](/behavioral/observer): the in-process counterpart of the recipient-list form is event broadcasting, but the router forwards selectively by rule while the observer notifies everyone.

## Key parameters

| Parameter | Basis for the value | Consequence of getting it wrong |
| --- | --- | --- |
| Where the rules live | fixed in code at compile time vs. editable at runtime in configuration | rules move to configuration but support no rollback, so a wrong change has nowhere to go |
| Default channel | mandatory: where a message matching no rule goes | with no default channel, unmatched messages vanish silently |
| Match priority | which rule wins when rules overlap | once rules multiply, ordering becomes tacit knowledge and whether something hits is a guess |

## Example

Go implementation: route by order type, with the rule table declared explicitly and a default channel.

```go
package router

import "errors"

var ErrNoRoute = errors.New("no route")

type Order struct {
	ID      string
	Channel string // domestic / overseas
}

type Router struct {
	routes    map[string]chan<- Order
	defaultCh chan<- Order
}

func New(defaultCh chan<- Order) *Router {
	return &Router{routes: map[string]chan<- Order{}, defaultCh: defaultCh}
}

func (r *Router) Register(orderType string, ch chan<- Order) {
	r.routes[orderType] = ch
}

// Route picks the channel by content; a miss falls through to the default channel, and ErrNoRoute is returned if there is no default
func (r *Router) Route(o Order) error {
	if ch, ok := r.routes[o.Channel]; ok {
		ch <- o
		return nil
	}
	if r.defaultCh == nil {
		return ErrNoRoute
	}
	r.defaultCh <- o
	return nil
}
```

On the Java side there is no need to write this yourself: Apache Camel's `choice().when(...).to(...).otherwise(...)`, Spring Integration's `@Router`-annotated method, and Kafka Streams' `branch()` are all standard landings for content-based routing; the externalized routing table of gateway products is the same model.

## Three things to watch when adopting it

1. **Keep the default channel and the dead-letter channel separate**: the default channel takes normal messages that "no rule covers," and the dead-letter channel takes abnormal messages where "a downstream failed to process" — mixing the two hides gaps in the rules.
2. **Rule changes must be rollback-capable**: once the rule table moves into configuration it needs a version, so a wrong change can be reverted in one step — routing is on the path of every message, so a routing error is a total outage.
3. **Emit hit counts per rule**: the hit volume of each rule and the share of traffic going to the default channel are first-hand data for rule maintenance.

## Related articles

- [Message Channel](/integration/message-channel), [Message Translator](/integration/message-translator): the router's input and output and its partner components.
- [Chain of Responsibility](/behavioral/chain-of-responsibility): trying one by one versus targeting by rule.
- [Strategy](/behavioral/strategy): the routing rule as a replaceable strategy.
- [Integration Patterns Overview](/integration/overview): the scope of this section.

## Sources

- [S10] Gregor Hohpe, Bobby Woolf, *Enterprise Integration Patterns*, Addison-Wesley, 2002. The original source of the message router.

<!-- BACKLINKS-AUTO -->
## Related pages

- [message-channel](message-channel.md)
- [message-translator](message-translator.md)
- [overview](overview.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
