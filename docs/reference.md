# 参考

本页汇总设计模式相关的经典书籍、在线资源与站内文档索引，便于进一步查阅。

## 经典书籍

- 《设计模式：可复用面向对象软件的基础》（Design Patterns: Elements of Reusable Object-Oriented Software），Erich Gamma、Richard Helm、Ralph Johnson、John Vlissides（"四人帮"/GoF）。设计模式领域的开山之作，定义了 23 种经典模式及其意图、适用性与结构。
- 《Head First 设计模式》（Head First Design Patterns），Eric Freeman 等。以图形化、案例化的方式讲解经典模式，适合入门。
- 《面向对象分析与设计》（Object-Oriented Analysis and Design with Applications），Grady Booch 等。讲解面向对象基础与模式在软件生命周期中的应用。
- 《企业应用架构模式》（Patterns of Enterprise Application Architecture），Martin Fowler。覆盖企业级应用中的领域逻辑、数据映射、Web 表现层等模式；仓储与单元工作出自此书，对应[仓储与单元工作](/other/repository)。
- 《重构：改善既有代码的设计》（Refactoring: Improving the Design of Existing Code），Martin Fowler。说明如何通过重构手法把代码逐步整理为引入模式的形态。
- 《重构与模式》（Refactoring to Patterns），Joshua Kerievsky。给出从常见坏味道到设计模式的演进路径。
- 《面向模式的软件架构》（Pattern-Oriented Software Architecture），Frank Buschmann 等（POSA 系列）。系统化讲解通信、并发、结构等架构层模式。
- 《企业集成模式》（Enterprise Integration Patterns），Gregor Hohpe、Bobby Woolf。消息、路由、转换等企业应用集成（EAI）中消息传递模式的经典目录，对应站内[集成模式](/integration/overview)分区。
- 《架构整洁之道》（Clean Architecture），Robert C. Martin。SOLID 五原则、依赖规则与组件级设计原则，对应站内[现代演进](/evolution/overview)分区。
- 《反模式》（AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis），William J. Brown 等。反模式目录，对应站内[反模式](/anti-patterns/overview)分区。
- 《领域驱动设计》（Domain-Driven Design），Eric Evans。限界上下文、聚合等战略设计词汇；仓储按领域层接口口径成篇，对应[仓储与单元工作](/other/repository)。
- 《Release It!》（第 2 版），Michael T. Nygard。生产环境稳定性模式，[熔断器](/evolution/circuit-breaker)、[隔舱](/evolution/bulkhead)、[超时](/evolution/timeout)、[重试](/evolution/retry)四篇出自此书。

## 在线资源

- Refactoring.Guru：按语言分类的模式教程，含意图、结构、适用场景与示例代码。
- SourceMaking：设计模式与反模式的系统站点，附 UML 图与优缺点说明。
- Wikipedia：Software design pattern / Behavioral pattern 等词条，适合快速核对模式定义。
- dofactory：经典 GoF 模式的模式分类与代码示例。
- Martin Fowler 的个人站点（martinfowler.com）：重构、企业应用架构、演进式架构等文章。
- Java 官方文档 java.util.concurrent 包说明：Future、Semaphore、BlockingQueue 等并发模式的标准库实现。

## 站内文档索引

### 概览

- [设计模式概览](/introduction)

### 创建型模式

- [创建型模式导读](/creational/overview)
- [单例模式](/creational/singleton)
- [工厂方法模式](/creational/factory-method)
- [抽象工厂模式](/creational/abstract-factory)
- [建造者模式](/creational/builder)
- [原型模式](/creational/prototype)
- [多例模式](/creational/multiton)
- [对象池模式](/creational/object-pool)
- [服务定位器模式](/creational/service-locator)

### 结构型模式

- [结构型模式导读](/structural/overview)
- [适配器模式](/structural/adapter)
- [装饰模式](/structural/decorator)
- [代理模式](/structural/proxy)
- [虚拟代理模式](/structural/virtual-proxy)
- [保护代理模式](/structural/protection-proxy)
- [远程代理模式](/structural/remote-proxy)
- [动态代理模式](/structural/dynamic-proxy)
- [外观模式](/structural/facade)
- [桥接模式](/structural/bridge)
- [双向桥接模式](/structural/bidirectional-bridge)
- [组合模式](/structural/composite)
- [享元模式](/structural/flyweight)
- [依赖注入](/structural/dependency-injection)
- [智能指针模式](/structural/smart-pointer)

