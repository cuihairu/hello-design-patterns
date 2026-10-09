# 熔断器模式（Circuit Breaker）

熔断器包住一次跨进程调用：统计时间窗内的失败率，超过阈值就直接返回失败，不再真的去打下游；过一段冷却时间后放一次请求试探，成功就合闸、失败就继续断开。它出自 Nygard 的《Release It!》[S12]，要解决的问题是"下游变慢"而不是"下游报错"——变慢的下游会把线程、连接、内存一起拖住，最后整个调用方跟着不可用，这叫级联故障。

## 状态机

三个状态，转换由"失败次数/失败率"和"冷却时间"驱动：

```
        失败率 ≥ 阈值
关闭 ──────────────────► 打开
 ▲                        │ 冷却时间到，放一次试探请求
 │ 试探成功                ▼
 └──────────────── 半开
 │ 试探失败
 └──────────────────────► 打开（重新计时）
```

- **关闭**：正常放行，同时在滑动窗口里记成功与失败。
- **打开**：请求立即失败，返回降级值或快速错误，不建立连接。
- **半开**：只放有限数量的试探请求，其余仍快速失败；试探成功转关闭，失败转回打开。

三个状态缺一不可：没有"打开"，慢下游会拖垮调用方；没有"半开"，恢复要靠人工；没有窗口，一次抖动就能把闸拉开。

## 适用与不适用

用它当调用方，需要三个条件：调用是跨进程的、允许降级（有兜底值或能告诉用户稍后重试）、失败是可统计的。

不适用的三种：

1. 调用必须成功才继续（转账落库）：该用[重试](/evolution/retry)加幂等，熔断只会把错误提前。
2. 本地函数调用：进程内没有连接耗尽问题，用[代理](/structural/proxy)或条件判断就够。
3. 没有降级方案：断开后无事可做，熔断只是把错误换个地方抛，价值有限。

## 与其他模式的关系

- 外形是[代理](/structural/proxy)或[装饰](/structural/decorator)：调用方仍拿着原来的接口，多出来的只是包一层。
- 降级分支的写法与[策略](/behavioral/strategy)一致：正常实现和兜底实现是两个可替换的策略。
- 窗口统计与通知可以复用[观察者](/behavioral/observer)：状态变化事件（开、合）对监控暴露。
- 与隔舱的区别：隔舱按资源分池、限制同时在飞的数量，熔断按失败率决定要不要发。生产上两者常一起用，见[隔舱](/evolution/bulkhead) [S12]。

## 关键参数

| 参数 | 取值依据 | 设错的后果 |
| --- | --- | --- |
| 窗口大小 | 至少覆盖 3–5 个正常 RTT 周期；秒级窗口适合调用量大的接口 | 窗口太小，一次网络抖动就跳闸；太大，恢复慢 |
| 失败率阈值 | 常见 50% 且要求窗口内样本数下限（如 20 次） | 只看比例不看样本量，1 失败 1 成功就是 50% |
| 冷却时间 | 从秒级起步按梯度递增，上限一般几十秒 | 固定且过长会让下游恢复后仍然吃不到流量 |
| 半开并发数 | 1–5 | 过大等于在下游还没恢复时把流量全放回去 |

样本数下限这一条最容易漏：没有最小样本数的熔断器，在低流量时段会被单次失败掀翻。

## 示例

Go 实现：互斥锁保护状态与窗口，半开只放一个试探。

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
	window      []bool // true = 成功
	limit       int    // 窗口内样本下限
	rate        float64
	cooldown    time.Duration
	openedAt    time.Time
	halfInFlight bool
}

func New(limit int, rate float64, cooldown time.Duration) *Breaker {
	return &Breaker{state: Closed, limit: limit, rate: rate, cooldown: cooldown}
}

// Do 在关闭与半开状态下执行 fn，打开状态直接返回 ErrOpen
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
			b.state, b.window = Closed, nil // 试探成功，合闸并清空旧窗口
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
			b.window = b.window[:0] // 未触发则滚动窗口
		}
	}
}

func (b *Breaker) trip() {
	b.state, b.openedAt = Open, time.Now()
}
```

Java 侧不必自己写：Resilience4j 的 `CircuitBreaker`、Hystrix 的熔断器、Sentinel 的熔断降级都是同一状态机，参数名也基本对应（`slidingWindowSize`、`failureRateThreshold`、`waitDurationInOpenState`、`permittedNumberOfCallsInHalfOpenState`）。

## 接入时的三件小事

1. **区分失败类型**：超时、连接拒绝、5xx 计入失败；业务校验失败（4xx）通常不计，否则一个发错参数的调用方会把下游熔断。
2. **降级要有值**：`Do` 的调用方必须处理 `ErrOpen`，返回缓存、返回空集合、返回"稍后重试"都行，不能直接把错误丢给用户。
3. **指标要出**：状态转换事件接进监控，打开状态持续多久、跳闸频率是多少，这两个数决定阈值要不要调。

## 相关篇目

- [代理模式](/structural/proxy)、[装饰模式](/structural/decorator)：熔断器的挂载方式。
- [隔舱](/evolution/bulkhead)、[超时](/evolution/timeout)、[重试](/evolution/retry)：同出 Release It! 的稳定性三模式。
- [策略模式](/behavioral/strategy)：正常实现与降级实现的切换。
- [观察者模式](/behavioral/observer)：状态转换事件的分发。
- [现代演进导读](/evolution/overview)：本篇为什么放在 GoF 之后。

## 来源

- [S12] Michael T. Nygard，《Release It!》第 2 版，Pragmatic Bookshelf，2018。熔断、隔舱、超时的原始出处。
- [S13] Chris Richardson，《Microservices Patterns》，2018，服务间调用的故障处理。
