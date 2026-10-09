# 覆盖核对与差异表

核对口径：把权威书籍与文档的目录拆成条目，逐条对站内 `docs/` 下的文件；站内自己的三处交叉引用（简介、参考、侧栏与各目录导读）另做一致性核对。核对时间：2026-10-08。来源编号见[调研总览的来源清单](/research/overview#来源清单)。

## 表 1：GoF 23 个模式 × 站内覆盖

结论：23/23 全部有正文页，不需要补。

| 分类 | 模式与站内链接 | 覆盖 |
| --- | --- | --- |
| 创建型 5 | [抽象工厂](/creational/abstract-factory)、[建造者](/creational/builder)、[工厂方法](/creational/factory-method)、[原型](/creational/prototype)、[单例](/creational/singleton) | 5/5 |
| 结构型 7 | [适配器](/structural/adapter)、[桥接](/structural/bridge)、[组合](/structural/composite)、[装饰](/structural/decorator)、[外观](/structural/facade)、[享元](/structural/flyweight)、[代理](/structural/proxy) | 7/7 |
| 行为型 11 | [责任链](/behavioral/chain-of-responsibility)、[命令](/behavioral/command)、[解释器](/behavioral/interpreter)、[迭代器](/behavioral/iterator)、[中介者](/behavioral/mediator)、[备忘录](/behavioral/memento)、[观察者](/behavioral/observer)、[状态](/behavioral/state)、[策略](/behavioral/strategy)、[模板方法](/behavioral/template-method)、[访问者](/behavioral/visitor) | 11/11 |

GoF 之外站内另有的 24 个条目（多例、对象池、服务定位器、动态/保护/远程/虚拟代理、智能指针、双向桥接、依赖注入、回调、DSL、快照、并发 8 条、其他 4 条）不在本表，它们的取舍见表 2。2026-10-10 增量又收稳定性三条与仓储一条，取舍见表 2c。

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
| 空对象（Null Object） | [S16] | 已按口径并入[策略模式](/behavioral/strategy)一节（2026-10-10），不单开一篇 |
| 仓储、单元工作 | [S5][S11] | 已于 2026-10-10 补齐（见表 2c），口径：仓储=聚合根↔持久化的领域层接口，ORM 管表↔对象映射 |
| 活动记录、表网关、行数据网关 | [S5] | 已由 [ORM 篇](/other/orm)覆盖，不重复成篇 |
| 前端控制器、页面控制器、模板视图 | [S5] | 部分由 [MVC 篇](/other/mvc)覆盖，暂不单独成篇 |
| 远程外观、数据传输对象 | [S5] | 与[远程代理](/structural/remote-proxy)角度不同，暂不新增，记为候选 |
| 分层架构、管道-过滤器、黑板、微内核 | [S9] | 维持不收录（口径已定，2026-10-10）：组件级协作、可独立实现并被框架标准化落地的模式收；约束全系统拓扑的架构风格不收，判据记于[知识页核心概念](/knowledge) |
| 半同步/半异步 | [S9] | 与[主动对象](/concurrency/active-object)重叠，暂不新增 |
| 隔舱、超时、重试、稳态 | [S12] | 隔舱、超时、重试已于 2026-10-10 补齐（见表 2c）；稳态属容量纪律而非可封装模式，不单独成篇 |
| 消息通道、消息路由、消息转换、发布订阅 | [S10] | 已于 2026-10-10 开「集成模式」分区收录（见表 2c） |
| 聚合、限界上下文、规格 | [S11] | 战略设计词汇，不在本仓"模式"口径内 |
| API 网关、服务发现、Saga、Sidecar | [S13][S15] | 分布式系统设计，不在现有口径内 |
| 类别对象、环境对象等纯社区条目 | [S18] | 无书籍出处，不收录 |

### 2c. 2026-10-10 增量

表 2b 里稳定性模式一行按下表落地：

| 条目 | 来源 | 新篇 |
| --- | --- | --- |
| 隔舱（Bulkhead） | [S12] | [隔舱](/evolution/bulkhead) |
| 超时（Timeout） | [S12] | [超时](/evolution/timeout) |
| 重试（Retry） | [S12] | [重试](/evolution/retry) |
| 稳态（Steady State） | [S12] | 不单独成篇。它讲"每个可消耗的资源都要有补充机制"，是容量与降级的运维纪律，不是可封装的对象级模式 |

补齐后文档总数 75 → 78，模式正文 61 → 64。

2026-10-10 同日再补一项：

| 条目 | 来源 | 新篇 |
| --- | --- | --- |
| 仓储、单元工作 | [S5][S11] | [仓储与单元工作](/other/repository) |

口径：仓储=聚合根↔持久化的领域层接口（接口在领域层、实现落基础设施层），ORM 管表↔对象映射。补齐后文档总数 78 → 79，模式正文 64 → 65。

2026-10-10 集成模式分区落成：

| 条目 | 来源 | 新篇 |
| --- | --- | --- |
| 集成模式选题口径（EIP 分区） | [S10] | [集成模式导读](/integration/overview) |
| 消息通道（Message Channel） | [S10] | [消息通道](/integration/message-channel) |
| 消息路由（Message Router） | [S10] | [消息路由](/integration/message-router) |
| 消息转换（Message Translator） | [S10] | [消息转换](/integration/message-translator) |
| 发布订阅（Publish-Subscribe） | [S10] | [发布订阅](/integration/publish-subscribe) |

分区判据：EIP [S10] 出处；Spring Integration 与 Apache Camel 双框架落地满足共识口径；各条目是组件级协作（可独立实现、可替换），不是全系统拓扑。补齐后文档总数 79 → 84，模式正文 65 → 69。

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
