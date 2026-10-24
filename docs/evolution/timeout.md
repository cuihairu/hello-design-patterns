# Timeout

A timeout sets a time limit for every cross-process call; when the limit is reached the call is abandoned, falling back or returning an explicit error instead of letting the caller wait forever. It comes from Nygard's *Release It!* [S12], and the problem it solves is not "the downstream errors" but "the downstream does not respond": a call without a timeout that meets a hung downstream (infinite loop, long GC, TCP retransmission after network loss) holds the caller's thread or coroutine forever, resources get eaten cell by cell, and eventually the whole service is unavailable. Nygard's words are that every cross-process call needs a timeout, no exceptions — the [Circuit Breaker](/evolution/circuit-breaker) tracks failure rate, and the timeout is responsible for turning "slow" into "failed" first; without timeouts, failure-rate statistics are incomplete, since hung calls never get counted at all.

## Two kinds of timeout and the total budget

A cross-process call needs at least two independent limits:

- **Connection timeout**: the wait limit for establishing a TCP connection. When the target is unreachable the OS default is to wait a long time; this value is usually a few hundred milliseconds to a second.
- **Read timeout (response timeout)**: how long to wait for a response after the connection is established, set at 1.5–2× the downstream's normal P99 latency, not a "feels about right" number.

Multi-layer calls also need a **total budget**: a single user request chains together gateway, service A, and database, and the per-segment timeouts cannot be simply added — each segment's timeout must be less than the remaining budget passed down from upstream. gRPC deadline propagation is designed exactly for this: upstream passes its remaining time along with the request, and downstream takes min(local config, upstream remaining) as its own limit.

## When to use and when not to

Use it for all cross-process calls: HTTP, RPC, databases, caches, message queues. The criterion has only one condition — if the call occupies an off-process resource (a connection, memory, a thread wait slot), it needs a limit.

The only case where it does not apply is in-process calls: local functions do not hold connections, and the complexity of adding a timeout is not worth it. Two common misuses to avoid:

1. **Treating a timeout as a replacement for retry**: a timeout only stops the loss; recovery is the job of [Retry](/evolution/retry). The two are a partnership.
2. **Setting the timeout shorter than the downstream P99**: normal slow requests get killed while the downstream's side effect has already happened — the caller treats it as a failure, the downstream actually succeeded, and data is inconsistent from that point on.

## Relationship to other patterns

- With [Circuit Breaker](/evolution/circuit-breaker): the timeout turns slow calls into failures, and the breaker counts those failures to decide whether to trip. The order is fixed: only with timeouts first does the breaker's window have complete failure samples.
- With [Retry](/evolution/retry): single timeout × (retry count + 1) is the total duration cap, and it must stay within the caller's own budget; for write operations, confirm the side effect did not happen before retrying after a timeout.
- With [Bulkhead](/evolution/bulkhead): the timeout governs the duration of a single call, the bulkhead governs the number of in-flight calls, and together they determine how much resource one slow downstream can eat in the worst case.
- The fallback after a timeout follows the same approach as [Strategy](/behavioral/strategy): the normal implementation and the fallback implementation are two interchangeable strategies.

## Key parameters

| Parameter | Basis for the value | Consequence of a wrong value |
| --- | --- | --- |
| Connection timeout | A few hundred milliseconds to 1 second, widened slightly across the public internet | Too short and it kills normal connections; too long and it occupies resources against unreachable addresses |
| Read timeout | 1.5–2× the downstream P99 | Shorter than P99 and the side effect already happened but is treated as a failure; too long and thread occupancy grows with it |
| Total budget | The product's response-time requirement | If the segments' timeouts sum to more than the total budget, the user already timed out while the downstream "succeeded" all along |

## Example

Go implementation: the connection timeout lives in the Transport's dialer, the read timeout is controlled with `context.WithTimeout`, and the upstream deadline is inherited — when upstream's budget is tighter, take the smaller value.

```go
package client

import (
	"context"
	"net"
	"net/http"
	"time"
)

var httpClient = &http.Client{
	// connection timeout belongs to the Transport: dial cap 500ms
	Transport: &http.Transport{
		DialContext: (&net.Dialer{Timeout: 500 * time.Millisecond}).DialContext,
	},
}

// Query requests url; the read timeout is set to twice the downstream P99 and inherits upstream's deadline
func Query(ctx context.Context, url string) (*http.Response, error) {
	local := 2 * time.Second
	if deadline, ok := ctx.Deadline(); ok {
		if d := time.Until(deadline); d < local {
			local = d // take the smaller value when upstream's budget is tighter
		}
	}
	ctx, cancel := context.WithTimeout(ctx, local)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	return httpClient.Do(req)
}
```

On the Java side there is no need to write your own: Resilience4j's `TimeLimiter` (`timeoutDuration`), gRPC's `Context.withDeadlineAfter`, and `java.net.http.HttpRequest`'s `timeout` are all the same model; Spring's transaction timeout (`@Transactional(timeout=…)`) governs the database segment.

## Three small things when wiring it in

1. **Timeouts need a destination**: decide in advance what to return when the limit is reached (a cached value, a default, or an explicit error); do not decide in the moment.
2. **Outer layers on the chain get the bigger budget**: a downstream's configured timeout must be less than upstream's remaining budget, otherwise upstream gives up while downstream is still working, and downstream's work is wasted.
3. **A timeout is not a failure**: a write operation's side effect may already have happened after a timeout, and retrying directly can double-charge — confirm the result first (an idempotency key or a query) before deciding the next step.

## Related readings

- [Circuit Breaker](/evolution/circuit-breaker), [Bulkhead](/evolution/bulkhead), [Retry](/evolution/retry): the three stability patterns from *Release It!*.
- [Strategy](/behavioral/strategy): switching to a fallback implementation after a timeout.
- [Modern Evolution Overview](/evolution/overview): why this piece comes after GoF.

## Sources

- [S12] Michael T. Nygard, *Release It!*, 2nd edition, Pragmatic Bookshelf, 2018. The original source for timeouts.
- [S13] Chris Richardson, *Microservices Patterns*, 2018, the practical criterion for timeouts and deadline propagation.

<!-- BACKLINKS-AUTO -->
## Related pages

- [bulkhead](bulkhead.md)
- [circuit-breaker](circuit-breaker.md)
- [overview](overview.md)
- [retry](retry.md)
- [glossary](/glossary.md)
- [overview](/integration/overview.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
- [remote-proxy](/structural/remote-proxy.md)
