# Circuit Breaker

A circuit breaker wraps a cross-process call: it tracks the failure rate within a time window, and when that rate exceeds a threshold it returns failure directly instead of actually calling the downstream; after a cooldown it lets a probe request through, closing the circuit on success and staying open on failure. It comes from Nygard's *Release It!* [S12], and the problem it solves is "the downstream slows down," not "the downstream errors" — a slow downstream drags down threads, connections, and memory together, until the entire caller becomes unavailable too. This is called a cascading failure.

## State machine

Three states, with transitions driven by "failure count / failure rate" and "cooldown time":

```
        Failure rate >= threshold
Closed ─────────────────► Open
 ▲                        │ Cooldown elapsed, let one probe request through
 │ Probe succeeded        ▼
 └──────────────── HalfOpen
 │ Probe failed
 └──────────────────────► Open (restart the timer)
```

- **Closed**: normal traffic passes, while successes and failures are recorded in a sliding window.
- **Open**: requests fail immediately, returning a degraded value or a fast error; no connection is established.
- **HalfOpen**: only a limited number of probe requests are let through, the rest still fail fast; a successful probe goes to Closed, a failed one returns to Open.

None of the three can be missing: without "Open," a slow downstream takes the caller down with it; without "HalfOpen," recovery requires a human; without a window, a single blip can trip the breaker.

## When to use and when not to

Use it as a caller only when three conditions hold: the call is cross-process, degradation is acceptable (there is a fallback value or you can tell the user to retry later), and failures are countable.

Three cases where it does not apply:

1. The call must succeed to continue (a transfer written to the database): use [Retry](/evolution/retry) plus idempotency instead; a breaker just moves the error earlier.
2. Local function calls: there is no connection exhaustion inside a process, and [Proxy](/structural/proxy) or a conditional check is enough.
3. No degradation plan: after tripping there is nothing to do, so a breaker just throws the error somewhere else and adds little value.

## Relationship to other patterns

- In shape it is a [Proxy](/structural/proxy) or a [Decorator](/structural/decorator): the caller still holds the original interface, and the only addition is one wrapping layer.
- The fallback branch follows the same approach as [Strategy](/behavioral/strategy): the normal implementation and the fallback implementation are two interchangeable strategies.
- Window statistics and notifications can reuse [Observer](/behavioral/observer): state-change events (open, close) are exposed to monitoring.
- Difference from Bulkhead: Bulkhead pools resources per downstream and caps in-flight count, while a breaker decides whether to send based on failure rate. In production the two are often used together — see [Bulkhead](/evolution/bulkhead) [S12].

## Key parameters

| Parameter | Basis for the value | Consequence of a wrong value |
| --- | --- | --- |
| Window size | At least 3–5 normal RTT periods; a second-scale window suits high-volume interfaces | Too small and one network blip trips it; too large and recovery is slow |
| Failure-rate threshold | Commonly 50%, and it requires a minimum sample count in the window (e.g. 20) | Looking only at proportion without sample count: 1 failure and 1 success is already 50% |
| Cooldown | Start at second scale and step up by gradient; the upper limit is usually tens of seconds | Fixed and too long, and the downstream still gets no traffic after it recovers |
| Half-open concurrency | 1–5 | Too high, and you push all traffic back before the downstream has recovered |

The minimum-sample-count item is the easiest to miss: a breaker without a minimum sample count gets flipped by a single failure during low-traffic periods.

## Example

Go implementation: a mutex guards the state and window, and HalfOpen lets through a single probe.

```go
package breaker

import (
	"errors"
	"sync"
	"time"
)

var ErrOpen = errors.New("circuit open")

type State int

const (
	Closed State = iota
	Open
	HalfOpen
)

type Breaker struct {
	mu          sync.Mutex
	state       State
	window      []bool // true = success
	limit       int    // minimum sample count in the window
	rate        float64
	cooldown    time.Duration
	openedAt    time.Time
	halfInFlight bool
}

func New(limit int, rate float64, cooldown time.Duration) *Breaker {
	return &Breaker{state: Closed, limit: limit, rate: rate, cooldown: cooldown}
}

// Do executes fn in the Closed and HalfOpen states; in the Open state it returns ErrOpen directly
func (b *Breaker) Do(fn func() error) error {
	b.mu.Lock()
	switch b.state {
	case Open:
		if time.Since(b.openedAt) > b.cooldown {
			b.state = HalfOpen
		} else {
			b.mu.Unlock()
			return ErrOpen
		}
	case HalfOpen:
		if b.halfInFlight {
			b.mu.Unlock()
			return ErrOpen
		}
		b.halfInFlight = true
	}
	b.mu.Unlock()

	err := fn()

	b.mu.Lock()
	defer b.mu.Unlock()
	b.halfInFlight = false
	b.record(err == nil)
	return err
}

func (b *Breaker) record(ok bool) {
	switch b.state {
	case HalfOpen:
		if ok {
			b.state, b.window = Closed, nil // probe succeeded: close the circuit and clear the old window
		} else {
			b.trip()
		}
	case Closed:
		b.window = append(b.window, ok)
		if len(b.window) < b.limit {
			return
		}
		fails := 0
		for _, s := range b.window {
			if !s {
				fails++
			}
		}
		if float64(fails)/float64(len(b.window)) >= b.rate {
			b.trip()
		} else {
			b.window = b.window[:0] // not triggered: roll the window
		}
	}
}

func (b *Breaker) trip() {
	b.state, b.openedAt = Open, time.Now()
}
```

On the Java side there is no need to write your own: Resilience4j's `CircuitBreaker`, Hystrix's circuit breaker, and Sentinel's circuit-breaking degradation are all the same state machine, with mostly corresponding parameter names (`slidingWindowSize`, `failureRateThreshold`, `waitDurationInOpenState`, `permittedNumberOfCallsInHalfOpenState`).

## Three small things when wiring it in

1. **Distinguish failure types**: timeouts, connection refused, and 5xx count as failures; business validation failures (4xx) usually do not, otherwise a caller sending bad parameters will break the downstream's circuit.
2. **Degradation needs a value**: callers of `Do` must handle `ErrOpen` — return a cache, return an empty collection, or return "try again later" — but do not pass the error straight to the user.
3. **Emit metrics**: feed state-transition events into monitoring; how long the Open state lasts and how often it trips are the two numbers that decide whether the threshold needs tuning.

## Related readings

- [Proxy](/structural/proxy), [Decorator](/structural/decorator): how a circuit breaker attaches.
- [Bulkhead](/evolution/bulkhead), [Timeout](/evolution/timeout), [Retry](/evolution/retry): the three stability patterns from *Release It!*.
- [Strategy](/behavioral/strategy): switching between the normal and degraded implementations.
- [Observer](/behavioral/observer): dispatching state-transition events.
- [Modern Evolution Overview](/evolution/overview): why this piece comes after GoF.

## Sources

- [S12] Michael T. Nygard, *Release It!*, 2nd edition, Pragmatic Bookshelf, 2018. The original source for breaker, bulkhead, and timeout.
- [S13] Chris Richardson, *Microservices Patterns*, 2018, failure handling for inter-service calls.

<!-- BACKLINKS-AUTO -->
## Related pages

- [bulkhead](bulkhead.md)
- [overview](overview.md)
- [retry](retry.md)
- [timeout](timeout.md)
- [glossary](/glossary.md)
- [overview](/integration/overview.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
- [remote-proxy](/structural/remote-proxy.md)
