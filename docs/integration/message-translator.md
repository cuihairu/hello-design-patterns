# Message Translator

A message translator reads a message from one channel, rewrites it according to a mapping rule, and writes it into another channel: each of the two systems keeps its own message format, and the format difference is carried by a standalone translation component. It comes from *Enterprise Integration Patterns* [S10], and the problem it solves is that no two systems share the same message format — different field names, different units, different encodings, different versioning pace. Making system A accommodate system B means that fixing one side breaks an older version of the other; the translator collects "how the format changes" into one component, so neither side has to accommodate the other.

## Common forms

- **Envelope wrapper**: the outer protocol changes clothes — HTTP headers become message headers, JMS headers become Kafka headers, and the payload is untouched.
- **Content enricher**: when a message is missing fields, the translator looks them up and then forwards — an order message carries only the user ID, and the enricher adds the user's tier.
- **Content filter**: strips out fields a downstream does not need before forwarding, reducing the downstream's coupling and its exposure surface for sensitive data.
- **Canonical data model**: translating n systems pairwise takes n(n-1)/2 sets of mappings, while translating everyone into one shared intermediate format takes only 2n — the more systems, the more you save.

## When to use and when not to

Use it for: two systems whose formats can only change independently; legacy systems that cannot be touched; many interconnected systems whose formats keep evolving.

Do not use it for:

1. Formats that are already identical: a pass-through channel is enough, and a translator is pure overhead.
2. Formats that can be negotiated to one: fix the source if you can — the canonical model is a stop-loss for "when it cannot be changed," not the first choice.
3. Inside a strongly consistent transaction boundary: the translator is an asynchronous component, so do not expect it to take part in a transaction rollback.

## Relations with other patterns

- With [Adapter](/structural/adapter): the same intent in the message domain — the adapter changes an interface call, the translator changes a message body; both bridge a gap under the premise that "neither side changes."
- With [Message Channel](/integration/message-channel) and [Message Router](/integration/message-router): the translator is a processing component on a channel, often chained with the router — first route to the corresponding translation branch, then write into the output channel.
- With [Remote Proxy](/structural/remote-proxy): the remote proxy hides "the call is cross-process," while the translator admits "the two sides' formats really are different" — one conceals, the other manages it explicitly.

## Key parameters

| Parameter | Basis for the value | Consequence of getting it wrong |
| --- | --- | --- |
| Where the mapping rules live | code (MapStruct-style classes) or configuration (mapping tables) | rules scattered across business code, so a format change means searching the whole repository |
| Versioning strategy | messages carry a version number, and the translator runs both versions side by side | supporting only the newest version pins the release window to downstreams |
| Failure strategy | send to a dead letter when schema validation fails | silently dropping fields, so the downstream receives incomplete data |

## Example

Go implementation: translate an order message from v1 to v2 — field renames plus unit conversion, where a failed translation returns an error instead of silently passing through.

```go
package translator

import (
	"errors"
	"fmt"
)

// V1 old format: the amount is in cents
type OrderV1 struct {
	OrderID string
	Amount  int64
}

// V2 new format: fields renamed, and the amount is in yuan
type OrderV2 struct {
	OrderNo    string
	AmountYuan float64
	Schema     string
}

var errInvalid = errors.New("invalid message")

// V1ToV2 returns an error when mapping fails; it never silently passes through an incomplete message
func V1ToV2(v1 OrderV1) (OrderV2, error) {
	if v1.OrderID == "" {
		return OrderV2{}, fmt.Errorf("missing order_id: %w", errInvalid)
	}
	return OrderV2{
		OrderNo:    v1.OrderID,
		AmountYuan: float64(v1.Amount) / 100,
		Schema:     "order.v2",
	}, nil
}
```

On the Java side, match the tool to the scenario: field mapping with MapStruct (mapping code generated at compile time, no reflection overhead); Camel's `transform()` and `marshal().json()` embed the translation into the route; Spring Integration's `Transformer` is the standalone-component form.

## Three things to watch when adopting it

1. **Messages carry a version number, and the translator runs both versions side by side**: release windows on the two sides rarely line up, so the v1→v2 bridge has to live until the last side finishes upgrading.
2. **Schema validation as a backstop**: run schema validation before and after translation, send a failed mapping to a dead letter, and never silently drop fields.
3. **Do not change the canonical model lightly**: once n systems are wired into the shared intermediate format, one change is n translators moving together — changes go through versions, never an in-place replacement.

## Related articles

- [Message Channel](/integration/message-channel), [Message Router](/integration/message-router): the pipeline the translator sits in.
- [Adapter](/structural/adapter): the same intent in the interface domain.
- [Integration Patterns Overview](/integration/overview): the scope of this section.

## Sources

- [S10] Gregor Hohpe, Bobby Woolf, *Enterprise Integration Patterns*, Addison-Wesley, 2002. The original source of the message translator.

<!-- BACKLINKS-AUTO -->
## Related pages

- [message-channel](message-channel.md)
- [message-router](message-router.md)
- [overview](overview.md)
- [publish-subscribe](publish-subscribe.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
