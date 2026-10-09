# 读写锁模式（Read-Write Lock Pattern）

读写锁把一把互斥锁拆成两种许可：读锁之间不互斥，写锁独占（与读锁、与其他写锁都互斥）。读多写少的共享状态用它，能把吞吐拉起来；读写接近一比一时反而比互斥锁慢，因为多出来的记账逻辑要付钱。标准参照是 Java 的 `ReadWriteLock` 与 `ReentrantReadWriteLock` [S19]。

## 语义

| 当前持有 | 请求读锁 | 请求写锁 |
| --- | --- | --- |
| 无 | 获得 | 获得 |
| 读锁（1 个） | 获得 | 等待 |
| 读锁（N 个） | 获得 | 等待 |
| 写锁 | 等待 | 等待 |

三条容易踩的细节：

1. **写锁饿不死，读锁可能等很久**：写锁请求到达后，后续读锁不能再进来，否则写要一直重试。多数实现会让新读锁在有写者等待时排队（写优先），Java 的 `ReentrantReadWriteLock` 默认非公平但会避免写锁饥饿。
2. **锁降级可用，锁升级不可用**：持有读锁时可以再拿写锁（拿到后读锁自动降为写锁），但持有读锁直接请求写锁会死锁。正确用法是"读 → 改 → 释放读 → 拿写"，或用降级路径。
3. **读锁只保护读**：在读锁里改数据是数据竞争，因为其他读者也在读同一份。改必须在写锁里做。

## 什么时候值得

- **值得**：读远多于写（10:1 以上）、读操作耗时明显（遍历、序列化、复杂计算）、临界区不能靠原子变量代替。
- **不值得**：临界区只有几条赋值（用 `atomic` 更快）、读写差不多（互斥锁更简单，缓存行竞争也更少）、临界区极短（锁记账比临界区还贵）。

Java 的 `ReentrantReadWriteLock` 在 JDK 8 之后还有一把 `StampedLock`：乐观读不加锁，读完用版本戳验证有没有写过，省掉读锁的计数开销。代价是不可重入，写代码要小心。

## 示例

Java：缓存的读写分离，写路径用锁降级把"改完再验证一遍"做对。

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

Go 没有读写锁类，用 `sync.RWMutex`，方法名就是 `RLock`/`RUnlock` 与 `Lock`/`Unlock`：

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

C++17 起用 `std::shared_mutex`：`std::shared_lock` 是读锁，`std::unique_lock` 是写锁，与 Java 语义一致。

## 反面：读锁里做写事

```java
rw.readLock().lock();
try {
    if (cache.get(key) == null) {
        cache.put(key, load());   // 读锁下写共享状态，其他读者可能读到半更新
    }
} finally {
    rw.readLock().unlock();
}
```

修法是二次检查加写锁：先读锁查一次，命中就返回；未命中释放读锁、拿写锁、再查一次再加载。

## 观察指标

- 读锁平均等待时间接近写锁等待：读写比已经掉下来了，考虑退回互斥锁。
- 写锁等待时间明显长于临界区：新读锁被挡在写者后面，看写者是不是持锁做了 I/O。
- 锁等待超过临界区自身耗时：锁开销盖过收益，先缩临界区再换锁类型。

## 相关篇目

- [双重检查锁定](/concurrency/double-checked-locking)：同样的"先读、再补写"思路用在惰性初始化上。
- [信号量模式](/concurrency/semaphore)：用计数许可限流，和读写锁是两种同步原语。
- [线程池](/concurrency/thread-pool)：锁是任务内部的事，池决定同时跑几个任务。
- [对象池](/creational/object-pool)：池化状态与锁要一起设计，池太大反而放大锁竞争。

## 来源

- [S19] Java SE API `java.util.concurrent.locks` 包说明，`ReadWriteLock`、`ReentrantReadWriteLock`、`StampedLock`。
- [S20] C++ Core Guidelines，资源与互斥的 RAII 用法。
- [S21] Go 官方文档，`sync.RWMutex`。
