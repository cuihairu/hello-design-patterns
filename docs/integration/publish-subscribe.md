# 发布订阅模式（Publish-Subscribe）

发布订阅把"一件事发生了"与"谁关心这件事"彻底分开：发布方向主题发布一条消息，消息中间件负责投递给该主题的所有订阅者，双方互不知道名单。它出自《Enterprise Integration Patterns》[S10]，要解决的问题是逐个通知把下游名单写死在发送方——新增一个订阅方要改发送方、发版、重启；某个下游变慢还会把同步调用链整串拖住。

## 与观察者的关系

与[观察者](/behavioral/observer)是同一意图在两个域的实现，不互为别名：

- **观察者**在进程内：同步方法回调，主题与观察者同生共死，一个观察者抛异常会波及主题。
- **发布订阅**在跨进程：异步消息，订阅方独立部署、独立失效，投递由中间件承担，失败模型变成"消息可能重复、可能乱序、可能延迟"。

域差异让两套实现不能共用一篇：失败模型与生命周期完全不同。读法是先观察者后发布订阅，体会"同步回调换成异步消息"换掉了什么。

## 投递语义

- **at-most-once**：最多一次，可能丢。适合容忍丢失的指标上报。
- **at-least-once**：至少一次，可能重复。中间件的默认选择，要求消费端按消息 ID 去重。
- **exactly-once**：恰好一次。跨"消费处理 + 落库"两步的真恰好一次极难做到，通行做法是 at-least-once 加幂等消费模拟。

订阅方各自维护消费进度（offset / 消费位点），一个订阅方积压不影响其他订阅方——这是发布订阅对"一个下游慢拖垮整串"的直接回答。

## 适用与不适用

适用于：一个事件多个下游关心且名单持续增长；订阅方需要独立部署与扩缩容；流量尖峰需要削峰。

不适用：

1. 发送方需要结果：发布是单向通知，要结果用请求-响应。
2. 强一致写：事件只在"已经发生"之后发布，业务约束靠同步事务守，别指望订阅方补偿出强一致。
3. 进程内通知：同进程直接用[观察者](/behavioral/observer)或事件总线，消息中间件的运维成本不值得。

## 与其他模式的关系

- 与[观察者](/behavioral/observer)：进程内同构，划界见上文。
- 与[消息通道](/integration/message-channel)：发布订阅通道是通道的第二种形态，与点对点通道对照记忆。
- 与[生产者-消费者](/concurrency/producer-consumer)：点对点是"一条消息一个消费者"，发布订阅是"一条消息一组消费者各一份"，两个语义常在同一条消息管道里组合。
- 与[事件溯源](/other/event-sourcing)：事件溯源把已发生的事实存下来重建状态，发布订阅把它们分发出去——同一批事实的两条出路。

## 关键参数

| 参数 | 取值依据 | 设错的后果 |
| --- | --- | --- |
| 投递保证 | at-least-once 为默认，消费端配幂等 | 按恰好一次设计，重复消息写脏数据 |
| 消费位点 | 每个订阅组独立维护 | 多个业务共用位点，一个重启全体回滚 |
| 消息保留期 | 按最慢订阅方的追赶时长设 | 保留期太短，慢订阅方追不上直接丢数据 |

## 示例

Go 实现：进程内的主题代理——每个订阅者一条队列，发布即复制投递，订阅者互不影响。

```go
package pubsub

type Message struct {
	Topic string
	Body  string
	ID    string // 幂等键：消费端按 ID 去重
}

type Subscriber struct {
	ch chan Message
}

func (s *Subscriber) Consume() <-chan Message { return s.ch }

type Broker struct {
	topics map[string][]*Subscriber
}

func NewBroker() *Broker {
	return &Broker{topics: map[string][]*Subscriber{}}
}

func (b *Broker) Subscribe(topic string, buffer int) *Subscriber {
	s := &Subscriber{ch: make(chan Message, buffer)}
	b.topics[topic] = append(b.topics[topic], s)
	return s
}

// Publish 复制投递：一条消息发给该主题的每个订阅者各一份
func (b *Broker) Publish(msg Message) {
	for _, s := range b.topics[msg.Topic] {
		select {
		case s.ch <- msg:
		default:
			// 订阅者队列满：阻塞还是丢弃要按业务定，这里选择丢弃并计数
		}
	}
}
```

跨进程时中间件承担投递：Kafka 按 consumer group 隔离消费进度（一组一份），RabbitMQ 的 fanout exchange 把消息复制到各队列，Redis pub/sub 是不落盘的轻量形态（掉线即丢，只配容忍丢失的场景）。

Java 侧的对照要分清：`ApplicationEventPublisher`（Spring 事件）是进程内观察者，不是跨进程发布订阅；JMS 的 `Topic`、Kafka 的 topic 加 consumer group 才是本篇语义。

## 接入时的三件小事

1. **消费端幂等第一**：按 at-least-once 设计，消息 ID 去重落库，重复投递从第一天就是常态。
2. **事件带版本与幂等键**：事件体跨进程长期飞，演进规则与[消息转换](/integration/message-translator)一致。
3. **订阅方积压独立监控**：每个订阅组的 lag 单独出图，积压最慢的那组决定消息保留期。

## 相关篇目

- [观察者模式](/behavioral/observer)：进程内同构。
- [消息通道](/integration/message-channel)：点对点与发布订阅两种通道形态。
- [事件溯源](/other/event-sourcing)：同一批事实的另一种用法。
- [集成模式导读](/integration/overview)：本区口径。

## 来源

- [S10] Gregor Hohpe、Bobby Woolf，《Enterprise Integration Patterns》，Addison-Wesley，2002。发布订阅通道的原始出处。
