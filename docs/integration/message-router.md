# 消息路由模式（Message Router）

消息路由器读进来的消息，按规则选一条输出通道写出去：输入一个通道，输出多个通道，"这条消息该交给谁"的判断独立成一个组件。它出自《Enterprise Integration Patterns》[S10]，要解决的问题是收发双方把分发逻辑写死在业务代码里——新增一个下游要改发送方，调整一条规则要重新发布整个服务。路由器让规则变成可独立修改的组件，发送方只管把消息丢进路由器，下游增减对它不可见。

## 常见形态

- **内容路由（Content-Based Router）**：按消息内容选通道——订单消息按类型分流到国内仓、海外仓。
- **消息过滤器（Message Filter）**：不匹配规则的消息直接丢弃，下游只收到自己关心的子集。
- **接收表（Recipient List）**：按配置的名单广播给固定几个通道，名单在配置里改。
- **拆分器与聚合器（Splitter / Aggregator）**：一条大消息拆成多条并行处理，结果再聚合回来，配对靠关联 ID。

## 适用与不适用

适用于：分发规则频繁变化或需要动态配置；多个下游按消息特征各取所需；发送方不该知道下游名单。

不适用：

1. 分发规则唯一且稳定：一条 if 就够，单独的路由器组件是过度设计。
2. 需要所有下游协商出结果：那是编排的活，路由器只做单向分发，不做回调聚合。
3. 进程内按类型分派：多态与方法分派就是语言内置的路由，别绕过语言机制造配置表。

## 与其他模式的关系

- 与[责任链](/behavioral/chain-of-responsibility)：责任链按顺序逐个试、可能被中间环节处理掉；路由器按规则一次定向，消息原样转发。
- 与[策略](/behavioral/strategy)：路由规则本身是可替换的策略，规则表是策略的配置化形态。
- 与[消息通道](/integration/message-channel)：路由器站在多条通道之间，是通道的编排者。
- 与[观察者](/behavioral/observer)：接收表形态在进程内的对应物是事件广播，但路由器按规则选择性转发，观察者全量通知。

## 关键参数

| 参数 | 取值依据 | 设错的后果 |
| --- | --- | --- |
| 规则载体 | 代码编译期定死 vs 配置运行时可改 | 规则进配置却不支持回滚，改错无从退回 |
| 默认通道 | 必配：不匹配任何规则的消息去向 | 没有默认通道，未匹配消息静默消失 |
| 匹配优先级 | 规则有重叠时先匹配谁 | 规则一多，顺序成了暗知识，命中与否靠猜 |

## 示例

Go 实现：按订单类型路由，规则表显式声明，带默认通道。

```go
package router

import "errors"

var ErrNoRoute = errors.New("no route")

type Order struct {
	ID      string
	Channel string // domestic / overseas
}

type Router struct {
	routes    map[string]chan<- Order
	defaultCh chan<- Order
}

func New(defaultCh chan<- Order) *Router {
	return &Router{routes: map[string]chan<- Order{}, defaultCh: defaultCh}
}

func (r *Router) Register(orderType string, ch chan<- Order) {
	r.routes[orderType] = ch
}

// Route 按内容选通道；未命中走默认通道，没有默认通道返回 ErrNoRoute
func (r *Router) Route(o Order) error {
	if ch, ok := r.routes[o.Channel]; ok {
		ch <- o
		return nil
	}
	if r.defaultCh == nil {
		return ErrNoRoute
	}
	r.defaultCh <- o
	return nil
}
```

Java 侧不必自己写：Apache Camel 的 `choice().when(...).to(...).otherwise(...)`、Spring Integration 的 `@Router` 注解方法、Kafka Streams 的 `branch()` 都是内容路由的标准落地；网关类产品外置的路由表也是同一模型。

## 接入时的三件小事

1. **默认通道与死信通道分开**：默认通道承接"规则没覆盖"的正常消息，死信通道承接"下游处理失败"的异常消息，混用会掩盖规则缺口。
2. **规则变更要可回滚**：规则表进配置就要带版本，改错能一键回退——路由是所有消息的必经之路，路由错误是全量故障。
3. **命中计数按规则出**：每条规则的命中量、默认通道的流量占比，是规则维护的第一手数据。

## 相关篇目

- [消息通道](/integration/message-channel)、[消息转换](/integration/message-translator)：路由器的输入输出与搭档组件。
- [责任链模式](/behavioral/chain-of-responsibility)：逐个试与按规则定向的对比。
- [策略模式](/behavioral/strategy)：路由规则作为可替换策略。
- [集成模式导读](/integration/overview)：本区口径。

## 来源

- [S10] Gregor Hohpe、Bobby Woolf，《Enterprise Integration Patterns》，Addison-Wesley，2002。消息路由的原始出处。
