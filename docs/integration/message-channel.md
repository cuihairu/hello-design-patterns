# 消息通道模式（Message Channel）

消息通道是发送方与接收方之间的抽象管道：发送方把消息写进通道，接收方从通道读，双方不持有对方的地址，也不要求对方在线。它出自 Hohpe 与 Woolf 的《Enterprise Integration Patterns》[S10]，要解决的问题是点对点调用把三样东西绑死——位置（必须知道对方地址）、可用性（对方不在线就失败）、速率（对方处理不动，调用方跟着堵）。通道把三样一起解开：消息先落在通道里，接收方按自己的节奏消费。

## 两种通道

- **点对点通道（Point-to-Point Channel）**：一条消息恰好被一个消费者处理，队列语义。适合"这件事要有人做，做一次就够"——下单扣库存、发邮件。
- **发布订阅通道（Publish-Subscribe Channel）**：一条消息投递给所有订阅者，见[发布订阅](/integration/publish-subscribe)。适合"这件事发生了，谁关心谁订阅"——订单已创建，积分、通知、报表各自消费。

通道解耦不免费：一致性从"同事务"退化为"最终一致"，重复投递与乱序要显式处理（幂等消费、序号字段）。同步调用改异步消息之前，先确认业务容忍这个差别。

## 适用与不适用

适用于：发送方与接收方需要独立部署与扩缩容；流量有尖峰需要削峰；一个动作触发多个下游。

不适用：

1. 调用方需要立刻拿到结果：请求-响应语义用消息要做关联 ID 异步等待，复杂度远超一次 RPC。
2. 强一致写操作：库存扣减这类不容许中间态的操作，最终一致是错误答案。
3. 进程内协作：同一进程里传数据直接传引用，[生产者-消费者](/concurrency/producer-consumer)就是进程内的通道同构。

## 与其他模式的关系

- 与[生产者-消费者](/concurrency/producer-consumer)：同一语义在进程内与跨进程的两个实现——队列换成中间件，线程换成服务。
- 与[发布订阅](/integration/publish-subscribe)：通道的第二种形态，一条消息对多个订阅者。
- 与[消息路由](/integration/message-router)、[消息转换](/integration/message-translator)：通道是地基，路由与转换是通道上的加工组件。

## 关键参数

| 参数 | 取值依据 | 设错的后果 |
| --- | --- | --- |
| 通道容量 / 分区数 | 消费速率 × 可容忍的积压时长 | 太小削峰失效，太大积压不可见 |
| 投递保证 | at-least-once 为默认，消费端配幂等 | 当成 exactly-once 用，重复消费写脏数据 |
| 死信出口 | 必配：消费失败 N 次后转入死信通道 | 一条毒消息堵死整条通道 |

## 示例

Go 实现：带缓冲 channel 就是一个进程内的点对点通道——多个 worker 消费同一条队列，一条消息恰好被一个 worker 处理。

```go
package channel

import "fmt"

type Order struct {
	ID string
}

// Start 起一条点对点通道：容量即削峰水位，一条消息恰好被一个 worker 消费
func Start(workers int) chan<- Order {
	ch := make(chan Order, 256)
	for i := 0; i < workers; i++ {
		go func() {
			for o := range ch {
				process(o) // 消费失败要转入死信通道，不能丢
			}
		}()
	}
	return ch
}

func process(o Order) {
	fmt.Println("processing", o.ID)
}
```

跨进程时通道由消息中间件承担：RabbitMQ 的队列、Kafka 的 topic 分区、JMS 的 Queue，语义同型——发方 `publish`，收方 `consume`，容量与持久化由中间件配置。

Java 侧按框架对号入座：JMS 的 `Queue` 是点对点通道、`Topic` 是发布订阅通道；Spring Integration 的 `MessageChannel` 分 `DirectChannel`（同进程同步分发）与 `QueueChannel`（缓冲异步）；Kafka 的 topic 按 partition 顺序投递。

## 接入时的三件小事

1. **消息带版本**：消息体要跨进程长期飞，字段演进从第一天就打版本号，转换交给[消息转换](/integration/message-translator)。
2. **死信出口必配**：消费失败重试几次后转死信通道，人工或定时任务兜底，否则一条毒消息堵死整条通道。
3. **积压要可见**：通道容量、消费滞后（lag）是第一监控指标，积压曲线比用户投诉早半天。

## 相关篇目

- [发布订阅](/integration/publish-subscribe)：通道的第二种形态。
- [消息路由](/integration/message-router)、[消息转换](/integration/message-translator)：通道上的加工组件。
- [生产者-消费者模式](/concurrency/producer-consumer)：进程内同构。
- [集成模式导读](/integration/overview)：本区口径。

## 来源

- [S10] Gregor Hohpe、Bobby Woolf，《Enterprise Integration Patterns》，Addison-Wesley，2002。消息通道的原始出处。
