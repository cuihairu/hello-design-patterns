# 超时模式（Timeout）

超时给每次跨进程调用设一个时间上限，到点就放弃这次调用，走降级或明确报错，不让调用方无限等下去。它出自 Nygard 的《Release It!》[S12]，要解决的问题不是"下游报错"，而是"下游不响应"：没有超时的调用一旦碰上挂起的下游（死循环、长时间 GC、网络丢包后的 TCP 重传），调用方的线程或协程就永远占着，资源一格一格被吃光，最后整个服务不可用。Nygard 的原话是所有跨进程调用都要设超时，无一例外——[熔断器](/evolution/circuit-breaker)统计失败率，超时负责把"慢"先变成"失败"，没有超时的失败率统计是残缺的，挂着的调用根本不计入。

## 两类超时与总预算

一次跨进程调用至少有两个独立的时限：

- **连接超时**：建立 TCP 连接的等待上限。目标地址不可达时，操作系统默认要等很久，这个值一般几百毫秒到一秒。
- **读超时（响应超时）**：连接建立后等响应的时长，按下游正常 P99 延迟的 1.5–2 倍设，不是拍一个"感觉差不多"的数。

多层调用还要有**总预算**：一次用户请求串起网关、服务 A、数据库，各段超时不能简单相加——每段的超时要小于上游传下来的剩余预算。gRPC 的 deadline 传播就是为此设计的：上游把剩余时间随请求传给下游，下游取 min(本地配置, 上游剩余) 作为自己的上限。

## 适用与不适用

适用于一切跨进程调用：HTTP、RPC、数据库、缓存、消息队列。判断依据只有一条——调用会占用一份进程外资源（连接、内存、线程等待位），就要有时限。

不适用的只有进程内调用：本地函数不占连接，加超时的复杂度不值得。两种常见的错误用法要避开：

1. **把超时当重试的替代品**：超时只负责止损，恢复要靠[重试](/evolution/retry)，两者是配合关系。
2. **超时设得比下游 P99 还短**：正常慢请求被杀掉，下游的副作用却已经发生——调用方当失败处理，下游实际执行成功，数据从此不一致。

## 与其他模式的关系

- 与[熔断器](/evolution/circuit-breaker)：超时把慢调用转成失败，熔断器统计这些失败决定断不断闸。顺序固定：先有超时，熔断器的窗口才有完整的失败样本。
- 与[重试](/evolution/retry)：单次超时 × (重试次数 + 1) 是总时长上限，必须留在调用方自己的预算内；写操作超时后重试前先确认副作用没发生。
- 与[隔舱](/evolution/bulkhead)：超时管单次调用的时长，隔舱管同时在飞的调用数量，两者一起决定最坏情况下一个慢下游吃掉多少资源。
- 超时后的降级写法与[策略](/behavioral/strategy)一致：正常实现和兜底实现是两个可替换的策略。

## 关键参数

| 参数 | 取值依据 | 设错的后果 |
| --- | --- | --- |
| 连接超时 | 几百毫秒到 1 秒，跨公网适当放宽 | 太短把正常建连杀掉；太长对不可达地址形成长时间占用 |
| 读超时 | 下游 P99 的 1.5–2 倍 | 比 P99 短，副作用已发生却被当失败；太长，线程占用时间跟着变长 |
| 总预算 | 产品的响应时间要求 | 各段超时之和大于总预算，用户已经超时，下游却全"成功" |

## 示例

Go 实现：连接超时放在 Transport 的拨号器上，读超时用 `context.WithTimeout` 控制，并且沿用上游传下来的 deadline——上游预算更紧时取更小值。

```go
package client

import (
	"context"
	"net"
	"net/http"
	"time"
)

var httpClient = &http.Client{
	// 连接超时归 Transport：拨号上限 500ms
	Transport: &http.Transport{
		DialContext: (&net.Dialer{Timeout: 500 * time.Millisecond}).DialContext,
	},
}

// Query 请求 url，读超时按下游 P99 的两倍设，并沿用上游的 deadline
func Query(ctx context.Context, url string) (*http.Response, error) {
	local := 2 * time.Second
	if deadline, ok := ctx.Deadline(); ok {
		if d := time.Until(deadline); d < local {
			local = d // 上游预算更紧时取更小值
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

Java 侧不必自己写：Resilience4j 的 `TimeLimiter`（`timeoutDuration`）、gRPC 的 `Context.withDeadlineAfter`、`java.net.http.HttpRequest` 的 `timeout` 都是同一个模型；Spring 的事务超时（`@Transactional(timeout=…)`）管的是数据库那一段。

## 接入时的三件小事

1. **超时要有去处**：到点之后返回什么（缓存值、默认值、明确报错）要提前定好，不能到点再想。
2. **链路上越靠外的预算越大**：下游配置的超时要小于上游的剩余预算，否则上游已放弃、下游还在干，下游的活白做。
3. **超时不等于失败**：写操作超时后副作用可能已经发生，直接重试可能重复扣款——先确认结果（幂等键或查询）再决定下一步。

## 相关篇目

- [熔断器](/evolution/circuit-breaker)、[隔舱](/evolution/bulkhead)、[重试](/evolution/retry)：同出 Release It! 的稳定性三模式。
- [策略模式](/behavioral/strategy)：超时后降级实现的切换。
- [现代演进导读](/evolution/overview)：本篇为什么放在 GoF 之后。

## 来源

- [S12] Michael T. Nygard，《Release It!》第 2 版，Pragmatic Bookshelf，2018。超时的原始出处。
- [S13] Chris Richardson，《Microservices Patterns》，2018，超时与 deadline 传播的实践口径。