### 行为型模式

- [行为型模式导读](/behavioral/overview)
- [策略模式](/behavioral/strategy)
- [观察者模式](/behavioral/observer)
- [命令模式](/behavioral/command)
- [责任链模式](/behavioral/chain-of-responsibility)
- [中介者模式](/behavioral/mediator)
- [迭代器模式](/behavioral/iterator)
- [模板方法模式](/behavioral/template-method)
- [状态模式](/behavioral/state)
- [备忘录模式](/behavioral/memento)
- [解释器模式](/behavioral/interpreter)
- [访问者模式](/behavioral/visitor)
- [回调模式](/behavioral/callback)
- [领域特定语言（DSL）](/behavioral/dsl)

### 并发模式

- [并发模式导读](/concurrency/overview)
- [生产者-消费者模式](/concurrency/producer-consumer)
- [信号量模式](/concurrency/semaphore)
- [Future 模式](/concurrency/future)
- [主动对象模式](/concurrency/active-object)
- [双重检查锁定模式](/concurrency/double-checked-locking)
- [事件循环模式](/concurrency/event-loop)
- [反应器模式](/concurrency/reactor)
- [主动器模式](/concurrency/proactor)

### 其他模式

- [其他模式导读](/other/overview)
- [MVC 模式](/other/mvc)
- [MVVM 模式](/other/mvvm)
- [对象-关系映射（ORM）](/other/orm)
- [事件溯源（Event Sourcing）](/other/event-sourcing)
- [事务脚本模式](/other/transaction-script)
- [仓储与单元工作](/other/repository)

### 集成模式

- [集成模式导读](/integration/overview)
- [消息通道模式](/integration/message-channel)
- [消息路由模式](/integration/message-router)
- [消息转换模式](/integration/message-translator)
- [发布订阅模式](/integration/publish-subscribe)

### 反模式

- [反模式导读](/anti-patterns/overview)
- [神对象](/anti-patterns/god-object)
- [大泥球](/anti-patterns/big-ball-of-mud)
- [金锤子](/anti-patterns/golden-hammer)
- [意面代码](/anti-patterns/spaghetti-code)
- [贫血模型](/anti-patterns/anemic-domain-model)

### 现代演进

- [现代演进导读](/evolution/overview)
- [组合式设计](/evolution/composition-over-inheritance)
- [SOLID 与依赖规则](/evolution/solid)
- [熔断器模式](/evolution/circuit-breaker)
- [隔舱模式](/evolution/bulkhead)
- [超时模式](/evolution/timeout)
- [重试模式](/evolution/retry)

### 调研

- [调研总览](/research/overview)（含 28 条来源清单）
- [权威书籍与标准目录](/research/books)
- [官方与社区文档](/research/official-docs)
- [应用场景与语言落地](/research/applications)
- [覆盖核对与差异表](/research/coverage)

## 模式之间的关联

- 单例模式与[双重检查锁定模式](/concurrency/double-checked-locking)常结合用于实现线程安全的延迟初始化。
- 代理模式的不同变体（[虚拟代理](/structural/virtual-proxy)、[保护代理](/structural/protection-proxy)、[远程代理](/structural/remote-proxy)、[动态代理](/structural/dynamic-proxy)）都围绕"控制对对象的访问"展开。
- [备忘录模式](/behavioral/memento)与[快照模式](/behavioral/snapshot)是同一类模式的不同叫法，通常用于撤销/重做。
- [工厂方法](/creational/factory-method)与[抽象工厂](/creational/abstract-factory)解决对象创建的解耦问题，[建造者模式](/creational/builder)则面向复杂对象的分步构建。
- [事件循环](/concurrency/event-loop)、[反应器](/concurrency/reactor)与[主动器](/concurrency/proactor)共同构成事件驱动 I/O 的核心模式族。
- [熔断器](/evolution/circuit-breaker)、[隔舱](/evolution/bulkhead)、[超时](/evolution/timeout)与[重试](/evolution/retry)同出《Release It!》，分别管失败率、资源上限、单次时长与瞬时故障恢复，跨进程调用常四件一起配。
- [策略模式](/behavioral/strategy)的空对象一节："空行为"也是可替换的策略，返回空实现代替 `null`，调用方不必判空。
- [发布订阅](/integration/publish-subscribe)与[观察者](/behavioral/observer)是同一意图在跨进程与进程内两个域的实现：异步消息与同步回调，失败模型不同。
