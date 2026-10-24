# Bulkhead

A bulkhead divides the caller's resources — threads, connections, memory, queues — into several non-interfering pools by downstream or by business: when one downstream slows down it only eats up its own cell, and the other cells keep working as usual. It comes from Nygard's *Release It!* [S12], and the word comes from a ship's bulkheads: with a compartmented hull, one flooded compartment does not sink the ship. A service without bulkheads is a single-compartment design — all requests share one thread pool or connection pool, and one slow downstream can fill the whole pool, taking down features unrelated to it. For the "a slow downstream drags threads, connections, and memory along" line in the [Circuit Breaker](/evolution/circuit-breaker) piece, bulkheads are what guard the first half: divide first, then talk about breaking and [Timeout](/evolution/timeout) within a single cell.

## What to divide, and by what

Three kinds, by what carries the isolation:

- **Thread-pool isolation**: one thread pool per downstream, with an explicit occupancy cap, at the cost of thread switching and queueing latency. The traditional Java approach (Hystrix's thread-pool groups).
- **Semaphore isolation**: no thread switching, just count "requests currently in flight" and reject outright when the cap is reached. Low overhead, suitable for pure in-memory or low-latency calls. Resilience4j's `Bulkhead` defaults to a semaphore.
- **Connection-pool isolation**: databases and HTTP clients are pooled by purpose — one pool for transactional reads, one for reports; slow queries filling the report pool do not affect the transaction pool.

How to draw the cells: divide by downstream first (service A gets one cell, service B another), then by business priority (payments one cell, exports another). The criterion is the **difference in magnitude between failure and slowness**: a slow report export should not make a payment order wait in the same queue.

## When to use and when not to

Use it when: one process simultaneously calls multiple downstream services with different latency magnitudes, or one process simultaneously serves multiple business priorities.

Three cases where it does not apply:

1. Small services whose resources were never tight: extra pools only add configuration and tuning cost, with near-zero isolation benefit.
2. Many downstream services each with light traffic: building a pool per downstream yields low utilization and memory gives out first; merge into cells by "downstream category" instead.
3. Pure in-process calls: local objects do not contend for connections or threads.

## Relationship to other patterns

- With [Circuit Breaker](/evolution/circuit-breaker): the bulkhead caps the in-flight count (spatial isolation) while the breaker decides whether to send based on failure rate (temporal gating). The order is bulkhead first, breaker second — bulkhead keeps one cell's failure from spreading, and the breaker makes the failing cell stop wasting calls as soon as possible.
- With [Timeout](/evolution/timeout): the timeout shortens a slow call, and the bulkhead caps how much a slow call can occupy; together they determine how much resource one slow downstream can eat in the worst case.
- With [Retry](/evolution/retry): retry traffic counts against the cell's cap, so a bulkhead guarantees a retry storm can fill at most one cell.
- With [Semaphore](/concurrency/semaphore): the semaphore is the bulkhead's counting primitive; in the concurrency section it handles mutual exclusion and rate limiting, while the bulkhead adds "divide cells by downstream, and pair rejection with degradation" on top.
- With [Producer-Consumer](/concurrency/producer-consumer): a queue with a fixed group of consumers is the bulkhead's asynchronous form, and the queue length is the bulkhead wall.
- With [Thread Pool](/concurrency/thread-pool): the thread pool is the infrastructure of thread-pool isolation; the bulkhead decides "how many pools and how big each one is."

## Key parameters

| Parameter | Basis for the value | Consequence of a wrong value |
| --- | --- | --- |
| Per-cell concurrency cap | What the downstream can bear (normal QPS × P99 latency) | Too small and normal traffic queues; too large and isolation exists in name only |
| Queue cap / wait duration | Number of wait slots beyond the concurrency cap | Unlimited queueing is no bulkhead at all — requests slowly expire in the queue |
| Number of cells | By downstream count plus business priority, usually 2–5 | One cell per downstream shreds memory when downstream services multiply |

A cell's capacity is based on **how much the downstream can bear**, not on how many threads the caller has: if the downstream can only take 50 concurrent calls, giving it a 500-slot cell is beating the downstream to death.

## Example

Go implementation: one semaphore per cell — if you cannot take a slot, you get rejected, no queueing.

```go
package bulkhead

import "errors"

var ErrFull = errors.New("bulkhead full")

// Cell is one bulkhead compartment: at most maxInFlight calls in flight at once; reject if you cannot take one
type Cell struct {
	sem chan struct{}
}

func New(maxInFlight int) *Cell {
	return &Cell{sem: make(chan struct{}, maxInFlight)}
}

// Do takes one slot and executes fn; if it cannot take one it returns ErrFull, and the caller falls back
func (c *Cell) Do(fn func() error) error {
	select {
	case c.sem <- struct{}{}:
		defer func() { <-c.sem }()
		return fn()
	default:
		return ErrFull
	}
}
```

The caller builds cells per downstream, with capacities set to what each downstream can bear:

```go
var (
	payCell    = bulkhead.New(50) // payments: expensive, low volume
	reportCell = bulkhead.New(10) // report export: slow; even when full, payments are unaffected
)
```

On the Java side there is no need to write your own: Resilience4j's `Bulkhead` (`maxConcurrentCalls`, `maxWaitDuration`) and its thread-pool variant `ThreadPoolBulkhead` (`maxThreadPoolSize`, `queueCapacity`), Hystrix's thread-pool isolation (`execution.isolation.strategy=THREAD`, no longer maintained), and Sentinel's slot chain isolating by resource are all the same idea.

## Three small things when wiring it in

1. **Rejections need a destination**: when `ErrFull` comes out, take a fallback (default value, hand off to an async queue, or a clear error); just as with an open circuit, you owe the user an answer.
2. **Set caps by downstream capacity**: a cell's capacity is what the downstream can bear; picking it off the top of your head from the caller's thread count is the same as no isolation.
3. **Monitor per-cell occupancy**: a cell whose occupancy sits near 1 for a long time should be scaled up or tripped first — this is the first-hand data for capacity planning.

## Related readings

- [Circuit Breaker](/evolution/circuit-breaker), [Timeout](/evolution/timeout), [Retry](/evolution/retry): the three stability patterns from *Release It!*.
- [Semaphore](/concurrency/semaphore): the bulkhead's counting primitive.
- [Thread Pool](/concurrency/thread-pool): the infrastructure of thread-pool isolation.
- [Modern Evolution Overview](/evolution/overview): why this piece comes after GoF.

## Sources

- [S12] Michael T. Nygard, *Release It!*, 2nd edition, Pragmatic Bookshelf, 2018. The original source for bulkhead isolation.
- [S13] Chris Richardson, *Microservices Patterns*, 2018, the practical criterion for resource isolation between services.

<!-- BACKLINKS-AUTO -->
## Related pages

- [circuit-breaker](circuit-breaker.md)
- [overview](overview.md)
- [retry](retry.md)
- [timeout](timeout.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
