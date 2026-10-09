# 隔舱模式（Bulkhead）

隔舱把调用方的资源——线程、连接、内存、队列——按下游或业务分成几个互不占用的池子：一个下游变慢只吃光自己那一格，别的格子照常工作。它出自 Nygard 的《Release It!》[S12]，词取自船的舱壁：船底分仓，一舱进水船不沉。没有隔舱的服务是通舱设计，所有请求共用一个线程池或连接池，一个慢下游就能把整个池子占满，拖垮与它无关的功能。[熔断器](/evolution/circuit-breaker)篇里"变慢的下游把线程、连接、内存一起拖住"，防住这一步的前半段靠的就是隔舱：先分仓，再谈单个仓里的熔断与[超时](/evolution/timeout)。

## 隔什么、按什么隔

按隔离的载体分三种：

- **线程池隔离**：每个下游一个线程池，占用上限明确，代价是线程切换与排队延迟。Java 的传统做法（Hystrix 的线程池组）。
- **信号量隔离**：不换线程，只数"同时在飞的请求数"，到了上限直接拒绝。开销小，适合纯内存或低延迟调用。Resilience4j 的 `Bulkhead` 默认就是信号量。
- **连接池隔离**：数据库、HTTP 客户端按用途分池——交易读一个池、报表一个池，慢查询占满报表池不影响交易池。

格子怎么划：按下游分（A 服务一格、B 服务一格），再按业务优先级分（支付一格、导出一格）。判断标准是**故障与迟缓的量级差异**：导出报表慢不该让支付下单跟着等队列。

## 适用与不适用

适用于：一个进程同时访问多个延迟量级不同的下游，或一个进程同时服务多个业务优先级。

不适用的三种：

1. 资源本来就不紧张的小服务：多套池子徒增配置与调参成本，隔离收益接近零。
2. 下游数量多而流量都小：为每个下游建池，池子利用率低，内存先扛不住，应合并为按"下游类别"分格。
3. 纯进程内调用：本地对象之间没有连接与线程的争夺面。

## 与其他模式的关系

- 与[熔断器](/evolution/circuit-breaker)：隔舱限制同时在飞的数量（空间上隔离），熔断按失败率决定要不要发（时间上断闸）。顺序是先隔舱后熔断——隔舱保证一个仓出事不传染，熔断保证出事的仓尽快停止无效请求。
- 与[超时](/evolution/timeout)：超时把慢调用变短，隔舱把慢调用的占用封顶，两者一起决定最坏情况下一个慢下游吃掉多少资源。
- 与[重试](/evolution/retry)：重试的流量计入所在舱格的上限，隔舱保证重试风暴最多打满一格。
- 与[信号量](/concurrency/semaphore)：信号量是隔舱的计数原语，并发篇里它解决的是互斥与限流，隔舱给它加上"按下游分格、拒绝要有降级"的用法。
- 与[生产者-消费者](/concurrency/producer-consumer)：队列加固定消费者组是隔舱的异步形态，队列长度就是仓壁。
- 与[线程池](/concurrency/thread-pool)：线程池隔离的基础设施，隔舱决定"建几个池、每个池多大"。

## 关键参数

| 参数 | 取值依据 | 设错的后果 |
| --- | --- | --- |
| 每格并发上限 | 下游能承受的并发（正常 QPS × P99 延迟） | 太小，正常流量排队；太大，隔离名存实亡 |
| 排队上限 / 等待时长 | 超过并发上限后的等待位数量 | 无限排队等于没有隔舱，请求在队列里慢慢过期 |
| 格子数量 | 按下游数加业务优先级，一般 2–5 个 | 每下游一格，在下游多时把内存切碎 |

每格的容量依据是**下游能承受多少**，不是调用方有多少线程：下游只扛得住 50 并发，给 500 的格子是把下游打死。

## 示例

Go 实现：每个舱格一个信号量，占不到就拒绝，不排队。

```go
package bulkhead

import "errors"

var ErrFull = errors.New("bulkhead full")

// Cell 是一个舱格：最多 maxInFlight 个调用同时在飞，占不到就拒绝
type Cell struct {
	sem chan struct{}
}

func New(maxInFlight int) *Cell {
	return &Cell{sem: make(chan struct{}, maxInFlight)}
}

// Do 占一格执行 fn；占不到返回 ErrFull，由调用方走降级
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

调用方按下游建格，容量按各自下游能承受的并发设：

```go
var (
	payCell    = bulkhead.New(50) // 支付：贵、量小
	reportCell = bulkhead.New(10) // 报表导出：慢，占满了也不影响支付
)
```

Java 侧不必自己写：Resilience4j 的 `Bulkhead`（`maxConcurrentCalls`、`maxWaitDuration`）与线程池变体 `ThreadPoolBulkhead`（`maxThreadPoolSize`、`queueCapacity`）、Hystrix 的线程池隔离（`execution.isolation.strategy=THREAD`，已停更）、Sentinel 的槽位链按资源隔离，都是同一思路。

## 接入时的三件小事

1. **拒绝要有去向**：`ErrFull` 出来后走降级（默认值、转异步队列、明确报错），和熔断打开一样要给用户交代。
2. **上限按下游能力设**：每格容量是下游能承受的量，拍脑袋按调用方线程数设等于没隔。
3. **监控每格占用率**：占用率长期贴近 1 的格子先扩容或熔断，这是容量规划的第一手数据。

## 相关篇目

- [熔断器](/evolution/circuit-breaker)、[超时](/evolution/timeout)、[重试](/evolution/retry)：同出 Release It! 的稳定性三模式。
- [信号量模式](/concurrency/semaphore)：隔舱的计数原语。
- [线程池模式](/concurrency/thread-pool)：线程池隔离的基础设施。
- [现代演进导读](/evolution/overview)：本篇为什么放在 GoF 之后。

## 来源

- [S12] Michael T. Nygard，《Release It!》第 2 版，Pragmatic Bookshelf，2018。舱壁隔离的原始出处。
- [S13] Chris Richardson，《Microservices Patterns》，2018，服务间资源隔离的实践口径。
