# Message Channel

A message channel is an abstract pipe between sender and receiver: the sender writes messages into the channel, the receiver reads them from it, neither holds the other's address, and neither requires the other to be online. It comes from Hohpe and Woolf's *Enterprise Integration Patterns* [S10], and the problem it solves is that point-to-point calling binds three things together — location (you must know the other side's address), availability (if the other side is offline, the call fails), and rate (if the other side cannot keep up, the caller backs up behind it). The channel releases all three at once: the message lands in the channel first, and the receiver consumes at its own pace.

## Two kinds of channels

- **Point-to-point channel**: one message is handled by exactly one consumer — queue semantics. Suited to "someone must do this, and once is enough" — deducting stock when an order is placed, sending an e-mail.
- **Publish-subscribe channel**: one message is delivered to all subscribers; see [Publish-Subscribe](/integration/publish-subscribe). Suited to "this happened, and whoever cares subscribes" — an order was created, and points, notifications, and reports each consume it.

Channel decoupling is not free: consistency degrades from "same transaction" to "eventually consistent," and duplicate delivery and out-of-order arrival must be handled explicitly (idempotent consumption, a sequence field). Before turning a synchronous call into an asynchronous message, confirm the business tolerates the difference.

## When to use and when not to

Use it for: sender and receiver that must be deployed and scaled independently; traffic with spikes that need shaving; a single action that triggers several downstreams.

Do not use it for:

1. Callers that need the result immediately: request-response semantics over messages require a correlation ID and asynchronous waiting, far more complex than one RPC.
2. Strongly consistent writes: operations that will not tolerate an intermediate state, such as stock deduction — eventual consistency is the wrong answer.
3. In-process cooperation: within one process, pass data by reference — [Producer-Consumer](/concurrency/producer-consumer) is the in-process isomorph of the channel.

## Relations with other patterns

- With [Producer-Consumer](/concurrency/producer-consumer): two implementations of the same semantics, in-process and cross-process — the queue becomes middleware, the threads become services.
- With [Publish-Subscribe](/integration/publish-subscribe): the second shape of the channel — one message to many subscribers.
- With [Message Router](/integration/message-router) and [Message Translator](/integration/message-translator): the channel is the foundation; routing and translation are the processing components on it.

## Key parameters

| Parameter | Basis for the value | Consequence of getting it wrong |
| --- | --- | --- |
| Channel capacity / number of partitions | consumption rate × tolerable backlog duration | too small and peak shaving fails, too large and backlog stays invisible |
| Delivery guarantee | at-least-once by default, with idempotency on the consumer side | treating it as exactly-once means duplicate consumption writes dirty data |
| Dead-letter outlet | mandatory: after N failed consumptions, divert to a dead-letter channel | one poison message clogs the whole channel |

## Example

Go implementation: a buffered channel is an in-process point-to-point channel — several workers consume the same queue, and one message is handled by exactly one worker.

```go
package channel

import "fmt"

type Order struct {
	ID string
}

// Start opens a point-to-point channel: capacity is the peak-shaving level, and one message is consumed by exactly one worker
func Start(workers int) chan<- Order {
	ch := make(chan Order, 256)
	for i := 0; i < workers; i++ {
		go func() {
			for o := range ch {
				process(o) // a failed consumption must be diverted to a dead-letter channel; it cannot be dropped
			}
		}()
	}
	return ch
}

func process(o Order) {
	fmt.Println("processing", o.ID)
}
```

Across processes the channel is provided by message middleware: RabbitMQ queues, Kafka topic partitions, JMS `Queue` — the semantics are isomorphic: the sender `publish`es, the receiver `consume`s, and capacity and persistence come from middleware configuration.

On the Java side, match the framework to the job: JMS `Queue` is a point-to-point channel and `Topic` is a publish-subscribe channel; Spring Integration's `MessageChannel` splits into `DirectChannel` (synchronous dispatch within one process) and `QueueChannel` (buffered, asynchronous); Kafka topics deliver in order per partition.

## Three things to watch when adopting it

1. **Version the message**: a message body will travel across processes for a long time, so stamp a version number from day one and hand conversion to [Message Translator](/integration/message-translator).
2. **A dead-letter outlet is mandatory**: after a few failed retries on consumption, divert to a dead-letter channel with manual or scheduled jobs as backstop — otherwise one poison message clogs the whole channel.
3. **Backlog must be visible**: channel capacity and consumption lag are the first metrics to monitor; the backlog curve warns you half a day before users complain.

## Related articles

- [Publish-Subscribe](/integration/publish-subscribe): the second shape of the channel.
- [Message Router](/integration/message-router), [Message Translator](/integration/message-translator): the processing components on the channel.
- [Producer-Consumer](/concurrency/producer-consumer): the in-process isomorph.
- [Integration Patterns Overview](/integration/overview): the scope of this section.

## Sources

- [S10] Gregor Hohpe, Bobby Woolf, *Enterprise Integration Patterns*, Addison-Wesley, 2002. The original source of the message channel.

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [message-router](message-router.md)
- [message-translator](message-translator.md)
- [overview](overview.md)
- [publish-subscribe](publish-subscribe.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
