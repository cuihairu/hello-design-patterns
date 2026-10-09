# 大泥球（Big Ball of Mud）

大泥球描述一个已经上线、能跑、但没有主线架构的系统：功能靠补丁摞上去，数据靠复制绕过去，没人能说清改一处会影响哪里。它出自 Foote 与 Yoder 在 PLoP 1997 的论文 [S8]，那篇论文的结论有点反直觉：多数系统最后都会变成这个样子，而且往往是因为这样交付最快。

## 形态

1. **没有可描述的结构**：问"这个系统分几层"，得到的回答是"按文件夹看吧"。
2. **重复是常态**：同一段业务逻辑在两三个地方各有一份拷贝，改一份忘两份。
3. **数据有多个真身**：同一批数据存在两张表加一份导出文件里，以哪份为准看时段。
4. **绕行通道比正门多**：为了不碰核心代码，新功能走旁路接口、定时任务、手工脚本。
5. **改动靠人肉记忆**：没人敢自动化回归，因为知道"有一处特判"，但说不出在哪。

论文里给的判断标准是结果导向的：结构不重要，能不能被理解、能不能被改才重要。一个没有分层但团队能快速改对的系统，不算大泥球；有分层图但每次改都要同步改五处的，算。

## 代价

- 上新需求的成本随时间线性上升：每个需求都要先花一半时间确认不会碰到别的地方。
- 修复引入新缺陷的比例高：没有回归保护，补丁之间的相互作用只能上线后发现。
- 关键人依赖：系统的不变式写在几个老员工脑子里，不在代码里。
- 改造预算越拖越大：越晚开始，越只能继续摞补丁。

## 成因

论文记录的路径基本一致：

1. **先交付再整理**：演示版直接当正式版用，临时方案变成永久结构。
2. **复用的诱惑**：为了省一次工，把新功能接到旧数据模型上，用视图和复制来遮掩不匹配。
3. **放弃整理**：改一处要动十处时，团队选择绕过去，结构进一步碎裂。
4. **无害的放任**：系统能跑，没人投诉，于是没人给"整理"立项。

## 走出来

论文给的策略是绞杀而非重写（Strangler 思路在后来的微服务实践里被反复引用 [S13]）：

1. **圈边界**：挑一条能独立运行的业务切片（一个页面、一条对账链路），把它的入口、数据、调用方列出来，其余不碰。
2. **立防腐**：新代码与旧代码之间只通过一个明确的接口往来，旧的字段命名不许渗进新层，这一层就是限界上下的雏形 [S11]。
3. **搬家不改逻辑**：先把逻辑原样搬进新结构，跑通并补上回归测试，再谈改写。搬家和改写混在一起会分不清回归是谁引入的。
4. **逐条切片收口**：每条切片独立可停，切片之间互不依赖，做到第三条就可以按季度停下来只维持。
5. **给"绕行通道"设到期日**：旁路接口与手工脚本登记造册，写明谁引入、什么时候删。

不建议的做法是一次性重写：大泥球里那些没写下来的特判，重写时会被当成 bug 修掉，然后上线才发现是需求。

## 示例

同一件事在泥球里的写法和在切片里的写法：

```python
# 泥球：三个入口各有一份对账逻辑，参数格式还不一样
def reconcile_web(user_id, date):
    rows = db.query(f"SELECT * FROM orders WHERE user={user_id} AND day='{date}'")
    paid = sum(r.amount for r in rows if r.status in ("paid", "refunded", "manual_ok"))
    ...

def reconcile_job(batch):           # 定时任务版本，状态判断多了一个分支
    ...
def reconcile_fix():                # 手工修复脚本，又是第三份
    ...
```

切片版把不变式收进一处，入口只负责取数：

```python
class Reconciliation:
    STATUSES = ("paid", "refunded", "manual_ok")

    def net_amount(self, orders) -> float:
        return sum(o.amount for o in orders if o.status in self.STATUSES)

def reconcile_web(user_id, date):
    return Reconciliation().net_amount(fetch_orders(user_id, date))

def reconcile_job(batch):
    return Reconciliation().net_amount(fetch_orders_batch(batch))
```

三个入口仍各取各的数，但"哪些状态算已结算"只有一份。先做这一层收口，再谈把取数方式统一。

## 相关篇目

- [神对象](/anti-patterns/god-object)：类级别的失控，常是系统级失控的一部分。
- [意面代码](/anti-patterns/spaghetti-code)：控制流层面的失控。
- [事件溯源](/other/event-sourcing)：当"以哪份数据为准"是主要痛点时，把变更历史作为真身是出路之一。

## 来源

- [S8] Brian Foote、Joseph Yoder，《Big Ball of Mud》，PLoP 1997。
- [S11] Eric Evans，《Domain-Driven Design》，2003，限界上下文与防腐层。
- [S13] Chris Richardson，《Microservices Patterns》，2018，绞杀式迁移的实践来源。
