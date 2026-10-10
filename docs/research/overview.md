# 调研总览

这一页说明三件事：调研了哪些资料、怎么核对站内覆盖、核对出了什么差异。分述见[权威书籍与标准目录](/research/books)、[官方与社区文档](/research/official-docs)、[应用场景与语言落地](/research/applications)，逐条核对结果见[覆盖核对与差异表](/research/coverage)。

## 调研范围

三类来源，各有各的用处：

1. **书籍与标准目录**。以 GoF 1994 年那本书的 23 个模式为基准线，再取 Head First 设计模式、架构整洁之道、企业应用架构模式、重构、反模式、POSA、企业集成模式、领域驱动设计、Release It! 的目录，看站内有没有对应篇目。
2. **官方与社区文档**。Java SE、C++ Core Guidelines、Go、Vue、React、.NET、Spring 的官方文档用来核对 API 名称和语言特性的口径；Refactoring.Guru、SourceMaking、iluwatar/java-design-patterns 等社区站点用来核对模式分类与别名。
3. **应用场景**。把模式对回具体语言和框架的落地位置，例如 Java 的 `java.util.concurrent`、Spring 的依赖注入、C++ 标准库的智能指针与 `std::function`、Go 的结构体嵌入与 channel、Vue/React 的组合式写法。

## 核对方法

先把每一本权威资料的目录拆成条目，再把条目和站内 `docs/` 下的文件一一对：

- 条目在站内有正文页，标"已覆盖"；
- 条目站内只在[设计模式概览](/introduction)里提到、没有正文页，标"声明未落地"；
- 条目站内完全没有，标"缺口"，在差异表里给出处置（新增、合并到已有篇、暂不收录）。

站内交叉引用（简介页、参考页、侧栏配置、各目录导读）也一并核对，不一致的列在差异表第三张表。

## 结论（数字）

- GoF 的 23 个模式站内全部有正文页，覆盖率 23/23，不需要补。
- 调研前站内有 47 篇模式正文，另有 1 篇快照模式页是合并到备忘录模式的跳转页、5 篇目录导读、3 篇首页/简介/参考，合计 56 篇 Markdown。
- 调研发现缺口 14 项，本次全部补成新篇：反模式 6 篇、现代演进 4 篇、并发 3 篇、其他模式 1 篇。
- 交叉引用不一致 6 处，随本次提交修订。
- 补完后站内 Markdown 从 56 篇增到 75 篇（正文 59 篇，14 篇新篇含 2 篇分区导读）。

## 来源清单

正文里用 `[S1]` 这样的编号指回本清单。共 28 条。

### 书籍

