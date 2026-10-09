# 意面代码（Spaghetti Code）

意面代码指控制流失去结构：逻辑靠层层跳转、共享变量和隐式顺序串起来，读的时候要靠人肉模拟执行才能知道某一行会不会被执行到。它是 AntiPatterns 里架构类的一条 [S7]，也是新手代码与"先跑起来再说"的代码最常落的形态。

## 形态

1. **函数长度失控**：单个函数几百行，中间夹着七八处 `return` 与若干个跳到函数外的跳出标记。
2. **状态散落**：判断依赖的变量来自参数、成员字段、全局变量和上一次调用的残留，四者之一变了，行为就变。
3. **顺序敏感**：必须先调 A 再调 B，调换就出错，而这个顺序只写在某次提交的注释里。
4. **异常被吞**：`catch` 块里只有一句注释或一句打日志，错误继续往上冒变成"偶发问题"。
5. **测试靠点**：自动化用例覆盖不到主流程，回归靠人点界面。

## 代价

- 阅读成本远高于编写成本：一个 300 行的函数，新人要看半小时，改 5 行要重新看一遍。
- 改动无法局部化：没有一处能被称为"这段逻辑的边界"，回归范围只能按模块估。
- 并发下必炸：共享的可变状态多，加锁时只能整函数锁住，吞吐掉下去；漏锁就出竞态。
- 排查依赖日志：问题复现要看现场日志，因为代码本身无法静态读出执行路径。

## 成因

1. **调试式编写**：先写一半，边跑边加 `if`，把分支当作调试开关。
2. **复制式扩展**：从另一处复制一段改几行，两段的边界条件从此各走各的。
3. **不敢动的重构**：没有测试保护时，改结构的风险高于加分支，于是结构越来越差。
4. **过早的性能手**：把优化后的内联写法当默认写法，可读性换来的收益没有度量。

## 走出来

能一次做完的用手法，动不了的用顺序：

1. **先立测试**：挑最核心的一条路径，用端到端用例把现有行为钉住（包括那些看起来像 bug 的行为）。没有这一步，后面每一步都是盲改。
2. **拆长函数**：按"做一件事"切成私有方法，不改任何逻辑，只改结构。切完看参数列表，参数超过三个说明有一组数据该聚成结构体。
3. **收状态**：把散落的可变变量收进结构体，或收进一个显式的上下文对象，函数只读它。
4. **把顺序写下来**：多步流程抽成一个方法里的顺序调用，或用[责任链](/behavioral/chain-of-responsibility)显式表达，谁先谁后在类型上看得见。
5. **错误路径显式化**：能返回错误就返回错误，不靠全局标志位；跨层的错误统一走一层，取消与中断的语义参考[命令模式](/behavioral/command)。

第 1 步没做完之前不要开始第 2 步，否则重构引入的回归无法区分。

## 示例

反面：一段靠共享标志和隐式顺序推进的下单流程。

```python
_ok = False            # 模块级可变状态，谁都能改
_orders = []

def process(order):
    global _ok
    try:
        reserve(order)                 # 占库存
        _ok = True
    except Exception:
        _ok = False
    if _ok:
        charge(order)                  # 扣款，失败不回滚库存
        _ok = True
    if _ok:
        _orders.append(order)          # 落单
        notify(order)
    # reserve 失败后 charge 的分支不会走，但 charge 失败后 notify 会走：
    # 扣款失败也发货，这类问题只能靠线上发现
```

重构后：状态收进一个对象，顺序写在一处，失败分支显式返回。

```python
@dataclass
class OrderResult:
    ok: bool
    reason: str = ""

class OrderProcessor:
    def process(self, order) -> OrderResult:
        if not self.inventory.reserve(order):
            return OrderResult(False, "库存不足")
        if not self.payments.charge(order):
            self.inventory.release(order)      # 失败路径补回占掉的库存
            return OrderResult(False, "扣款失败")
        self.store.save(order)
        return OrderResult(True)
```

每一步失败都显式返回，逆操作写在失败处，流程顺序只在一个方法里。测试可以直接对 `OrderProcessor` 注入假的 `inventory` 与 `payments`。

## 相关篇目

- [策略模式](/behavioral/strategy)：把嵌套的条件分支抽成可替换的算法对象，是拆意面最常用的一刀。
- [命令模式](/behavioral/command)：把"做什么"封装成对象后，撤销、重试、日志都能挂上去。
- [模板方法模式](/behavioral/template-method)：多步流程的骨架固定下来，步骤各自可测。
- [大泥球](/anti-patterns/big-ball-of-mud)：单个函数的失控和整个系统的失控。

## 来源

- [S7] Brown 等，《AntiPatterns》，Wiley，1998，Spaghetti Code 条目。
- [S17] SourceMaking 的对应条目，形态段落参照。
- [S6] 《Refactoring》第 2 版，过长函数与重复代码的重构手法。
