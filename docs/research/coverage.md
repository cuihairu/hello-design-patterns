# 覆盖核对与差异表

核对口径：把权威书籍与文档的目录拆成条目，逐条对站内 `docs/` 下的文件；站内自己的三处交叉引用（简介、参考、侧栏与各目录导读）另做一致性核对。核对时间：2026-10-08。来源编号见[调研总览的来源清单](/research/overview#来源清单)。

## 表 1：GoF 23 个模式 × 站内覆盖

结论：23/23 全部有正文页，不需要补。

| 分类 | 模式与站内链接 | 覆盖 |
| --- | --- | --- |
| 创建型 5 | [抽象工厂](/creational/abstract-factory)、[建造者](/creational/builder)、[工厂方法](/creational/factory-method)、[原型](/creational/prototype)、[单例](/creational/singleton) | 5/5 |
| 结构型 7 | [适配器](/structural/adapter)、[桥接](/structural/bridge)、[组合](/structural/composite)、[装饰](/structural/decorator)、[外观](/structural/facade)、[享元](/structural/flyweight)、[代理](/structural/proxy) | 7/7 |
| 行为型 11 | [责任链](/behavioral/chain-of-responsibility)、[命令](/behavioral/command)、[解释器](/behavioral/interpreter)、[迭代器](/behavioral/iterator)、[中介者](/behavioral/mediator)、[备忘录](/behavioral/memento)、[观察者](/behavioral/observer)、[状态](/behavioral/state)、[策略](/behavioral/strategy)、[模板方法](/behavioral/template-method)、[访问者](/behavioral/visitor) | 11/11 |

GoF 之外站内另有的 24 个条目（多例、对象池、服务定位器、动态/保护/远程/虚拟代理、智能指针、双向桥接、依赖注入、回调、DSL、快照、并发 8 条、其他 4 条）不在本表，它们的取舍见表 2。

## 表 2：调研条目 × 站内缺口

### 2a. 本次补齐的 14 项缺口

| # | 缺口条目 | 来源 | 新篇 |
| --- | --- | --- | --- |
| 1 | 反模式方法论（坏味道—反模式—模式三层关系） | [S6][S7] | [反模式导读](/anti-patterns/overview) |
| 2 | 神对象（God Object） | [S6][S25] | [神对象](/anti-patterns/god-object) |
| 3 | 大泥球（Big Ball of Mud） | [S8] | [大泥球](/anti-patterns/big-ball-of-mud) |
| 4 | 金锤子（Golden Hammer） | [S7][S17] | [金锤子](/anti-patterns/golden-hammer) |
| 5 | 意面代码（Spaghetti Code） | [S7][S17] | [意面代码](/anti-patterns/spaghetti-code) |
| 6 | 贫血模型（Anemic Domain Model） | [S26][S5] | [贫血模型](/anti-patterns/anemic-domain-model) |
| 7 | 现代演进选题口径（GoF 之后模式往哪走） | [S2][S3] | [现代演进导读](/evolution/overview) |
| 8 | 组合优于继承 / 组合式设计 | [S1][S2][S22][S23] | [组合式设计](/evolution/composition-over-inheritance) |
| 9 | SOLID 五原则与依赖规则 | [S3][S4] | [SOLID 与依赖规则](/evolution/solid) |
| 10 | 熔断器（Circuit Breaker） | [S12] | [熔断器](/evolution/circuit-breaker) |
| 11 | 线程池（概览已声明、站内无页） | [S19] | [线程池](/concurrency/thread-pool) |
| 12 | 读写锁（概览已声明、站内无页） | [S19] | [读写锁](/concurrency/read-write-lock) |
| 13 | 工作窃取（概览已声明、站内无页） | [S19] | [工作窃取](/concurrency/work-stealing) |
| 14 | 事务脚本（概览已声明、站内无页） | [S5] | [事务脚本](/other/transaction-script) |

14 项缺口全部补齐，`gaps_filled = 14`。

### 2b. 调研到、本次不新增的条目

不新增的都写明理由，避免下次调研重复翻账。

| 条目 | 来源 | 处置与理由 |
| --- | --- | --- |
| 空对象（Null Object） | [S16] | 暂不收录。它等价于"返回空实现而不是 null"，站内空值处理没有专门场景，可与策略篇合并讲 |
| 仓储、单元工作 | [S5][S11] | 暂不收录。与 [ORM 篇](/other/orm)的数据映射一节边界没划清，先合写还是先拆开要定口径 |
| 活动记录、表网关、行数据网关 | [S5] | 已由 [ORM 篇](/other/orm)覆盖，不重复成篇 |
| 前端控制器、页面控制器、模板视图 | [S5] | 部分由 [MVC 篇](/other/mvc)覆盖，暂不单独成篇 |
| 远程外观、数据传输对象 | [S5] | 与[远程代理](/structural/remote-proxy)角度不同，暂不新增，记为候选 |
| 分层架构、管道-过滤器、黑板、微内核 | [S9] | 属架构风格而非对象级模式，需先定"架构风格与模式的边界"再开分区 |
| 半同步/半异步 | [S9] | 与[主动对象](/concurrency/active-object)重叠，暂不新增 |
| 隔舱、超时、重试、稳态 | [S12] | 稳定性模式一批补，本次只补应用最广的熔断器，其余 4 条列为下一批 |
| 消息通道、消息路由、消息转换、发布订阅 | [S10] | 需要先决定是否开"集成模式"分区 |
| 聚合、限界上下文、规格 | [S11] | 战略设计词汇，不在本仓"模式"口径内 |
| API 网关、服务发现、Saga、Sidecar | [S13][S15] | 分布式系统设计，不在现有口径内 |
| 类别对象、环境对象等纯社区条目 | [S18] | 无书籍出处，不收录 |

## 表 3：站内交叉引用不一致（6 处，已修订）

| # | 位置 | 问题 | 处置 |
| --- | --- | --- | --- |
| 1 | [参考资料](/reference) 智能指针条目 | 写成"智能指引模式" | 改为"智能指针模式" |
| 2 | [设计模式概览](/introduction) 行为型清单 | 漏列站内已有的 DSL 篇 | 补列 DSL 条目 |
| 3 | [并发模式导读](/concurrency/overview) | 未列线程池、读写锁、工作窃取 | 三条补进目录清单与选用建议 |
| 4 | [其他模式导读](/other/overview) | 未列事务脚本 | 补进目录清单 |
| 5 | [设计模式概览](/introduction) 结尾 | 没有反模式与现代演进的入口 | 补两个分区入口 |
| 6 | [参考资料](/reference) 站内索引 | 未收录反模式、现代演进、调研三组 | 索引补齐，并补 AntiPatterns、Release It!、DDD 等书目 |

另外一处一并处理：[快照模式](/behavioral/snapshot)页是合并到备忘录模式的跳转页，侧栏不收录，参考页保留指向，不做改动。

## 新增页面清单（19 篇）

模式缺口 14 篇见表 2a，另有调研 5 篇：

- [调研总览](/research/overview)：范围、方法、结论与 28 条来源清单
- [权威书籍与标准目录](/research/books)：15 本书逐本对照
- [官方与社区文档](/research/official-docs)：8 个官方文档与 3 个社区站点
- [应用场景与语言落地](/research/applications)：场景到 API 的对照表
- 本页：覆盖核对与差异表

## 核对与验收方式

1. 站内文件清单用 `git ls-files docs | grep '\.md$'` 取，不靠记忆。
2. 新增页面的站内链接一律写成绝对路径（`/分区/文件`），由 VitePress 的死链检查兜底：`npm run docs:build` 不通过视为未完成。
3. GoF 23 条逐条对过文件名，见表 1。
4. 引用的 API 名称以 Java SE、C++ Core Guidelines、Go、Vue、React 官方文档为准，见[官方与社区文档](/research/official-docs)。
5. 补完后文档总数 56 → 75，其中模式正文 47 → 61。
