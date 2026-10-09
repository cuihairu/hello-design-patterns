# 重试模式（Retry）

重试把一次失败的操作按退避间隔再试几次：次数用尽前成功就恢复，用尽就报错。它出自 Nygard 的《Release It!》[S12]，要解决的问题是**瞬时故障**：网络抖动、下游重启、锁冲突、限流拒绝，这类失败一次出现不代表持续存在，直接把错误抛给用户或上游，等于放弃了本来能自动恢复的机会。但重试有严格的前提——失败必须是"再试一次就有机会成功"的瞬时故障，且操作必须幂等；不满足这两条的重试不是恢复手段，是故障放大器。

## 三个前提

1. **只重试瞬时故障**：连接被拒、超时、503、限流 429 可以重试；参数错、余额不足这类业务失败，重试一万次还是失败，4xx 一律不进重试。
2. **操作要幂等**：扣款重试一次就是两笔扣款。非幂等的写操作要先加幂等键（请求带唯一 ID，下游按 ID 去重）或改成先查结果再决定，然后才谈得上重试。
3. **重试要有限制**：次数上限一般 2–3 次，总时长不能超出调用方自己的[超时](/evolution/timeout)预算。

## 退避与抖动

固定间隔重试在故障恢复的时刻会形成同步脉冲：所有重试者掐着同一个节拍一起发请求，刚恢复的下游立刻被打二次。标准做法是**指数退避加抖动**：

- 间隔按轮次指数增长：`base × 2^n`，常见 base 取 100–500ms；
- 每次在算出的间隔上叠加随机抖动，把重试者错开（AWS SDK 称之为 full jitter：在 `0` 到当前轮次间隔之间随机取值）；
- 次数上限 2–3 次，总时长控制在秒级。

退避解决"多久后再试"，抖动解决"大家一起试"，缺一不可。

## 与其他模式的关系

- 与[超时](/evolution/timeout)：单次超时 × (重试次数 + 1) 是总时长上限，必须小于调用方自己的预算；写操作超时后重试前先确认副作用没发生。
- 与[熔断器](/evolution/circuit-breaker)：重试处理单次瞬时故障，熔断器处理持续故障。下游已经熔断时不要再重试——每个调用方重试 3 次等于把故障流量放大 3 倍，这就是重试风暴。重试前查熔断器状态，或把两者交给同一个框架统一编排。
- 与[隔舱](/evolution/bulkhead)：重试的流量计入所在舱格的并发上限，隔舱保证重试风暴最多打满一格。

## 关键参数

| 参数 | 取值依据 | 设错的后果 |
| --- | --- | --- |
| 重试次数 | 2–3 次 | 次数太多，把瞬时故障拖成持续占用，还放大下游压力 |
| 退避基数 | 100–500ms | 太短，退避形同虚设，下游没恢复就又来一批 |
| 抖动 | 0 到当前间隔之间随机 | 没有抖动，恢复时刻出现同步重试脉冲 |
| 总预算 | 不超过调用方自己的超时 | 重试还在跑，上游已经放弃并返回错误 |

## 示例

Go 实现：指数退避加全抖动，等待期间响应 `ctx` 取消。哪些错误可重试由 `fn` 自己判断（瞬时故障才返回错误），示例为了短没有做错误分类。

```go
package retry

import (
	"context"
	"math/rand"
	"time"
)

// Do 按"指数退避加全抖动"重试 fn，次数用尽返回最后一次的错误
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
		sleep := time.Duration(rand.Int63n(int64(slot))) // 全抖动：0 到 slot 之间随机
		select {
		case <-time.After(sleep):
		case <-ctx.Done():
			return ctx.Err()
		}
	}
	return err
}
```

Java 侧不必自己写：Resilience4j 的 `Retry`（`maxAttempts`、`waitDuration`、`enableExponentialBackoff`，用 `retryExceptions` 只列可重试的瞬时异常）、Spring Retry 的 `@Retryable`（`retryFor`、`maxAttempts`、`backoff = @Backoff(delay, multiplier)`）、gRPC 的服务配置重试策略（`maxAttempts`、`initialBackoff`、`retryableStatusCodes`，默认只重试 `UNAVAILABLE`）都是同一模型。

## 接入时的三件小事

1. **先定哪些错误可重试**：超时、连接失败、503、429 进重试；4xx 与业务错误不进，这张清单要显式写出来，不能靠"所有错误都试一遍"。
2. **非幂等操作先加幂等键**：请求带唯一 ID、下游按 ID 去重，重试才安全；改造不了的接口不配重试。
3. **重试要上报**：每次重试打点（次数、间隔、最终结果），重试率是下游健康度的前导信号——只报最终失败，问题已经被捂到无法挽回了。

## 相关篇目

- [超时](/evolution/timeout)、[隔舱](/evolution/bulkhead)、[熔断器](/evolution/circuit-breaker)：同出 Release It! 的稳定性三模式。
- [现代演进导读](/evolution/overview)：本篇为什么放在 GoF 之后。

## 来源

- [S12] Michael T. Nygard，《Release It!》第 2 版，Pragmatic Bookshelf，2018。瞬时故障与重试的原始出处。
- [S13] Chris Richardson，《Microservices Patterns》，2018，重试、退避与幂等的实践口径。
