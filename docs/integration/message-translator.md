# 消息转换模式（Message Translator）

消息转换器从一条通道读消息，按映射规则改写，写进另一条通道：两个系统各自保持自己的消息格式，格式差异由独立的转换组件承担。它出自《Enterprise Integration Patterns》[S10]，要解决的问题是消息格式没有两套系统是相同的——字段名不同、单位不同、编码不同、版本节奏不同。让 A 系统迁就 B 系统，改了一边另一边的老版本又出问题；转换器把"格式怎么变"收进一个组件，收发双方互不迁就。

## 常见形态

- **信封转换（Envelope Wrapper）**：外层协议换装——HTTP 头转消息头、JMS 头转 Kafka header，载荷不动。
- **内容增强（Content Enricher）**：消息缺字段，转换器查齐再往下发——订单消息只有用户 ID，增强器补上用户等级。
- **内容过滤（Content Filter）**：裁掉下游不需要的字段再转发，减少下游的耦合与敏感数据暴露面。
- **规范数据模型（Canonical Data Model）**：n 个系统互转是 n(n-1)/2 套映射，各自转换到统一中间格式只需 2n 套——系统越多省得越多。

## 适用与不适用

适用于：两个系统的格式只能各改各的；历史系统不可动；多系统互连且格式持续演进。

不适用：

1. 格式本来一致：直通通道即可，转换器是纯开销。
2. 格式可以协商统一：能改就改源头，规范模型是"改不动时的止损"，不是首选。
3. 强一致事务边界内：转换器是异步组件，别指望它参与事务回滚。

## 与其他模式的关系

- 与[适配器](/structural/adapter)：同一意图在消息域的形态——适配器改接口调用，转换器改消息体；两者都在"双方都别改"的前提下搭桥。
- 与[消息通道](/integration/message-channel)、[消息路由](/integration/message-router)：转换器是通道上的加工组件，常与路由器串联——先路由到对应的转换分支，再写进输出通道。
- 与[远程代理](/structural/remote-proxy)：远程代理隐藏"调用是跨进程的"，转换器承认"两边格式就是不同"，一个遮掩一个显式管理。

## 关键参数

| 参数 | 取值依据 | 设错的后果 |
| --- | --- | --- |
| 映射规则载体 | 代码（MapStruct 类）或配置（映射表） | 规则散落业务代码里，格式演进要全库翻找 |
| 版本策略 | 消息带版本号，转换器双版本并存 | 只支持最新版本，发布窗口被下游卡死 |
| 失败策略 | schema 校验不过就进死信 | 静默丢字段，下游拿到残缺数据 |

## 示例

Go 实现：订单消息 v1 转 v2——字段改名加单位换算，转换失败返回错误而不是静默放行。

```go
package translator

import (
	"errors"
	"fmt"
)

// V1 旧格式：金额单位是分
type OrderV1 struct {
	OrderID string
	Amount  int64
}

// V2 新格式：字段改名，金额单位是元
type OrderV2 struct {
	OrderNo    string
	AmountYuan float64
	Schema     string
}

var errInvalid = errors.New("invalid message")

// V1ToV2 映射失败返回错误，不静默放行残缺消息
func V1ToV2(v1 OrderV1) (OrderV2, error) {
	if v1.OrderID == "" {
		return OrderV2{}, fmt.Errorf("missing order_id: %w", errInvalid)
	}
	return OrderV2{
		OrderNo:    v1.OrderID,
		AmountYuan: float64(v1.Amount) / 100,
		Schema:     "order.v2",
	}, nil
}
```

Java 侧按场景对号入座：字段映射用 MapStruct（编译期生成映射代码，无反射开销）；Camel 的 `transform()` 与 `marshal().json()` 把转换嵌进路由；Spring Integration 的 `Transformer` 是独立组件形态。

## 接入时的三件小事

1. **消息带版本号，转换器双版本并存**：发布窗口两边对不齐是常态，v1→v2 的桥要活到最后一方升级完。
2. **schema 校验兜底**：转换前后各过一遍 schema 校验，映射失败进死信，绝不静默丢字段。
3. **规范模型别轻易改**：统一中间格式一旦有 n 个系统接入，改一版就是 n 个转换器联动——变更走版本化，不做原地替换。

## 相关篇目

- [消息通道](/integration/message-channel)、[消息路由](/integration/message-router)：转换器所在的管道。
- [适配器模式](/structural/adapter)：同一意图在接口域的形态。
- [集成模式导读](/integration/overview)：本区口径。

## 来源

- [S10] Gregor Hohpe、Bobby Woolf，《Enterprise Integration Patterns》，Addison-Wesley，2002。消息转换的原始出处。
