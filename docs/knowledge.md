# 知识点整理

调研五篇回答了「权威来源讲了什么、站内覆盖了多少、差异怎么处置」（见[调研总览](/research/overview)）。这一页把取证之后的结论收拢成一张知识点网，来源编号沿用[调研总览的来源清单](/research/overview#来源清单)的 S1–S28，想知道一条结论怎么查出来的，走条目里的链接回调研原文或站内落点页。

## 核心概念

### GoF 23 是基准线，不是边界

23 个模式站内全部有正文页（创建型 5、结构型 7、行为型 11），覆盖核对 23/23。站内另收 GoF 没有的条目 24 个：多例、对象池、服务定位器、四个代理变体、智能指针、依赖注入，加上并发与特定领域两组。调研之后边界也划清了：聚合、限界上下文属于战略设计词汇，API 网关、Saga 属于分布式系统设计，都不在「对象级模式」的口径里，逐条理由记在[覆盖核对与差异表](/research/coverage)（来源：[权威书籍与标准目录调研](/research/books)，[S1]）。

### 坏味道、反模式、模式是三层关系

《重构》第 2 版的坏味道目录（过长函数、霰弹式修改、依恋情节）是代码层依据，AntiPatterns 与 Big Ball of Mud 给出架构与项目层的条目，模式是走出来的路。反模式篇按「形态、成因、代价、怎么走出来」四段写，段落结构沿用 SourceMaking 的条目骨架（[S6][S7][S17]）。

### SOLID 的出处链要认 2002 年那本

五原则首见于 Martin 2002 年的《Agile Software Development: Principles, Patterns, and Practices》[S4]，Clean Architecture [S3] 把它归纳进依赖规则。站内只在[SOLID 与依赖规则](/evolution/solid)里讲依赖方向，架构分层与组件级三原则暂不单独成篇，理由是与「模式」口径的边界要先立住（来源：[权威书籍调研](/research/books) §3）。

### 组合优于继承在 Go 和前端是语言默认

Go 没有继承，复用靠结构体嵌入加小接口；Vue 组合式 API 把同一功能的逻辑、状态、生命周期收进一个函数，React 用组件嵌套加自定义 Hook 收口。三处是同一原则在不同平台上的落地，都写在[组合式设计](/evolution/composition-over-inheritance)（[S21][S22][S23]）。

### 稳定性模式从 Release It! 来，熔断器应用面最广

熔断器同时服务限流、降级、故障隔离三个场景，现在是网关与 RPC 客户端的标配：Resilience4j、Polly、Sentinel 的熔断器是同一个模型——统计窗口内失败率超阈值就直接失败，不再打下游。隔舱、超时、重试、稳态四条列为下一批，与熔断器同源 [S12]。

### 有些模式在有的语言里根本不用写

策略在 Java 传 `Function`、C++ 传 `std::function` 或模板参数、TypeScript 传函数属性，四者都不需要为每个算法建子类。观察者在浏览器里就是 `EventTarget` 的 `addEventListener` [S28]，动态代理在 JavaScript 里是语言内置的 `Proxy` 对象。语言吃掉模式是常态，正文示例按语言习惯写，不硬造类图（来源：[应用场景与语言落地](/research/applications)）。

## 权威书籍要点

15 本书的逐本对照在[权威书籍与标准目录调研](/research/books)，这里是收拢后的定位表：

| 书 | 作者 / 出版 | 对应知识点 |
| --- | --- | --- |
| Design Patterns（GoF）[S1] | Gamma 等，Addison-Wesley，1994 | 23 模式基准线，创建型 5、结构型 7、行为型 11 |
| Head First 设计模式（第 2 版）[S2] | Freeman 等，O'Reilly，2020 | 案例教学顺序；观察者章讲开闭原则，第 2 版加 Lambda 写法 |
| Clean Architecture [S3] | Robert C. Martin，2017 | SOLID、依赖规则、组件级三原则 |
| Agile SW Development [S4] | Robert C. Martin，2002 | SOLID 的原始出处 |
| Patterns of Enterprise Application Architecture [S5] | Martin Fowler，2002 | 事务脚本、活动记录、数据映射器、仓储、单元工作；领域逻辑四式与数据源四式的分层 |
| Refactoring（第 2 版）[S6] | Martin Fowler，2018 | 坏味道目录，反模式篇的代码层依据 |
| AntiPatterns [S7] | Brown 等，Wiley，1998 | 金锤子、意面代码的出处 |
| Big Ball of Mud [S8] | Foote、Yoder，PLoP 1997 | 大泥球的原始论文 |
| POSA 卷 1、卷 2 [S9] | Buschmann 等，Wiley | 分层、管道-过滤器、反应器、主动器、主动对象 |
| Enterprise Integration Patterns [S10] | Hohpe、Woolf，2002 | 消息通道、路由、转换；是否开「集成模式」分区待定 |
| Domain-Driven Design [S11] | Eric Evans，2003 | 战略设计词汇，本仓不收，理由见差异表 |
| Release It!（第 2 版）[S12] | Nygard，2018 | 熔断器、隔舱、超时、重试、稳态 |
| Microservices Patterns [S13] | Richardson，2018 | API 网关、Saga、事件溯源的选题来源 |
| Refactoring to Patterns [S14] | Kerievsky，2004 | 从坏味道到模式的演进路径 |
| Kubernetes Patterns [S15] | Ibryam、Huß，2019 | 容器平台模式，选题来源 |

两本给过额外要求：Head First 的单例代价讨论（全局状态、测试困难、序列化与反射破坏）由[神对象](/anti-patterns/god-object)与[金锤子](/anti-patterns/golden-hammer)承接反面视角；PoEAA 的领域逻辑四式里只有事务脚本此前缺页，本次补成[事务脚本](/other/transaction-script)并与[贫血模型](/anti-patterns/anemic-domain-model)对照，数据源四式由 [ORM 篇](/other/orm)覆盖，不重复成篇。

## 官方文档要点

8 个官方文档与 3 个社区站点的核对在[官方与社区文档调研](/research/official-docs)，口径要点收拢如下，入口链接按调研清单登记的官方域名挂出：

| 来源 | 入口 | 要点 |
| --- | --- | --- |
| Java SE `java.util.concurrent` [S19] | [docs.oracle.com](https://docs.oracle.com/) | 并发篇术语基准；`Future.get()` 是阻塞取值，组合与回调要 `CompletableFuture`；`Semaphore` 的 `acquire` 可被中断，拿到许可后才 `release` |
| C++ Core Guidelines [S20] | [isocpp.github.io](https://isocpp.github.io/CppCoreGuidelines/) | 资源用 RAII 表达；`unique_ptr`/`shared_ptr` 参数传递按 R.30/R.31；站内示例按「值传递 + 移动」写 |
| Go 官方文档 [S21] | [go.dev](https://go.dev/) | 无继承，接口隐式实现加结构体嵌入；`context.Context` 当第一参数传超时与取消；pipeline 的 `close`、`range`、`select` 写法以官方博客为准 |
| Vue.js 文档 [S22] | [vuejs.org](https://vuejs.org/) | 组合式 API：逻辑复用靠函数返回值组合，不靠 mixin |
| React 文档 [S23] | [react.dev](https://react.dev/) | 组件嵌套 + props 组合，状态提升，重复逻辑用自定义 Hook 收口 |
| .NET 设计指南 [S24] | [learn.microsoft.com](https://learn.microsoft.com/) | 依赖走构造函数注入，扩展点用接口不用虚方法基类 |
| Spring 文档 [S27] | [docs.spring.io](https://docs.spring.io/) | 控制反转是容器负责组装；与[服务定位器](/creational/service-locator)的区别在谁发起装配 |
| MDN [S28] | [developer.mozilla.org](https://developer.mozilla.org/) | `Proxy`、迭代器协议、`EventTarget` 是前端三个语言内置的模式落点 |
| Refactoring.Guru [S16] | [refactoring.guru](https://refactoring.guru/) | 三分法与代理四变体的命名一致；空对象它收、本仓暂不收 |
| SourceMaking [S17] | [sourcemaking.com](https://sourcemaking.com/) | 反模式四段式骨架的出处 |
| iluwatar/java-design-patterns [S18] | [github.com](https://github.com/iluwatar/java-design-patterns) | 收录取舍以「有没有书籍出处」为准：熔断有（Release It!），类别对象、环境对象这类纯社区条目不收 |

## 应用场景

场景到模式的完整对照表在[应用场景与语言落地](/research/applications)，六组场景的骨架：

| 场景 | 代表模式 | 落地形态 |
| --- | --- | --- |
| 对象创建与装配 | 抽象工厂、建造者、单例、对象池 | Java/C# 由容器装配，Go 写在 `main` 里 |
| 接口适配与访问控制 | 适配器、外观、代理四变体、装饰 | Java `java.lang.reflect.Proxy`、JS `Proxy`、C++ 包装类 |
| 行为与流程 | 策略、模板方法、观察者、责任链、状态、访问者 | 中间件栈是责任链在 Web 框架的形态 |
| 并发与异步 | 线程池、读写锁、工作窃取、生产者-消费者、Future | 术语以 j.u.c 文档为准 |
| 数据与分层 | ORM、事务脚本、事件溯源、MVC/MVVM | 事件溯源记过程，备忘录记瞬间 |
| 分布式与云上 | 熔断器 | Resilience4j、Polly、Sentinel 同一模型 |

多语言落地四条约定：多态按语言习惯写（Java/C# 接口、C++ 抽象类、Go 小接口加嵌入）；复用逻辑统一改写成组合；单例的代价 Java/C# 最明显，Go 包级变量可测性同样差；线程模型决定并发篇示例（Java 线程池、C++ `std::jthread` 加 `std::stop_token`、Go goroutine 加 channel）。

## 常见坑与误区

| 坑 | 事实 | 展开页 |
| --- | --- | --- |
| `Future` 当异步组合用 | `Future.get()` 阻塞，组合与回调要 `CompletableFuture` | [Future 模式](/concurrency/future) |
| `Semaphore` 先 release 后 acquire | `acquire` 可被中断，许可必须在持有后才释放，顺序反了等于没限制 | [信号量模式](/concurrency/semaphore) |
| C++ 手写自赋值判断 | 旧版写法已被 copy-and-swap 取代，与 Guidelines 的资源管理意图一致 | [智能指针模式](/structural/smart-pointer) |
| 跨语言硬译模式 | Go 的模板方法没有抽象类，用接口加嵌入表达同一骨架，照搬 Java 类图写不成立 | [模板方法模式](/behavioral/template-method) |
| C++ 手写双分派表 | 惯用 `std::variant` 加 `std::visit`，分支交给标准库 | [访问者模式](/behavioral/visitor) |
| 前端示例写旧范式 | Vue 2 选项式与 React class 组件不写，统一组合式 API 与函数组件 | [组合式设计](/evolution/composition-over-inheritance) |

## 覆盖核对结论

逐条核对表在[覆盖核对与差异表](/research/coverage)，数字收拢：

- GoF 23/23 全部有正文页，不需要补。
- 调研得出缺口 14 项，全部补成新篇：反模式 6、现代演进 4、并发 3（线程池、读写锁、工作窃取，概览早已声明但缺页）、其他 1（事务脚本）。
- 调研到但本次不新增 12 项，每项都写了理由：仓储与单元工作卡在与 ORM 篇的边界，分层与管道-过滤器属架构风格需先定口径，聚合与限界上下文不在「模式」口径内，稳定性模式其余四条与熔断器同批补。
- 站内交叉引用不一致 6 处，随本次修订（智能指针条目错字、概览漏列 DSL 与并发三篇、参考页索引缺三组书目）。
- 站内 Markdown 从 56 篇增到 75 篇，模式正文 47 → 61。

## 来源与口径

- 来源编号 S1–S28 的完整清单在[调研总览](/research/overview#来源清单)，书籍出版信息以该清单为准，改版时同步更新。
- 核对方法：书目目录拆条目，逐条对 `docs/` 下的文件；判定只有三档——有正文页、声明未落地、缺口。核对时间 2026-10-08。
- 验收方式：站内链接一律绝对路径，`npm run docs:build` 的死链检查兜底。

## 参考资料

- [调研总览](/research/overview)——范围、方法、结论与 28 条来源清单
- [权威书籍与标准目录](/research/books)——15 本书逐本对照
- [官方与社区文档](/research/official-docs)——8 个官方文档与 3 个社区站点
- [应用场景与语言落地](/research/applications)——场景到 API 的对照表
- [覆盖核对与差异表](/research/coverage)——三张表：覆盖、缺口、交叉引用修订
