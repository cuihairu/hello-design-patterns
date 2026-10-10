# 远程外观与数据传输对象（Remote Facade and Data Transfer Object）

把领域对象的方法直接摆上网络边界，客户端每读一个字段就是一次往返，服务端的内部结构也被迫冻结——远程外观给出的解法是：边界上不放对象，放一个按用例切分的粗粒度接口，接口的参数和返回值是专用的传输对象。两个概念出自 Fowler 的《企业应用架构模式》[S5]，前者在"分布"一组，后者是跨边界的纯数据载体，通常成对出现。

站内口径（这一篇与[远程代理](/structural/remote-proxy)的分工，也是它成立的前提）：

- **远程代理管"透明"**：客户端以为在调本地对象，粒度跟着对象接口走，网络细节由代理吞掉。
- **远程外观管"边界"**：不追求透明，明说这是服务接口，方法按业务用例设计（`PlaceOrder` 而不是 `setCustomerName`），粒度由调用代价决定。

远程调用不是方法调用——一次往返有延迟、会失败、要计费。透明性在跨进程时是负债：它鼓励细粒度调用，而细粒度调用在本地是免费的、在网络上是灾难。

## 机制

两层结构，各管一件事：

```
客户端 ──► OrderFacade.PlaceOrder(req PlaceOrderRequest)
                 │            └── DTO：只带这次用例需要的字段
                 ▼
        仓储 / 支付 / 库存（领域对象不出边界）
```

- **外观定接口**：方法对应一个业务用例，一次调用完成一件事。事务边界、鉴权点、限流点都落在这里——它们都需要"一次调用=一次业务动作"的语义，细粒度对象接口给不了。
- **DTO 定载荷**：请求和响应各是一个扁平结构，只放这次用例要的字段。领域对象（聚合、懒加载关联、业务方法）留在服务端内部，边界两侧各自演化。

DTO 与领域对象分离的三个直接收益：

1. **版本自由**：内部模型重构不改 API；给 DTO 加字段是兼容变更，改领域对象的字段名不是。
2. **裁剪即安全**：字段按用例需要白名单式给出，不会把内部标识、敏感字段顺着序列化漏出去。
3. **序列化可控**：扁平结构对 JSON、Protobuf、gRPC 都友好；带对象图和循环引用的领域模型不是。

## 适用与不适用

适用于：

1. 跨进程的服务接口（HTTP API、gRPC service）——只要调用要过网络，粗粒度外观就是默认选项。
2. 领域模型复杂、客户端多样的系统——Web、移动端、第三方对接各要各的字段，DTO 按客户端裁剪，领域模型保持一份。
3. 需要在边界上集中事务、鉴权、限流的系统——这些横切逻辑要挂在"用例"粒度上，外观是天然的挂点。

不适用的三种：

1. **进程内调用**：没有网络代价，直接用领域接口，加外观只是白传一层（进程内的简化入口是[外观模式](/structural/facade)）。
2. **透传式网关**：只是转发请求、不聚合不裁剪，那是[远程代理](/structural/remote-proxy)或负载均衡的活，写成外观是给管道加法兰。
3. **CRUD 直通**：没有领域规则的资源增删改查，控制器直接操作数据源即可，套外观加 DTO 是给管道加两处法兰。

## 与其他模式的关系

- 与[远程代理](/structural/remote-proxy)：同一个"跨进程"场景的两种取向。代理保透明、粒度跟对象；外观弃透明、粒度跟用例。对外观良好的服务接口，客户端代码读起来像本地方法调用，但签名是业务动作而不是对象 getter。
- 与[外观模式](/structural/facade)：同一意图的进程内版本。远程外观多出来的东西——DTO、序列化、版本、超时与重试的挂点——全部来自"跨了进程"这一事实。
- 与[仓储与单元工作](/other/repository)：仓储返回领域对象，DTO 的转换发生在边界（外观或控制器），别让 DTO 从仓储里出来——那会把接口层的裁剪需求压进领域层。
- 与[贫血模型](/anti-patterns/anemic-domain-model)：DTO 天然贫血，这是对的——它是数据载体不是模型。危险的是把 DTO 当领域模型用：规则散落在转换代码里，"金额不能为负"校验三处重复。贫血的反面教材，见反模式篇。
- 与[事务脚本](/other/transaction-script)：外观的一个方法常和事务脚本的一个流程一一对应；复杂到需要聚合与不变量时，外观内部走领域模型，外观本身不变。
- 与[事件溯源](/other/event-sourcing)：事件是另一种跨边界载荷——记"发生了什么"而不是"当前长什么样"，与 DTO 互补而非替代。

