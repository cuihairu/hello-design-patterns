# 术语表

站内模式术语的中英对照与一句话定义。出处编号 `[S1]`–`[28]` 沿用[调研总览的来源清单](/research/overview#来源清单)，书目细节以该清单为准，本表只给可点开的在线出处；条目末尾的相关页直达站内正文。

## 创建型模式

### 单例模式（Singleton pattern）

保证一个类只有一个实例，并提供全局访问点。

**出处**：[S1]；[Wikipedia · Singleton pattern](https://en.wikipedia.org/wiki/Singleton_pattern)

**相关页**：[单例模式](/creational/singleton)、[双重检查锁定模式](/concurrency/double-checked-locking)

### 工厂方法模式（Factory method pattern）

把对象创建推迟到子类，由子类决定实例化哪个具体产品。

**出处**：[S1]；[Wikipedia · Factory method pattern](https://en.wikipedia.org/wiki/Factory_method_pattern)

**相关页**：[工厂方法模式](/creational/factory-method)、[抽象工厂模式](/creational/abstract-factory)

### 抽象工厂模式（Abstract factory pattern）

创建一族相关产品对象而不指明具体类。

**出处**：[S1]；[Wikipedia · Abstract factory pattern](https://en.wikipedia.org/wiki/Abstract_factory_pattern)

**相关页**：[抽象工厂模式](/creational/abstract-factory)、[工厂方法模式](/creational/factory-method)

### 建造者模式（Builder pattern）

分步构造复杂对象，同一构造过程可产出不同表示。

**出处**：[S1]；[Wikipedia · Builder pattern](https://en.wikipedia.org/wiki/Builder_pattern)

**相关页**：[建造者模式](/creational/builder)

### 原型模式（Prototype pattern）

以克隆既有实例的方式创建新对象，绕开逐字段初始化。

**出处**：[S1]；[Wikipedia · Prototype pattern](https://en.wikipedia.org/wiki/Prototype_pattern)

**相关页**：[原型模式](/creational/prototype)

### 多例模式（Multiton pattern）

单例的推广：按 key 管理有限个实例，每个 key 至多一个实例。

**出处**：[Wikipedia · Multiton pattern](https://en.wikipedia.org/wiki/Multiton_pattern)（未入 [S1] 目录）

**相关页**：[多例模式](/creational/multiton)、[单例模式](/creational/singleton)

### 对象池模式（Object pool pattern）

复用创建代价高的对象，以借还协议避免反复构造销毁。

**出处**：[Wikipedia · Object pool pattern](https://en.wikipedia.org/wiki/Object_pool_pattern)；[Apache Commons Pool](https://commons.apache.org/proper/commons-pool/)

**相关页**：[对象池模式](/creational/object-pool)、[线程池模式](/concurrency/thread-pool)

### 服务定位器模式（Service locator pattern）

集中注册、按名取依赖；与依赖注入的取舍 Fowler 有专文评述。

**出处**：[Wikipedia · Service locator pattern](https://en.wikipedia.org/wiki/Service_locator_pattern)；[Fowler · Inversion of Control](https://martinfowler.com/articles/injection.html)

**相关页**：[服务定位器模式](/creational/service-locator)、[依赖注入模式](/structural/dependency-injection)

## 结构型模式

### 适配器模式（Adapter pattern）

转换已有接口使其满足客户端期望，令不兼容双方协同。

**出处**：[S1]；[Wikipedia · Adapter pattern](https://en.wikipedia.org/wiki/Adapter_pattern)

**相关页**：[适配器模式](/structural/adapter)、[外观模式](/structural/facade)

### 装饰模式（Decorator pattern）

动态给对象叠加职责，比继承更灵活的包装方案。

**出处**：[S1]；[Wikipedia · Decorator pattern](https://en.wikipedia.org/wiki/Decorator_pattern)

**相关页**：[装饰模式](/structural/decorator)、[代理模式](/structural/proxy)

### 代理模式（Proxy pattern）

控制对对象的访问；按用途分虚拟、保护、远程、动态等变体。

**出处**：[S1]；[Wikipedia · Proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern)

**相关页**：[代理模式](/structural/proxy)、[虚拟代理](/structural/virtual-proxy)、[保护代理](/structural/protection-proxy)、[远程代理](/structural/remote-proxy)、[动态代理](/structural/dynamic-proxy)

### 外观模式（Facade pattern）

为子系统给一个统一的高层接口，降低调用方耦合面。

**出处**：[S1]；[Wikipedia · Facade pattern](https://en.wikipedia.org/wiki/Facade_pattern)

**相关页**：[外观模式](/structural/facade)

### 桥接模式（Bridge pattern）

把抽象与实现拆到两条继承轴上，各自独立变化。

**出处**：[S1]；[Wikipedia · Bridge pattern](https://en.wikipedia.org/wiki/Bridge_pattern)

**相关页**：[桥接模式](/structural/bridge)、[双向桥接模式](/structural/bidirectional-bridge)

### 组合模式（Composite pattern）

以树形结构统一处理部分与整体，叶与容器同接口。

**出处**：[S1]；[Wikipedia · Composite pattern](https://en.wikipedia.org/wiki/Composite_pattern)

**相关页**：[组合模式](/structural/composite)、[迭代器模式](/behavioral/iterator)

### 享元模式（Flyweight pattern）

共享细粒度实例，把公共状态外置以省内存。

**出处**：[S1]；[Wikipedia · Flyweight pattern](https://en.wikipedia.org/wiki/Flyweight_pattern)

**相关页**：[享元模式](/structural/flyweight)、[对象池模式](/creational/object-pool)

### 依赖注入（Dependency injection）

依赖由外部注入而非对象自建，反转的是依赖的获取方向。

**出处**：[Wikipedia · Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection)；[Fowler · Inversion of Control](https://martinfowler.com/articles/injection.html)

**相关页**：[依赖注入模式](/structural/dependency-injection)、[服务定位器模式](/creational/service-locator)

### 智能指针（Smart pointer）

以 RAII 托管资源生命周期的指针对象，析构即释放。

**出处**：[Wikipedia · Smart pointer](https://en.wikipedia.org/wiki/Smart_pointer)；[cppreference · Memory management library](https://en.cppreference.com/w/cpp/memory)

**相关页**：[智能指针模式](/structural/smart-pointer)

## 行为型模式

### 策略模式（Strategy pattern）

封装一族可互换算法，运行时按需替换；「空行为」也是合法策略（空对象）。

**出处**：[S1]；[Wikipedia · Strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern)；[Wikipedia · Null object pattern](https://en.wikipedia.org/wiki/Null_object_pattern)

**相关页**：[策略模式](/behavioral/strategy)、[状态模式](/behavioral/state)

### 观察者模式（Observer pattern）

目标状态变化时自动通知所有订阅者，双向解耦。

**出处**：[S1]；[Wikipedia · Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern)

**相关页**：[观察者模式](/behavioral/observer)、[发布订阅模式](/integration/publish-subscribe)

### 命令模式（Command pattern）

把请求封装成对象，使请求可排队、撤销、记录。

**出处**：[S1]；[Wikipedia · Command pattern](https://en.wikipedia.org/wiki/Command_pattern)

**相关页**：[命令模式](/behavioral/command)、[备忘录模式](/behavioral/memento)

### 责任链模式（Chain of responsibility pattern）

请求沿处理者链依次传递，直到有人处理或落空。

**出处**：[S1]；[Wikipedia · Chain-of-responsibility pattern](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern)

**相关页**：[责任链模式](/behavioral/chain-of-responsibility)、[中介者模式](/behavioral/mediator)

### 中介者模式（Mediator pattern）

把同事对象间的多对多交互收进一个中介对象集中管理。

**出处**：[S1]；[Wikipedia · Mediator pattern](https://en.wikipedia.org/wiki/Mediator_pattern)

**相关页**：[中介者模式](/behavioral/mediator)、[观察者模式](/behavioral/observer)

### 迭代器模式（Iterator pattern)

顺序遍历聚合内容而不暴露内部表示。

**出处**：[S1]；[Wikipedia · Iterator pattern](https://en.wikipedia.org/wiki/Iterator_pattern)

**相关页**：[迭代器模式](/behavioral/iterator)、[组合模式](/structural/composite)

### 模板方法模式（Template method pattern）

固定算法骨架，把可变步骤留给子类实现。

**出处**：[S1]；[Wikipedia · Template method pattern](https://en.wikipedia.org/wiki/Template_method_pattern)

**相关页**：[模板方法模式](/behavioral/template-method)、[策略模式](/behavioral/strategy)

### 状态模式（State pattern）

行为随内部状态切换而整体变化，状态即对象。

**出处**：[S1]；[Wikipedia · State pattern](https://en.wikipedia.org/wiki/State_pattern)

**相关页**：[状态模式](/behavioral/state)、[策略模式](/behavioral/strategy)

### 备忘录模式（Memento pattern）

保存并恢复对象先前状态而不破坏封装；快照（snapshot）是同一模式的不同叫法。

**出处**：[S1]；[Wikipedia · Memento pattern](https://en.wikipedia.org/wiki/Memento_pattern)

**相关页**：[备忘录模式](/behavioral/memento)、[快照模式](/behavioral/snapshot)

### 解释器模式（Interpreter pattern）

为一种文法定义解释器，按语法规则求值。

**出处**：[S1]；[Wikipedia · Interpreter pattern](https://en.wikipedia.org/wiki/Interpreter_pattern)

**相关页**：[解释器模式](/behavioral/interpreter)、[领域特定语言模式](/behavioral/dsl)

### 访问者模式（Visitor pattern)

在不改动元素类的前提下为其加新操作，双分派落地。

**出处**：[S1]；[Wikipedia · Visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern)

**相关页**：[访问者模式](/behavioral/visitor)

### 回调（Callback）

把函数交给对方在其时机回呼，控制反转的最小形态。

**出处**：[Wikipedia · Callback](https://en.wikipedia.org/wiki/Callback_%28computer_programming%29)；[MDN · Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)

**相关页**：[回调模式](/behavioral/callback)、[观察者模式](/behavioral/observer)

### 领域特定语言（Domain-specific language, DSL）

面向窄域的小语言，与通用语言相对；解释器模式是其一种实现载体。

**出处**：[Wikipedia · Domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language)；[Fowler · DSL 书页](https://martinfowler.com/books/dsl.html)

**相关页**：[领域特定语言模式](/behavioral/dsl)、[解释器模式](/behavioral/interpreter)

## 并发模式

### 生产者-消费者（Producer–consumer）

以缓冲队列解耦生产与消费的速率差，阻塞队列是其标准库形态。

**出处**：[Wikipedia · Producer–consumer problem](https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem)；[Java · BlockingQueue](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/BlockingQueue.html)

**相关页**：[生产者消费者模式](/concurrency/producer-consumer)、[消息通道模式](/integration/message-channel)

### 反应器模式（Reactor pattern）

单（少）线程同步等待多路事件源，就绪即分发给处理器。

**出处**：[Wikipedia · Reactor pattern](https://en.wikipedia.org/wiki/Reactor_pattern)；[S9]

**相关页**：[反应堆模式](/concurrency/reactor)、[主动器模式](/concurrency/proactor)、[事件循环模式](/concurrency/event-loop)

### 主动器模式（Proactor pattern）

以异步 I/O 完成事件驱动，Windows IOCP 为代表实现。

**出处**：[Wikipedia · Proactor pattern](https://en.wikipedia.org/wiki/Proactor_pattern)；[Microsoft · I/O completion ports](https://learn.microsoft.com/en-us/windows/win32/fileio/i-o-completion-ports)

**相关页**：[主动器模式](/concurrency/proactor)、[反应堆模式](/concurrency/reactor)

### Future / Promise

异步结果的占位凭证，先回票据后取值。

**出处**：[Wikipedia · Futures and promises](https://en.wikipedia.org/wiki/Futures_and_promises)；[Java · CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html)

**相关页**：[Future 模式](/concurrency/future)

### 信号量（Semaphore）

以计数授权控制同时进入临界区的任务数。

**出处**：[Wikipedia · Semaphore](https://en.wikipedia.org/wiki/Semaphore_%28programming%29)；[man7 · sem_overview](https://man7.org/linux/man-pages/man7/sem_overview.7.html)

**相关页**：[信号量模式](/concurrency/semaphore)、[读写锁模式](/concurrency/read-write-lock)

### 事件循环（Event loop）

单线程轮询就绪事件并分发回调，Node.js/浏览器的主干。

**出处**：[Wikipedia · Event loop](https://en.wikipedia.org/wiki/Event_loop)；[libuv · Design overview](https://docs.libuv.org/en/v1.x/design.html)

**相关页**：[事件循环模式](/concurrency/event-loop)、[反应堆模式](/concurrency/reactor)

### 双重检查锁定（Double-checked locking）

延迟初始化的加锁优化：先无锁查、命中才不加锁；Java 内存模型下有著名的失败宣言。

**出处**：[Wikipedia · Double-checked locking](https://en.wikipedia.org/wiki/Double-checked_locking)；[Pugh · Double-Checked Locking is Broken](https://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html)

**相关页**：[双重检查锁定模式](/concurrency/double-checked-locking)、[单例模式](/creational/singleton)

### 主动对象（Active object）

把方法调用与执行解耦：调用变请求入队，独立线程依序执行。

**出处**：[Wikipedia · Active object](https://en.wikipedia.org/wiki/Active_object)；[S9]

**相关页**：[主动对象模式](/concurrency/active-object)、[生产者消费者模式](/concurrency/producer-consumer)

### 读写锁（Readers–writer lock）

读共享、写独占的锁策略，读多写少场景吞吐更高。

**出处**：[Wikipedia · Readers–writer lock](https://en.wikipedia.org/wiki/Readers%E2%80%93writer_lock)

**相关页**：[读写锁模式](/concurrency/read-write-lock)

### 线程池（Thread pool）

预建一组线程复用执行任务，省去逐任务建撤开销。

**出处**：[Wikipedia · Thread pool](https://en.wikipedia.org/wiki/Thread_pool)；[Java · java.util.concurrent](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html)

**相关页**：[线程池模式](/concurrency/thread-pool)、[对象池模式](/creational/object-pool)

### 工作窃取（Work stealing）

空闲线程从忙线程的队列尾部取任务，负载自均衡。

**出处**：[Wikipedia · Work stealing](https://en.wikipedia.org/wiki/Work_stealing)

**相关页**：[工作窃取模式](/concurrency/work-stealing)、[线程池模式](/concurrency/thread-pool)

## 集成与演进模式

### 消息通道（Message channel）

集成模式的第一公民：端点通过通道传消息，而非点对点直连。

**出处**：[S10]；[Enterprise Integration Patterns 站点](https://www.enterpriseintegrationpatterns.com/)

**相关页**：[消息通道模式](/integration/message-channel)、[集成模式概览](/integration/overview)

### 发布-订阅（Publish–subscribe）

发布者按主题广播，订阅者按订阅收，通道之外再加一层路由解耦。

**出处**：[Wikipedia · Publish–subscribe pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)；[S10]

**相关页**：[发布订阅模式](/integration/publish-subscribe)、[观察者模式](/behavioral/observer)

### 熔断器（Circuit breaker）

失败率超阈值即断闸快速失败，防止故障级联；恢复期半开试探。

**出处**：[S12]；[Wikipedia · Circuit breaker pattern](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern)；[Azure · Circuit Breaker pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

**相关页**：[熔断器模式](/evolution/circuit-breaker)、[重试模式](/evolution/retry)

### 隔舱（Bulkhead）

按用途分区资源上限，一舱进水不沉全船。

**出处**：[S12]；[Azure · Bulkhead pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

**相关页**：[隔舱模式](/evolution/bulkhead)

### 超时（Timeout）

给单次调用设时限，防止无限等待拖垮上游。

**出处**：[S12]

**相关页**：[超时模式](/evolution/timeout)、[熔断器模式](/evolution/circuit-breaker)

### 重试（Retry）

瞬时故障按退避策略重发；非幂等操作须先解决幂等再谈重试。

**出处**：[S12]；[Azure · Retry pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry)

**相关页**：[重试模式](/evolution/retry)、[超时模式](/evolution/timeout)

## 其他模式

### MVC（Model–view–controller）

模型-视图-控制器三分，界面与应用逻辑的最早分离方案。

**出处**：[Wikipedia · Model–view–controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)；[Fowler · GUI Architectures](https://martinfowler.com/eaaDev/uiArchs.html)

**相关页**：[MVC 模式](/other/mvc)、[MVVM 模式](/other/mvvm)

### MVVM（Model–view–viewmodel）

视图模型以数据绑定连接视图与模型，WPF 前端的经典分层。

**出处**：[Wikipedia · Model–view–viewmodel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)

**相关页**：[MVVM 模式](/other/mvvm)、[MVC 模式](/other/mvc)

### 对象关系映射（Object–relational mapping, ORM）

以对象层映射关系表，省去手写 SQL 的样板。

**出处**：[Wikipedia · Object–relational mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping)；[Fowler · ORM Hate](https://martinfowler.com/bliki/OrmHate.html)

**相关页**：[ORM 模式](/other/orm)、[仓储与单元工作](/other/repository)

### 事件溯源（Event sourcing）

以不可变事件序列为唯一事实源，状态由回放派生。

**出处**：[Fowler · Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)（Wikipedia 暂无独立词条）

**相关页**：[事件溯源模式](/other/event-sourcing)、[发布订阅模式](/integration/publish-subscribe)

### 仓储（Repository）

以集合式接口封装领域对象的存取，屏蔽持久化细节。

**出处**：[S5]；[Fowler · Repository](https://martinfowler.com/eaaCatalog/repository.html)

**相关页**：[仓储与单元工作](/other/repository)、[ORM 模式](/other/orm)

### 事务脚本（Transaction script）

一个用例一个过程式脚本，最直白的业务逻辑组织方式。

**出处**：[S5]；[Fowler · Transaction Script](https://martinfowler.com/eaaCatalog/transactionScript.html)

**相关页**：[事务脚本模式](/other/transaction-script)

## 反模式

### 反模式（Anti-pattern）

经常被采用、后果却弊大于利的解法；与坏味道、模式构成三层关系。

**出处**：[S7]；[Wikipedia · Anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)

**相关页**：[反模式概览](/anti-patterns/overview)

### 神对象（God object）

过多职责聚集到一个对象，牵一发动全身。

**出处**：[Wikipedia · God object](https://en.wikipedia.org/wiki/God_object)

**相关页**：[神对象](/anti-patterns/god-object)、[大泥球](/anti-patterns/big-ball-of-mud)

### 大泥球（Big ball of mud）

无清晰架构的纠缠系统，遗留代码的常见形态。

**出处**：[S8]；[Wikipedia · Big ball of mud](https://en.wikipedia.org/wiki/Big_ball_of_mud)

**相关页**：[大泥球](/anti-patterns/big-ball-of-mud)

### 金锤子（Golden hammer）

拿着熟悉的工具硬套一切问题，Law of the Instrument 的工程版。

**出处**：[Wikipedia · Law of the instrument](https://en.wikipedia.org/wiki/Law_of_the_instrument)

**相关页**：[金锤子](/anti-patterns/golden-hammer)

### 意面代码（Spaghetti code）

控制流纠缠如面，可读性与可维护性双失。

**出处**：[Wikipedia · Spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code)

**相关页**：[意面代码](/anti-patterns/spaghetti-code)

### 贫血模型（Anemic domain model）

领域对象只剩数据字段没有行为，逻辑散落服务层。

**出处**：[Fowler · AnemicDomainModel](https://martinfowler.com/bliki/AnemicDomainModel.html)

**相关页**：[贫血模型](/anti-patterns/anemic-domain-model)、[仓储与单元工作](/other/repository)

---

**维护口径**：新增条目必须给出可点的权威出处；查不到就写「未找到权威出处（待核）」，不得凭印象编造链接。出处编号 `[S#]` 的书目明细见[调研总览的来源清单](/research/overview#来源清单)。

<!-- BACKLINKS-AUTO -->
## 相关页面

- [knowledge](knowledge.md)
- [reference](reference.md)
