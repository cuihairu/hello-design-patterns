# 集成模式导读

应用一多，进程边界就成了问题：订单系统要知道库存系统的地址，一个下游重启把调用链拖垮，两个系统的消息格式各改各的。企业应用集成（EAI）的解法是把"进程间怎么传消息"整理成一套可替换的组件词汇，出自 Hohpe 与 Woolf 的《Enterprise Integration Patterns》[S10]，Spring Integration 与 Apache Camel 的通道、路由器、转换器就是这套词汇的框架落地。

## 分区口径

进这个分区要满足三条：

1. 有出处：出自《Enterprise Integration Patterns》[S10]，来源清单在册。
2. 有共识：至少两个主流框架有标准实现——Spring Integration 与 Apache Camel 覆盖本区全部条目。
3. 组件级协作：每个模式是可独立实现、可替换的组件（通道、路由器、转换器、主题），而不是约束全系统拓扑的风格。按这条判据，分层、管道-过滤器等架构风格不进本仓，处置见[差异表](/research/coverage)。

## 本区的四篇

- [消息通道](/integration/message-channel)：发送方与接收方之间的抽象管道，解耦时间、位置与速率，是本区的地基。
- [消息路由](/integration/message-router)：读消息头、按规则选输出通道，"该交给谁"从业务代码里独立出来。
- [消息转换](/integration/message-translator)：两个系统格式不同，转换器独立成组件管映射与版本桥。
- [发布订阅](/integration/publish-subscribe)：一条消息投递给所有订阅者，与[观察者](/behavioral/observer)是同一意图在跨进程域的再实现。

## 与已有分区的关系

- [生产者-消费者](/concurrency/producer-consumer)：进程内的通道同构，那边解决线程协作，这边解决进程协作。
- [观察者](/behavioral/observer)：进程内的发布订阅同构，同步回调换成异步消息，失败模型完全不同。
- [熔断器](/evolution/circuit-breaker)、[超时](/evolution/timeout)、[重试](/evolution/retry)：跨进程调用的另一条路线——同步 RPC 加稳定性治理，与消息集成互补，同一系统常两边都用。

## 怎么读

先读[消息通道](/integration/message-channel)，把点对点与发布订阅两种形态分清；[消息路由](/integration/message-router)与[消息转换](/integration/message-translator)是通道上的两类加工组件；[发布订阅](/integration/publish-subscribe)对照[观察者](/behavioral/observer)读，体会同步回调换成异步消息时换掉的失败模型。
