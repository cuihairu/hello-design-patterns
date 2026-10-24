# 参考

本页汇总设计模式相关的经典书籍、在线资源与站内文档索引，便于进一步查阅。

## 经典书籍

- 《设计模式：可复用面向对象软件的基础》（Design Patterns: Elements of Reusable Object-Oriented Software），Erich Gamma、Richard Helm、Ralph Johnson、John Vlissides（"四人帮"/GoF）。设计模式领域的开山之作，定义了 23 种经典模式及其意图、适用性与结构。
- 《Head First 设计模式》（Head First Design Patterns），Eric Freeman 等。以图形化、案例化的方式呈现经典模式。
- 《面向对象分析与设计》（Object-Oriented Analysis and Design with Applications），Grady Booch 等。讲解面向对象基础与模式在软件生命周期中的应用。
- 《企业应用架构模式》（Patterns of Enterprise Application Architecture），Martin Fowler。覆盖企业级应用中的领域逻辑、数据映射、Web 表现层等模式；仓储与单元工作出自此书，对应[仓储与单元工作](/zh/other/repository)；远程外观与数据传输对象出自"分布"一组，对应[远程外观与数据传输对象](/zh/structural/remote-facade)。
- 《重构：改善既有代码的设计》（Refactoring: Improving the Design of Existing Code），Martin Fowler。说明如何通过重构手法把代码逐步整理为引入模式的形态。
- 《重构与模式》（Refactoring to Patterns），Joshua Kerievsky。给出从常见坏味道到设计模式的演进路径。
- 《面向模式的软件架构》（Pattern-Oriented Software Architecture），Frank Buschmann 等（POSA 系列）。系统化讲解通信、并发、结构等架构层模式。
- 《企业集成模式》（Enterprise Integration Patterns），Gregor Hohpe、Bobby Woolf。消息、路由、转换等企业应用集成（EAI）中消息传递模式的经典目录，对应站内[集成模式](/zh/integration/overview)分区。
- 《架构整洁之道》（Clean Architecture），Robert C. Martin。SOLID 五原则、依赖规则与组件级设计原则，对应站内[现代演进](/zh/evolution/overview)分区。
- 《敏捷软件开发：原则、模式与实践》（Agile Software Development: Principles, Patterns, and Practices），Robert C. Martin。SOLID 五原则的出处，对应站内[SOLID 与依赖规则](/zh/evolution/solid)。
- 《反模式》（AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis），William J. Brown 等。反模式目录，对应站内[反模式](/zh/anti-patterns/overview)分区。
- 《大泥球》（Big Ball of Mud），Brian Foote、Joseph Yoder，PLoP 1997 论文。失控遗留系统的形态与出路，对应站内[大泥球](/zh/anti-patterns/big-ball-of-mud)。
- 《领域驱动设计》（Domain-Driven Design），Eric Evans。限界上下文、聚合等战略设计词汇；仓储按领域层接口口径成篇，对应[仓储与单元工作](/zh/other/repository)。
- 《Release It!》（第 2 版），Michael T. Nygard。生产环境稳定性模式，[熔断器](/zh/evolution/circuit-breaker)、[隔舱](/zh/evolution/bulkhead)、[超时](/zh/evolution/timeout)、[重试](/zh/evolution/retry)四篇出自此书。
- 《微服务模式》（Microservices Patterns），Chris Richardson。API 网关、服务发现、Saga 等微服务落地模式，按口径记入[覆盖核对与差异表](/zh/research/coverage)；事件溯源另见站内[事件溯源](/zh/other/event-sourcing)。
- 《Kubernetes 模式》（Kubernetes Patterns），Bilgin Ibryam、Roland Huß。容器编排平台上的模式目录，按口径记入[覆盖核对与差异表](/zh/research/coverage)。

## 在线资源