## 示例

Go 实现：外观暴露用例级方法，参数与返回值是 DTO，领域对象不越过边界。

```go
// facade/dto.go —— 边界载荷：扁平、只含用例需要的字段
package facade

import "time"

type PlaceOrderRequest struct {
	UserID    int64
	ItemID    int64
	Quantity  int
	PaymentID string
}

type PlaceOrderResponse struct {
	OrderID   int64
	PlacedAt  time.Time
	Charged   bool
	Message   string
}
```

```go
// facade/order.go —— 外观：一次调用一个用例，横切逻辑挂在这里
package facade

import (
	"context"
	"fmt"
)

type OrderFacade struct {
	orders    OrderRepo    // 领域层仓储，返回领域对象
	payments  PaymentClient
	inventory StockClient
}

// PlaceOrder 一个方法 = 一个业务用例 = 一个事务边界。
// 领域对象 Order 全程不出这个包，外面只见 DTO。
func (f *OrderFacade) PlaceOrder(ctx context.Context, req PlaceOrderRequest) (PlaceOrderResponse, error) {
	if err := f.payments.Charge(ctx, req.PaymentID, req.ItemID, req.Quantity); err != nil {
		return PlaceOrderResponse{}, fmt.Errorf("payment: %w", err)
	}
	order, err := f.orders.Place(ctx, req.UserID, req.ItemID, req.Quantity)
	if err != nil {
		f.payments.Refund(ctx, req.PaymentID) // 补偿，仍留在外观这一层
		return PlaceOrderResponse{}, err
	}
	return PlaceOrderResponse{ // 转换在边界做，按白名单取字段
		OrderID:  order.ID,
		PlacedAt: order.PlacedAt,
		Charged:  true,
		Message:  "ok",
	}, nil
}
```

Java 侧不必自己写：Spring MVC 的 `@RestController` 方法签名（`@RequestBody PlaceOrderRequest` 进、`Response` 出）就是远程外观的标准形态，EJB 时代的 Session Facade 是它的前身；gRPC/Protobuf 的 `message` 定义就是 DTO——`protoc` 生成的类天然扁平、带版本兼容规则。

## 接入时的三件小事

1. **方法按用例命名**：签名里出现 `setXxx`/`getXxx` 时先停下——细粒度正往回爬，问自己这个调用能不能合并成一个业务动作。
2. **DTO 单独定义，别直接用领域对象**：一次"图省事"会让 API 签名和内部模型焊死，之后每次重构都是破坏性变更。
3. **转换只在边界做一次**：外观或控制器里 DTO↔领域对象单点转换；转换逻辑散到多处，字段裁剪就再也没有单一事实源。

## 相关篇目

- [远程代理模式](/structural/remote-proxy)：跨进程的透明取向，与本篇的边界取向互为对照。
- [外观模式](/structural/facade)：进程内版本，同名意图的不同作用域。
- [仓储与单元工作](/other/repository)：外观编排的下层，DTO 不从仓储出来。
- [贫血模型](/anti-patterns/anemic-domain-model)：DTO 被误当领域模型时长成的样子。

## 来源

- [S5] Martin Fowler，《Patterns of Enterprise Application Architecture》，Addison-Wesley，2002。远程外观与数据传输对象的原始出处。
- [S13] Chris Richardson，《Microservices Patterns》，Manning，2018。API 契约与 DTO 在微服务边界的实践口径。
