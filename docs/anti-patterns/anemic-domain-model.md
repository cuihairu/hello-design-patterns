# 贫血模型（Anemic Domain Model）

贫血模型指数据和行为分了家：实体类只有字段与 getter/setter，业务规则写在一堆无状态的服务里，靠操作实体的字段完成业务。Martin 在 bliki 条目里把它命名为 Anemic Domain Model [S26]，并指出它实质上是退化回了过程式的事务脚本，只是外面套了一层对象的壳。

## 形态

1. **实体只有数据**：`Order` 类里全是 `getTotal()`、`setStatus()`，规则一个都没有。
2. **服务里全是流程**：`OrderService` 有几十个方法，每个方法按"取对象 → 改字段 → 存回去"的顺序写。
3. **校验分散**：同一个"金额不能为负"的规则出现在服务、控制器、DTO 转换三处。
4. **对象之间不对话**：对象是数据包，交互必须经过服务层，服务之间互相调用形成网。

判断线比"没有 getter"更实际：**业务不变式由谁保证**。有字段没约束、靠调用方记得先校验，就是贫血。

## 代价

- 规则不可复用：同一规则在多个服务里各写一遍，漏改一处就出现不一致的业务结果。
- 领域知识不在领域对象上：读 `OrderService` 要从头读到尾才知道下单规则，读 `Order` 什么都学不到。
- 测试要带服务与仓储：测"下单能不能退"要先准备仓储，而这个规则本可以在纯对象上测。
- 与事务脚本同源的复杂度：服务方法越长，回滚点和日志越多，[意面代码](/anti-patterns/spaghetti-code)的风险同步上升。

## 成因

1. **数据库先行**：先按表结构生成实体，表里没有的规则自然不在实体上。
2. **分层教条**：把"业务逻辑写在服务层"读成"业务逻辑只能写在服务层"。
3. **贫血工具的便利**：ORM 与 DTO 转换只要 getter/setter，写规则反而要多做映射。
4. **团队习惯**：从存储过程与脚本迁移过来的团队，天然把对象当记录用。

贫血模型不是错误的代名词。数据库表结构生成的实体、纯传输的数据袋，本来就没有规则可言；真正的问题是规则出现的位置与对象脱节。

## 什么情况下不用改

- 实体就是一张配置表或纯传输的数据袋，没有规则可言：保持贫血更省事。
- 规则本身就是"按步骤处理一批记录"，属于流程而非领域：放在[事务脚本](/other/transaction-script)里是对的，硬塞进对象反而要拆散流程。
- 团队与代码库已经统一按事务脚本组织，且没有出现规则重复：换风格的成本高于收益。

要改的信号是第二条：同一条规则开始在三个地方出现。

## 走出来

1. **挑一条最痛的规则**：把重复次数最多的那条（常见的有状态流转、金额计算、配额判断）找出来，列它现在散在哪些地方。
2. **搬进对象**：把这条规则改成实体的方法或受控的状态变更，字段不再对外可写，服务层只调方法。
3. **服务退到编排位**：服务保留事务边界、外部调用与跨聚合的协调，不碰单个对象的内部字段。
4. **校验收口**：新建对象时就在构造函数里校验，做不到就提供工厂方法，见[工厂方法](/creational/factory-method)。
5. **按聚合止步**：不必把整个模型都变富，一条聚合一条聚合地搬，搬完一条就能单独验收。

判断做没做到位的标准：写一个不连数据库的测试，能不能把这条业务规则测完。

## 示例

贫血：规则在服务里，实体只提供存取。

```java
class Order {                       // 只有字段
    private String status;
    private double amount;
    public String getStatus() { return status; }
    public void setStatus(String s) { this.status = s; }
    public double getAmount() { return amount; }
    public void setAmount(double a) { this.amount = a; }
}

class OrderService {
    private final OrderRepository repo;

    public void confirm(Order order) {
        if (!"PAID".equals(order.getStatus())) {     // 规则写在服务里
            throw new IllegalStateException("未支付不能发货");
        }
        if (order.getAmount() <= 0) {                // 第二处校验，别处还要再来一遍
            throw new IllegalStateException("金额非法");
        }
        order.setStatus("SHIPPED");
        repo.save(order);
    }
}
```

改后：状态与规则在同一个类里，字段不可外部改写，服务只做编排。

```java
class Order {
    private Status status;
    private final double amount;

    Order(double amount) {
        if (amount <= 0) { throw new IllegalArgumentException("金额必须为正"); }
        this.amount = amount;
        this.status = Status.PAID;
    }

    void ship() {
        if (status != Status.PAID) { throw new IllegalStateException("未支付不能发货"); }
        this.status = Status.SHIPPED;                 // 变更只在这里发生
    }

    Status status() { return status; }
    double amount() { return amount; }
}

class OrderService {
    private final OrderRepository repo;

    public void confirm(long orderId) {
        Order order = repo.find(orderId);
        order.ship();                                 // 规则判断在 Order 内部
        repo.save(order);
    }
}
```

测试可以直接 `new Order(100)` 然后断言 `ship()` 的行为，不需要仓储与服务。

## 相关篇目

- [事务脚本](/other/transaction-script)：贫血模型的过程式内核，两者对照读。
- [工厂方法](/creational/factory-method)、[建造者](/creational/builder)：把"构造即校验"落地的两种入口。
- [神对象](/anti-patterns/god-object)：另一极，规则全塞进一个类。
- [ORM](/other/orm)：数据库映射与领域对象的关系，贫血常由映射层的便利造成。

## 来源

- [S26] martinfowler.com bliki：Anemic Domain Model。
- [S5] Martin Fowler，《Patterns of Enterprise Application Architecture》，2002，领域逻辑四式。
