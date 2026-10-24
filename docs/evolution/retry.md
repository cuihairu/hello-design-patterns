# Retry

Retry tries a failed operation a few more times at backoff intervals: if it succeeds before the attempts are exhausted it recovers, and if they are exhausted it reports an error. It comes from Nygard's *Release It!* [S12], and the problem it solves is **transient faults**: network blips, downstream restarts, lock conflicts, rate-limit rejections — a failure appearing once does not mean it persists, and throwing the error straight at the user or upstream is throwing away an opportunity to recover automatically. But retry has strict preconditions — the failure must be a transient one where "trying again might succeed," and the operation must be idempotent; a retry that does not meet these two is not a recovery mechanism, it is a fault amplifier.

## Three preconditions

1. **Retry only transient faults**: connection refused, timeout, 503, and rate-limit 429 are retryable; business failures such as bad parameters or insufficient balance fail the ten-thousandth retry just the same, and 4xx never enters retry.
2. **The operation must be idempotent**: retrying a charge once means two charges. A non-idempotent write needs an idempotency key first (the request carries a unique ID, and the downstream dedupes by ID) or must become "check the result first, then decide" before retry is even on the table.
3. **Retry must be bounded**: the attempt cap is usually 2–3, and the total duration must not exceed the caller's own [Timeout](/evolution/timeout) budget.

## Backoff and jitter

Fixed-interval retries form a synchronous pulse at the moment of recovery: all retryers fire their requests together on the same beat, and a just-recovered downstream gets hit again immediately. The standard approach is **exponential backoff plus jitter**:

- intervals grow exponentially per round: `base × 2^n`, with base commonly 100–500ms;
- each retry adds random jitter on top of the computed interval, staggering the retryers (the AWS SDK calls this full jitter: pick a random value between `0` and the current round's interval);
- attempt cap 2–3, total duration held in the second scale.

Backoff solves "how long until the next try," jitter solves "everyone tries at once," and neither can be missing.

## Relationship to other patterns

- With [Timeout](/evolution/timeout): single timeout × (retry count + 1) is the total duration cap, and it must be less than the caller's own budget; for write operations, confirm the side effect did not happen before retrying after a timeout.
- With [Circuit Breaker](/evolution/circuit-breaker): retry handles a single transient fault, and the breaker handles a persistent one. Do not retry when the downstream is already broken — each caller retrying 3 times is tripling the fault traffic, which is a retry storm. Check the breaker's state before retrying, or hand both to the same framework to orchestrate together.
- With [Bulkhead](/evolution/bulkhead): retry traffic counts against the cell's concurrency cap, so a bulkhead guarantees a retry storm can fill at most one cell.

## Key parameters

| Parameter | Basis for the value | Consequence of a wrong value |
| --- | --- | --- |
| Retry count | 2–3 | Too many turns a transient fault into sustained occupancy and amplifies downstream pressure |
| Backoff base | 100–500ms | Too short and backoff is meaningless — another batch arrives before the downstream has recovered |
| Jitter | Random between 0 and the current interval | Without jitter, a synchronous retry pulse appears at the recovery moment |
| Total budget | No more than the caller's own timeout | Retry is still running while upstream has already given up and returned an error |

## Example

Go implementation: exponential backoff with full jitter, responding to `ctx` cancellation while waiting. `fn` itself decides which errors are retryable (only transient faults return an error); the example skips error classification to keep it short.

```go
package retry

import (
	"context"
	"math/rand"
	"time"
)

// Do retries fn with "exponential backoff plus full jitter"; when attempts are exhausted it returns the last error
func Do(ctx context.Context, attempts int, fn func() error) error {
	var err error
	for i := 0; i < attempts; i++ {
		if err = fn(); err == nil {
			return nil
		}
		if i == attempts-1 {
			break
		}
		slot := time.Duration(1<<i) * 200 * time.Millisecond  // 200ms, 400ms, 800ms…
		sleep := time.Duration(rand.Int63n(int64(slot))) // full jitter: random between 0 and slot
		select {
		case <-time.After(sleep):
		case <-ctx.Done():
			return ctx.Err()
		}
	}
	return err
}
```

On the Java side there is no need to write your own: Resilience4j's `Retry` (`maxAttempts`, `waitDuration`, `enableExponentialBackoff`, with `retryExceptions` listing only retryable transient exceptions), Spring Retry's `@Retryable` (`retryFor`, `maxAttempts`, `backoff = @Backoff(delay, multiplier)`), and gRPC's service-configuration retry policy (`maxAttempts`, `initialBackoff`, `retryableStatusCodes`, retrying `UNAVAILABLE` by default) are all the same model.

## Three small things when wiring it in

1. **Decide which errors are retryable first**: timeouts, connection failures, 503, and 429 go in; 4xx and business errors do not. Write this list down explicitly — do not rely on "try every error once."
2. **Add an idempotency key to non-idempotent operations first**: the request carries a unique ID and the downstream dedupes by ID before retry is safe; interfaces that cannot be refactored do not deserve retry.
3. **Report retries**: emit a data point for every retry (count, interval, final outcome). The retry rate is a leading signal of downstream health — if you only report the final failure, the problem has been buried past the point of recovery.

## Related readings

- [Timeout](/evolution/timeout), [Bulkhead](/evolution/bulkhead), [Circuit Breaker](/evolution/circuit-breaker): the three stability patterns from *Release It!*.
- [Modern Evolution Overview](/evolution/overview): why this piece comes after GoF.

## Sources

- [S12] Michael T. Nygard, *Release It!*, 2nd edition, Pragmatic Bookshelf, 2018. The original source for transient faults and retry.
- [S13] Chris Richardson, *Microservices Patterns*, 2018, the practical criterion for retry, backoff, and idempotency.

<!-- BACKLINKS-AUTO -->
## Related pages

- [bulkhead](bulkhead.md)
- [circuit-breaker](circuit-breaker.md)
- [overview](overview.md)
- [timeout](timeout.md)
- [glossary](/glossary.md)
- [overview](/integration/overview.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
- [remote-proxy](/structural/remote-proxy.md)
