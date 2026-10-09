# 神对象（God Object）

神对象是一个类拿走了系统里过多的状态与决策：它知道自己该做什么，也知道别人该做什么，所有对象都持有它的引用。也叫神类、中心对象（Central Object）[S25]。

## 形态

出现下面四条里的三条就该起疑：

1. 单个类的字段数明显超出它负责的领域。经验线是 20 个以上实例字段，或者一个类写满三四个屏还没写完。
2. 系统里大半对象都能通过某个字段拿到它，反向也成立：改动它要通知一串对象。
3. 它的方法按"给谁用"分组，一组给 UI、一组给数据库、一组给日志，彼此共用同一批字段。
4. 单测它必须先构造出半个系统。mock 掉的依赖比被测逻辑还多，测试通过不代表逻辑正确。

## 代价

- 改动扇出大：加一个字段要在所有读写它的分支上重新检查一致性，回归范围跟着类的引用数走。
- 锁粒度被它绑死：字段多到一定程度只能整对象加锁，串行化掉本来可以并行的调用。
- 测试成本高：构造一次要准备网络、时钟、配置三类替身，测试代码比业务代码长。
- 合并冲突集中：多人改同一个类，冲突文件永远是它。

## 成因

多数神对象不是一次写出来的，常见三条路径：

1. **"先放这里，以后再拆"**：临时状态找不到归属，就近塞进最像样的那个类。
2. **事务脚本上位**：业务流程越写越长，流程里的中间量都挂在流程持有者身上，见[事务脚本](/other/transaction-script)。
3. **上帝视角的领域类**：把"领域模型要承载业务"理解成"一个模型承载全部业务"，与[贫血模型](/anti-patterns/anemic-domain-model)互为两极。

## 走出来

按这个顺序拆，每一步之后都能提交一次，不必等全部拆完：

1. **切断新增**：新字段一律不准再进这个类，改放哪里由下一个步骤定。
2. **按不变式分组**：把字段按"必须一起改才成立"分成几组，组内有不变式的才留在一起。
3. **搬走不看它的组**：把只被外部调用、不读其他字段的那一组方法整体搬成新类，原类持引用并转发。这一步风险最低，先做。
4. **反转依赖**：剩下的核心状态由它持有，需要它的对象改成通过接口拿，不再全域持有引用。
5. **拆引用**：等外部只剩两三个调用方时，把公共引用改成参数传递或事件通知。

拆到"单测只需要它自己加一个替身"就可以停，不必强求每个方法都搬走。

## 示例

反面：一个 `OrderSystem` 类同时管订单、库存、消息和统计。

```java
class OrderSystem {
    private final Map<String, Integer> inventory = new HashMap<>();
    private final List<String> auditLog = new ArrayList<>();
    private int todayOrders;
    private String notificationChannel;

    // 订单、库存、通知、统计四件事都塞在这一个类里
    public void placeOrder(String sku, int qty) {
        int left = inventory.getOrDefault(sku, 0) - qty;
        if (left < 0) { throw new IllegalStateException("库存不足"); }
        inventory.put(sku, left);
        auditLog.add("order:" + sku + ":" + qty);
        todayOrders++;
        notifyUser("已下单 " + sku);          // 这里又调了自己的通知方法
    }

    private void notifyUser(String msg) {
        auditLog.add("notify:" + notificationChannel + ":" + msg);
    }

    public int getTodayOrders() { return todayOrders; }
}
```

拆后的形状：库存不变式归 `Inventory`，通知归 `Notifier`，订单流程只负责编排。

```java
class OrderService {
    private final Inventory inventory;
    private final Notifier notifier;
    private final OrderMetrics metrics;

    OrderService(Inventory inventory, Notifier notifier, OrderMetrics metrics) {
        this.inventory = inventory;
        this.notifier = notifier;
        this.metrics = metrics;
    }

    public void placeOrder(String sku, int qty) {
        inventory.reserve(sku, qty);   // 库存不足会抛异常，不变式在 Inventory 内部
        metrics.recordOrder();
        notifier.orderPlaced(sku, qty);
    }
}
```

三个依赖都能单独构造，`OrderService` 的单测不再碰数据库和消息通道。

## 相关篇目

- [外观模式](/structural/facade)：外观也集中入口，但它只转发调用、不持状态，这是与神对象的分界。
- [中介者模式](/behavioral/mediator)：把对象间的互相引用收进中介者，中介者可以只管消息、不管数据。
- [事务脚本](/other/transaction-script)、[贫血模型](/anti-patterns/anemic-domain-model)：同一族问题的两个侧面。
- [大泥球](/anti-patterns/big-ball-of-mud)：单类层面的失控和系统层面的失控。

## 来源

- [S6] 《Refactoring》第 2 版的"过大类"、"过多实例变量"坏味道。
- [S25] Wikipedia 的 God object 词条，别名与形态描述。