- [Refactoring.Guru](https://refactoring.guru/design-patterns)：按语言分类的模式教程（外部链接），含意图、结构、适用场景与示例代码。
- [SourceMaking](https://sourcemaking.com/design_patterns)：设计模式与反模式的系统站点，附 UML 图与优缺点说明。
- [Wikipedia · Software design pattern](https://en.wikipedia.org/wiki/Software_design_pattern)：设计模式总词条，另有各模式分词条，适合快速核对定义。
- [dofactory](https://www.dofactory.com/net/design-patterns)：经典 GoF 模式的模式分类与代码示例。
- [Martin Fowler 的个人站点](https://martinfowler.com/eaaCatalog/)：重构、企业应用架构、演进式架构等文章，eaaCatalog 为 [S5] 的在线目录。
- [Java 官方文档 java.util.concurrent 包](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html)：Future、Semaphore、BlockingQueue 等并发模式的标准库实现。

## 站内文档索引

### 概览

- [设计模式概览](/zh/introduction)
- [知识点整理](/zh/knowledge)
- [术语表](/zh/glossary)

### 创建型模式

- [创建型模式概览](/zh/creational/overview)
- [单例模式](/zh/creational/singleton)
- [工厂方法模式](/zh/creational/factory-method)
- [抽象工厂模式](/zh/creational/abstract-factory)
- [建造者模式](/zh/creational/builder)
- [原型模式](/zh/creational/prototype)
- [多例模式](/zh/creational/multiton)
- [对象池模式](/zh/creational/object-pool)
- [服务定位器模式](/zh/creational/service-locator)

### 结构型模式

- [结构型模式概览](/zh/structural/overview)
- [适配器模式](/zh/structural/adapter)
- [装饰模式](/zh/structural/decorator)
- [代理模式](/zh/structural/proxy)
- [虚拟代理模式](/zh/structural/virtual-proxy)
- [保护代理模式](/zh/structural/protection-proxy)
- [远程代理模式](/zh/structural/remote-proxy)
- [动态代理模式](/zh/structural/dynamic-proxy)
- [外观模式](/zh/structural/facade)
- [远程外观与数据传输对象](/zh/structural/remote-facade)
- [桥接模式](/zh/structural/bridge)
- [双向桥接模式](/zh/structural/bidirectional-bridge)
- [组合模式](/zh/structural/composite)
- [享元模式](/zh/structural/flyweight)
- [依赖注入](/zh/structural/dependency-injection)
- [智能指针模式](/zh/structural/smart-pointer)

### 行为型模式

- [行为型模式概览](/zh/behavioral/overview)
- [策略模式](/zh/behavioral/strategy)
- [观察者模式](/zh/behavioral/observer)
- [命令模式](/zh/behavioral/command)
- [责任链模式](/zh/behavioral/chain-of-responsibility)
- [中介者模式](/zh/behavioral/mediator)
- [迭代器模式](/zh/behavioral/iterator)
- [模板方法模式](/zh/behavioral/template-method)
- [状态模式](/zh/behavioral/state)
- [备忘录模式](/zh/behavioral/memento)
- [解释器模式](/zh/behavioral/interpreter)
- [访问者模式](/zh/behavioral/visitor)
- [回调模式](/zh/behavioral/callback)
- [领域特定语言（DSL）](/zh/behavioral/dsl)

### 并发模式

- [并发模式概览](/zh/concurrency/overview)
- [生产者-消费者模式](/zh/concurrency/producer-consumer)
- [信号量模式](/zh/concurrency/semaphore)
- [Future 模式](/zh/concurrency/future)
- [主动对象模式](/zh/concurrency/active-object)
- [双重检查锁定模式](/zh/concurrency/double-checked-locking)
- [事件循环模式](/zh/concurrency/event-loop)
- [反应器模式](/zh/concurrency/reactor)
- [主动器模式](/zh/concurrency/proactor)
- [线程池模式](/zh/concurrency/thread-pool)
- [读写锁模式](/zh/concurrency/read-write-lock)
- [工作窃取模式](/zh/concurrency/work-stealing)

### 其他模式

- [其他模式概览](/zh/other/overview)
- [MVC 模式](/zh/other/mvc)
- [MVVM 模式](/zh/other/mvvm)
- [对象-关系映射（ORM）](/zh/other/orm)
- [事件溯源（Event Sourcing）](/zh/other/event-sourcing)
- [事务脚本模式](/zh/other/transaction-script)
- [仓储与单元工作](/zh/other/repository)

### 集成模式

- [集成模式概览](/zh/integration/overview)
- [消息通道模式](/zh/integration/message-channel)
- [消息路由模式](/zh/integration/message-router)
- [消息转换模式](/zh/integration/message-translator)
- [发布订阅模式](/zh/integration/publish-subscribe)

### 反模式

- [反模式概览](/zh/anti-patterns/overview)
- [神对象](/zh/anti-patterns/god-object)
- [大泥球](/zh/anti-patterns/big-ball-of-mud)
- [金锤子](/zh/anti-patterns/golden-hammer)
- [意面代码](/zh/anti-patterns/spaghetti-code)
- [贫血模型](/zh/anti-patterns/anemic-domain-model)

### 现代演进

- [现代演进概览](/zh/evolution/overview)
- [组合式设计](/zh/evolution/composition-over-inheritance)
- [SOLID 与依赖规则](/zh/evolution/solid)
- [熔断器模式](/zh/evolution/circuit-breaker)
- [隔舱模式](/zh/evolution/bulkhead)
- [超时模式](/zh/evolution/timeout)
- [重试模式](/zh/evolution/retry)

### 调研

- [调研总览](/zh/research/overview)（含 28 条来源清单）
- [权威书籍与标准目录](/zh/research/books)
- [官方与社区文档](/zh/research/official-docs)
- [应用场景与语言落地](/zh/research/applications)
- [覆盖核对与差异表](/zh/research/coverage)

## 模式之间的关联

- 单例模式与[双重检查锁定模式](/zh/concurrency/double-checked-locking)常结合用于实现线程安全的延迟初始化。
- 代理模式的不同变体（[虚拟代理](/zh/structural/virtual-proxy)、[保护代理](/zh/structural/protection-proxy)、[远程代理](/zh/structural/remote-proxy)、[动态代理](/zh/structural/dynamic-proxy)）都围绕"控制对对象的访问"展开。
- [远程代理](/zh/structural/remote-proxy)与[远程外观与数据传输对象](/zh/structural/remote-facade)是跨进程边界的两种取向：前者保透明、粒度跟对象，后者弃透明、粒度跟用例，实际系统常按接口成对出现。
- [备忘录模式](/zh/behavioral/memento)与[快照模式](/zh/behavioral/snapshot)是同一类模式的不同叫法，通常用于撤销/重做。
- [工厂方法](/zh/creational/factory-method)与[抽象工厂](/zh/creational/abstract-factory)解决对象创建的解耦问题，[建造者模式](/zh/creational/builder)则面向复杂对象的分步构建。
- [事件循环](/zh/concurrency/event-loop)、[反应器](/zh/concurrency/reactor)与[主动器](/zh/concurrency/proactor)共同构成事件驱动 I/O 的核心模式族。
- [熔断器](/zh/evolution/circuit-breaker)、[隔舱](/zh/evolution/bulkhead)、[超时](/zh/evolution/timeout)与[重试](/zh/evolution/retry)同出《Release It!》，分别管失败率、资源上限、单次时长与瞬时故障恢复，跨进程调用常四件一起配。
- [策略模式](/zh/behavioral/strategy)的空对象一节："空行为"也是可替换的策略，返回空实现代替 `null`，调用方不必判空。
- [发布订阅](/zh/integration/publish-subscribe)与[观察者](/zh/behavioral/observer)是同一意图在跨进程与进程内两个域的实现：异步消息与同步回调，失败模型不同。

<!-- BACKLINKS-AUTO -->
## 相关页面

- [coverage](/zh/research/coverage.md)
- [overview](/zh/research/overview.md)
