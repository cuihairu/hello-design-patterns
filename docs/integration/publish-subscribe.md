# Publish-Subscribe

Publish-subscribe completely separates "something happened" from "who cares about it": the publisher publishes one message to a topic, the message middleware delivers it to all subscribers of that topic, and neither side knows the other's list. It comes from *Enterprise Integration Patterns* [S10], and the problem it solves is that notifying one by one hard-codes the downstream list into the sender — adding a subscriber means changing the sender, releasing, and restarting; and one slow downstream can drag the whole synchronous call chain down with it.

## Relation to Observer

It is the same intent implemented in two domains as [Observer](/behavioral/observer), and the two are not aliases for each other:

- **Observer** is in-process: synchronous method callbacks, where topic and observer live and die together, and one observer throwing an exception reaches the topic.
- **Publish-subscribe** is cross-process: asynchronous messages, where subscribers are deployed independently and fail independently, delivery is carried by the middleware, and the failure model becomes "messages may be duplicated, may arrive out of order, may be delayed."

The domain difference means the two implementations cannot share one page: their failure models and lifecycles are completely different. The way to read them is Observer first, then publish-subscribe, to feel what gets swapped when the synchronous callback becomes an asynchronous message.

## Delivery semantics

- **at-most-once**: at most one delivery, possibly lost. Suited to metrics reporting that tolerates loss.
- **at-least-once**: at least one delivery, possibly duplicated. The middleware's default choice, which requires the consumer to deduplicate by message ID.
- **exactly-once**: exactly one delivery. A true exactly-once across the two steps of "consume and process" plus "persist to storage" is extremely hard to achieve; the common practice is at-least-once plus idempotent consumption to simulate it.

Each subscriber maintains its own consumption progress (offset), so one subscriber's backlog does not affect the other subscribers — this is publish-subscribe's direct answer to "one slow downstream drags the whole chain down."

## When to use and when not to

Use it for: one event with several downstreams that care and whose list keeps growing; subscribers that need independent deployment and scaling; traffic spikes that need shaving.

Do not use it for:

1. A sender that needs the result: publishing is one-way notification — use request-response when you need a result.
2. Strongly consistent writes: an event is published only after "it has already happened," so business constraints are guarded by the synchronous transaction; do not expect subscribers to compensate their way to strong consistency.
3. In-process notification: within the same process, use [Observer](/behavioral/observer) or an event bus directly — the operational cost of message middleware is not worth it.

## Relations with other patterns

- With [Observer](/behavioral/observer): the in-process isomorph; the boundary is drawn above.
- With [Message Channel](/integration/message-channel): the publish-subscribe channel is the second shape of the channel, memorized against the point-to-point channel.
- With [Producer-Consumer](/concurrency/producer-consumer): point-to-point is "one message, one consumer," while publish-subscribe is "one message, one copy each for a group of consumers" — the two semantics are often combined in the same message pipeline.
- With [Event Sourcing](/other/event-sourcing): event sourcing stores the facts that have already happened to rebuild state, while publish-subscribe distributes them — two exits for the same batch of facts.

## Key parameters

| Parameter | Basis for the value | Consequence of getting it wrong |
| --- | --- | --- |
| Delivery guarantee | at-least-once by default, with idempotency on the consumer side | designing for exactly-once means duplicate messages write dirty data |
| Consumption offset | maintained independently by each subscriber group | several businesses sharing one offset means one restart rolls everyone back |
| Message retention | set by the slowest subscriber's catch-up time | retention too short, and a slow subscriber cannot catch up and loses data outright |

## Example

Go implementation: an in-process topic broker — one queue per subscriber, publishing means copy-and-deliver, and subscribers do not affect each other.

```go
package pubsub

type Message struct {
	Topic string
	Body  string
	ID    string // idempotency key: consumers deduplicate by ID
}

type Subscriber struct {
	ch chan Message
}

func (s *Subscriber) Consume() <-chan Message { return s.ch }

type Broker struct {
	topics map[string][]*Subscriber
}

func NewBroker() *Broker {
	return &Broker{topics: map[string][]*Subscriber{}}
}

func (b *Broker) Subscribe(topic string, buffer int) *Subscriber {
	s := &Subscriber{ch: make(chan Message, buffer)}
	b.topics[topic] = append(b.topics[topic], s)
	return s
}

// Publish delivers by copy: one message is sent, one copy each, to every subscriber of the topic
func (b *Broker) Publish(msg Message) {
	for _, s := range b.topics[msg.Topic] {
		select {
		case s.ch <- msg:
		default:
			// the subscriber's queue is full: blocking or dropping depends on the business; here we choose to drop and count
		}
	}
}
```

Across processes the middleware carries the delivery: Kafka isolates consumption progress per consumer group (one position per group), RabbitMQ's fanout exchange copies the message to each queue, and Redis pub/sub is the lightweight shape that does not persist (a disconnect loses messages, so it fits only loss-tolerant scenarios).

On the Java side, keep the comparison straight: `ApplicationEventPublisher` (Spring events) is the in-process observer, not cross-process publish-subscribe; JMS `Topic` and a Kafka topic plus consumer group are the semantics of this page.

## Three things to watch when adopting it

1. **Consumer-side idempotency first**: design for at-least-once, deduplicate by message ID on persistence, and treat duplicate delivery as the norm from day one.
2. **Events carry a version and an idempotency key**: an event body travels across processes for a long time, so its evolution rules match those of [Message Translator](/integration/message-translator).
3. **Monitor subscriber backlogs independently**: plot the lag of each subscriber group separately, and the slowest group determines the message retention period.

## Related articles

- [Observer](/behavioral/observer): the in-process isomorph.
- [Message Channel](/integration/message-channel): the point-to-point and publish-subscribe shapes of the channel.
- [Event Sourcing](/other/event-sourcing): another use for the same batch of facts.
- [Integration Patterns Overview](/integration/overview): the scope of this section.

## Sources

- [S10] Gregor Hohpe, Bobby Woolf, *Enterprise Integration Patterns*, Addison-Wesley, 2002. The original source of the publish-subscribe channel.

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [message-channel](message-channel.md)
- [overview](overview.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
