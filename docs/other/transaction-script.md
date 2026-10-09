# 事务脚本模式（Transaction Script）

事务脚本把一个业务流程写成一个过程式的处理函数：读数据、按流程改、写回，每步都在一个数据库事务里。它是《企业应用架构模式》领域逻辑四式中最简单的一种 [S5]，和另外三式（领域模型、表模块、活动记录）的选择依据是流程有多少条不变式、多少分支。

## 结构

```
请求 → 控制器 → 事务脚本函数
                   ├─ 查数据（表映射或 SQL）
                   ├─ 按顺序改数据、算金额、校验规则
                   └─ 一次提交，失败整体回滚
```

三个组成部分：

1. **脚本函数**：一个入口对应一个业务操作（下单、退款、对账），函数体内是线性步骤。
2. **表映射**：脚本直接读写行或简单对象，不构建对象图，见[ORM](/other/orm)。
3. **事务边界**：函数开头开事务，结尾提交，异常回滚。

## 适用与不适用

**适用**（[S5] 的判据与实践一致）：

- 流程是线性的，规则随流程走，没有对象之间来回协商；
- 操作基本一一对应数据库表，读改写的顺序与表结构吻合；
- 每个操作独立，彼此不共享复杂的中间状态。

**不适用**：

- 规则在多个操作之间重复出现（"金额不能为负"在下单、退款、改价里各写一遍）——这是[贫血模型](/anti-patterns/anemic-domain-model)的起点；
- 对象之间有协作（订单要通知库存、扣券、记账），流程越写越长，滑向[意面代码](/anti-patterns/spaghetti-code)；
- 需要回放、审计单条变更的历史，事务脚本只记最后状态，见[事件溯源](/other/event-sourcing)。

判断线：数一下同一条规则在几个脚本里出现。一次是脚本，两次要警觉，三次该搬进领域对象。

## 示例

Java：一个退款流程，事务边界在方法上，规则都在函数里。

```java
@Service
public class RefundScript {
    private final JdbcTemplate jdbc;

    @Transactional
    public RefundResult refund(long orderId, long amount) {
        Map<String, Object> order = jdbc.queryForMap(
                "SELECT status, paid_amount FROM orders WHERE id = ?", orderId);

        if (!"PAID".equals(order.get("status"))) {
            throw new IllegalStateException("只有已支付订单能退款");
        }
        long paid = (Long) order.get("paid_amount");
        if (amount <= 0 || amount > paid) {          // 规则一：金额边界
            throw new IllegalArgumentException("退款金额非法");
        }
        jdbc.update("UPDATE orders SET status = 'REFUNDED', paid_amount = paid_amount - ? WHERE id = ?",
                amount, orderId);                    // 规则二：状态与金额一起改
        jdbc.update("INSERT INTO refund_events (order_id, amount) VALUES (?, ?)",
                orderId, amount);
        return new RefundResult(orderId, paid - amount);
    }
}
```

对比富领域对象的写法：规则进 `Order.refund(amount)`，脚本退成"取对象 → 调方法 → 存回"，见[贫血模型](/anti-patterns/anemic-domain-model)的改造示例。两种都能跑，区别在规则出现在哪里、被几处共用。

## 与相关条目的关系

- **贫血模型是它的对象化外壳**：把脚本搬进服务、把数据放进实体，流程仍然是线性的，只是多了一层搬运 [S26]。
- **领域模型是它的替代方案**：当规则数量超过流程步骤数量时切换，切换方式见[贫血模型](/anti-patterns/anemic-domain-model)的"走出来的顺序"。
- **[命令模式](/behavioral/command)**：脚本函数封装成对象后，撤销、重放、审计都不用改函数体。
- **[事件溯源](/other/event-sourcing)**：脚本只提交最终状态，事件溯源把每一步变更记下来，两者对"审计"的强度不同。

## 成本

脚本式的账要算清：单个函数几百行之前都划算，超过之后每条规则的查找成本随脚本数平方增长（要在 N 个脚本里搜同一规则）。切换到领域模型的触发点就是这个交叉点，不是代码行数。

## 相关篇目

- [贫血模型](/anti-patterns/anemic-domain-model)：同一份流程的两种归置方式。
- [ORM](/other/orm)：脚本读写数据的映射层。
- [MVC](/other/mvc)：脚本通常由控制器调用，控制器本身不放规则。
- [事务与并发](/concurrency/read-write-lock)：脚本的事务边界与行锁、乐观锁的关系。
- [事件溯源](/other/event-sourcing)：需要变更历史时的另一条路。

## 来源

- [S5] Martin Fowler，《Patterns of Enterprise Application Architecture》，2002，领域逻辑一章。
- [S26] martinfowler.com bliki，Anemic Domain Model。
