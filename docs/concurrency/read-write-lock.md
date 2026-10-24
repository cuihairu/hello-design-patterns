# Read-Write Lock

A read-write lock splits a single mutex into two kinds of permits: read locks do not exclude each other, while a write lock is exclusive (mutually exclusive with both read locks and other write locks). Shared state that is read much more than it is written benefits from this, raising throughput; when reads and writes are close to 1:1 it is actually slower than a mutex, because the extra bookkeeping has a cost. The standard references are Java's `ReadWriteLock` and `ReentrantReadWriteLock` [S19].

## Semantics

| Current holder | Read lock requested | Write lock requested |
| --- | --- | --- |
| None | Granted | Granted |
| Read lock (1) | Granted | Wait |
| Read locks (N) | Granted | Wait |
| Write lock | Wait | Wait |

Three details that are easy to get wrong:

1. **A write lock will not starve, but a read lock may wait a long time**: once a write lock request arrives, subsequent read locks must not be admitted, otherwise the writer would have to retry indefinitely. Most implementations queue new read locks when a writer is waiting (write priority); Java's `ReentrantReadWriteLock` is non-fair by default but avoids write-lock starvation.
2. **Lock downgrade works, lock upgrade does not**: holding a read lock, you can then acquire the write lock (once acquired, the read lock automatically becomes the write lock), but requesting a write lock while holding a read lock will deadlock. The correct pattern is "read -> modify -> release read -> acquire write," or use the downgrade path.
3. **A read lock only protects reads**: modifying data under a read lock is a data race, because other readers are also reading the same data. Modifications must happen under a write lock.

## When it pays off

- **Worth it**: reads greatly outnumber writes (10:1 or more), read operations take noticeable time (traversal, serialization, complex computation), and the critical section cannot be replaced by atomic variables.
- **Not worth it**: the critical section is just a few assignments (an `atomic` is faster), reads and writes are roughly balanced (a mutex is simpler and has less cache-line contention), or the critical section is extremely short (the lock's bookkeeping costs more than the critical section).

Java's `ReentrantReadWriteLock` has a companion in `StampedLock` since JDK 8: an optimistic read takes no lock, and after reading it verifies with a version stamp whether a write occurred, saving the read lock's counting overhead. The cost is that it is not reentrant, so write carefully.

## Examples

Java: read/write separation for a cache, with the write path using lock downgrade to correctly handle "modify then re-verify."

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class Cache<K, V> {
    private final Map<K, V> store = new HashMap<>();
    private final ReentrantReadWriteLock rw = new ReentrantReadWriteLock();

    public V get(K key) {
        rw.readLock().lock();
        try {
            return store.get(key);
        } finally {
            rw.readLock().unlock();
        }
    }

    public void put(K key, V value) {
        rw.writeLock().lock();
        try {
            store.put(key, value);
        } finally {
            rw.writeLock().unlock();
        }
    }
}
```

Go has no read-write lock class; use `sync.RWMutex`, whose method names are `RLock`/`RUnlock` and `Lock`/`Unlock`:

```go
type Cache struct {
    mu sync.RWMutex
    m  map[string]string
}

func (c *Cache) Get(key string) (string, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    v, ok := c.m[key]
    return v, ok
}

func (c *Cache) Set(key, value string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.m[key] = value
}
```

From C++17 on, use `std::shared_mutex`: `std::shared_lock` is the read lock, `std::unique_lock` is the write lock, with semantics matching Java.

## Anti-pattern: writing under a read lock

```java
rw.readLock().lock();
try {
    if (cache.get(key) == null) {
        cache.put(key, load());   // writing shared state under a read lock; other readers may see a partially updated state
    }
} finally {
    rw.readLock().unlock();
}
```

The fix is a second check with a write lock: check once under a read lock, and if there is a hit return; on a miss, release the read lock, acquire the write lock, check again, and then load.

## Metrics to watch

- Average read-lock wait time approaches the write-lock wait: the read/write ratio has dropped; consider falling back to a mutex.
- Write-lock wait time is noticeably longer than the critical section: new read locks are blocked behind the writer; check whether the writer holds the lock while doing I/O.
- Lock wait exceeds the critical section's own time: the lock overhead outweighs the benefit; shrink the critical section before switching lock types.

## Related articles

- [Double-Checked Locking](/concurrency/double-checked-locking): the same "read first, then fill in a write" idea applied to lazy initialization.
- [Semaphore](/concurrency/semaphore): rate limiting via a counted permit; a different synchronization primitive from the read-write lock.
- [Thread Pool](/concurrency/thread-pool): the lock is a within-task concern; the pool decides how many tasks run at once.
- [Object Pool](/creational/object-pool): pooled state and locks must be designed together; a pool that is too large amplifies lock contention.

## Sources

- [S19] Java SE API `java.util.concurrent.locks` package documentation, `ReadWriteLock`, `ReentrantReadWriteLock`, `StampedLock`.
- [S20] C++ Core Guidelines, RAII usage of resources and mutexes.
- [S21] Go official documentation, `sync.RWMutex`.

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [thread-pool](thread-pool.md)
- [glossary](/glossary.md)
- [transaction-script](/other/transaction-script.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
- [official-docs](/research/official-docs.md)