- [S1] Erich Gamma、Richard Helm、Ralph Johnson、John Vlissides，《Design Patterns: Elements of Reusable Object-Oriented Software》，Addison-Wesley，1994。23 个模式的原始目录，分创建型 5、结构型 7、行为型 11。
- [S2] Eric Freeman 等，《Head First Design Patterns》（第 2 版），O'Reilly，2020。入门向案例书，覆盖策略、观察者、命令、适配器与外观、模板方法、迭代器与组合、状态、单例、装饰、工厂、抽象工厂、代理，第 2 版加入 Lambda 与函数式接口的写法，并在观察者一章讲开闭原则。
- [S3] Robert C. Martin，《Clean Architecture》，Prentice Hall，2017。中文版名《架构整洁之道》。给出 SOLID 五原则、依赖规则与组件级设计原则。
- [S4] Robert C. Martin，《Agile Software Development: Principles, Patterns, and Practices》，Prentice Hall，2002。SOLID 五原则的出处。
- [S5] Martin Fowler，《Patterns of Enterprise Application Architecture》，Addison-Wesley，2002。企业应用目录，按领域逻辑、数据源、Web 表现层、并发与事务分组，含事务脚本、活动记录、数据映射器、仓储、单元工作、前端控制器等。
- [S6] Martin Fowler 等，《Refactoring: Improving the Design of Existing Code》（第 2 版），Addison-Wesley，2018。代码坏味道目录与重构手法。
- [S7] William J. Brown、Raphael C. Malveau、Hays W. McCormick、Thomas J. Mowbray，《AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis》，Wiley，1998。反模式目录的源头之一，覆盖需求、架构、项目管理、企业层的反模式。
- [S8] Brian Foote、Joseph Yoder，《Big Ball of Mud》，Proceedings of the 4th Conference on Pattern Languages of Programs（PLoP），1997。描述失控遗留系统的形态与出路。
- [S9] Frank Buschmann 等，《Pattern-Oriented Software Architecture》（POSA 系列，卷 1 讲架构与通信，卷 2 讲并发与网络对象），Wiley。架构层模式目录，含分层、管道-过滤器、黑板、代理，卷 2 含反应器、主动器、主动对象。
- [S10] Gregor Hohpe、Bobby Woolf，《Enterprise Integration Patterns》，Addison-Wesley，2002。消息通道、路由、转换等集成模式目录，站点为 enterpriseintegrationpatterns.com。
- [S11] Eric Evans，《Domain-Driven Design》，Addison-Wesley，2003。限界上下文、聚合、仓储、规格等战略与模式词汇。
- [S12] Michael T. Nygard，《Release It!》（第 2 版），Pragmatic Bookshelf，2018。生产环境稳定性模式，含熔断器、隔舱、超时、重试、稳态。
- [S13] Chris Richardson，《Microservices Patterns》，Manning，2018。API 网关、服务发现、Saga、事件溯源等微服务落地模式，站点为 microservices-patterns.com。
- [S14] Joshua Kerievsky，《Refactoring to Patterns》，Addison-Wesley，2004。从坏味道到模式的演进路径。
- [S15] Bilgin Ibryam、Roland Huß，《Kubernetes Patterns》，O'Reilly，2019。容器编排平台上的模式目录，站点为 kubernetespatterns.com。

### 官方与社区文档

- [S16] Refactoring.Guru（refactoring.guru）：按语言切换示例的设计模式目录、重构手法与代码坏味道说明。
- [S17] SourceMaking（sourcemaking.com）：设计模式与反模式的条目站点，附 UML 与优缺点。
- [S18] iluwatar/java-design-patterns（github.com/iluwatar/java-design-patterns）：以 Java 实现的模式开源仓库，约百个条目，每个模式一篇说明加可运行示例。
- [S19] Java SE API 文档 `java.util.concurrent` 包说明（docs.oracle.com）：Executor、Future、Semaphore、ReadWriteLock、CountDownLatch 等并发模式的标准库实现。
- [S20] C++ Core Guidelines（isocpp.github.io/cppcoreguidelines）：资源管理与智能指针、RAII、接口设计的官方建议。
- [S21] Go 官方文档与博客（go.dev）：Effective Go、Pipelines and cancellation 等，给出 channel、goroutine、接口组合的惯用写法。
- [S22] Vue.js 官方文档（vuejs.org）：组合式 API 的动机、`setup` 与逻辑复用写法。
- [S23] React 官方文档（react.dev）：组件组合、状态提升与自定义 Hook 的写法。
- [S24] Microsoft Learn 的 .NET 设计指南（learn.microsoft.com）：框架设计准则与常用命名、扩展性约定。
- [S25] Wikipedia 的 Software design pattern、Software antipattern、God object、Big Ball of Mud 等词条：核对定义与别名。
- [S26] martinfowler.com：eaaCatalog（企业应用模式目录）与 bliki（含 Anemic Domain Model 条目）。
- [S27] Spring 官方文档（docs.spring.io）：依赖注入与应用上下文章节。
- [S28] MDN Web Docs（developer.mozilla.org）：JavaScript 的 Proxy、迭代器协议、EventTarget 事件模型等语言层条目，用于核对前端落地写法。

### 引用约定

- 调研篇里的 `[S1]` 指向本页清单，对应书目在[参考资料](/reference)里也有书目条目；
- 站内模式正文不逐条标来源，来源集中在本目录，避免每篇重复贴书目；
- 出版年份、版本、章节归属按上列版本写，改版时同步更新本清单。
