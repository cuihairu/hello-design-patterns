# 应用场景与各语言落地

模式最终要在具体语言里写出来。这一篇按"场景 → 模式 → 落地 API"排，说明站内正文里的例子来自哪里，以及为什么某些模式在有的语言里根本不用写。

## 对象创建与装配

| 场景 | 模式 | Java | C++ | Go | C# / .NET |
| --- | --- | --- | --- | --- | --- |
| 一次拿到一族相关对象 | [抽象工厂](/creational/abstract-factory) | 工厂接口 + 配置切换实现 | 抽象工厂类 + 模板 | 接口字面量表 | `IAbstractFactory` + DI 容器 |
| 分步拼复杂对象 | [建造者](/creational/builder) | 桶构造器 | 链式 `builder()` 返回引用 | 函数式选项 `WithXxx` | 指定属性初始化 |
| 只留一个实例 | [单例](/creational/singleton) | `enum` 单例或静态持有 | 局部静态对象（线程安全） | 包级 `sync.Once` | 线程安全的懒加载静态字段 |
| 复用昂贵对象 | [对象池](/creational/object-pool) | 数据库连接池、`HikariCP` | 线程池队列 | channel 当队列 | `ObjectPool<T>` |

依赖装配这件事在 Java/C# 里由容器做，对应[依赖注入](/structural/dependency-injection)与[服务定位器](/creational/service-locator)。Go 没有容器，装配写在 `main` 里，所以 Go 示例不出现 DI 框架，只出现"把接口当参数传进去"。

## 接口适配与访问控制

- **对接第三方 SDK** → [适配器](/structural/adapter)。站内示例按"目标接口由我方定义、适配器包一层"写，这与 Java 的 `InputStreamReader`、C++ 的迭代器适配器同构。
- **给子系统一个薄入口** → [外观](/structural/facade)。
- **控制访问、加缓存或权限** → [代理](/structural/proxy)的四个变体。Java 用 `java.lang.reflect.Proxy` 做动态代理，C++ 用包装类，Go 用接口包装，JavaScript 直接用语言内置的 `Proxy` 对象 [S28]。
- **给对象加职责而不改类** → [装饰](/structural/decorator)。Java 的 `java.io` 输入输出流链是标准例子，C++ 对应 `std::istreambuf_iterator` 那层包装，C# 对应 `Stream` 的包装类。
- **接口要跨进程** → [远程外观与数据传输对象](/structural/remote-facade)。Java 落地是 Spring MVC 的 controller 方法签名（EJB Session Facade 是前身），Go 是手写 service struct 加请求/响应结构体，gRPC 的 `message` 定义就是 DTO。

## 行为与流程

- **算法可换** → [策略](/behavioral/strategy)。Java 传 `Function`，C++ 传 `std::function` 或模板参数，Go 用小接口或函数类型，TypeScript 传函数属性。四者都不需要为每个算法建一个子类。
- **流程步骤固定、个别步骤可换** → [模板方法](/behavioral/template-method)。Java/C++ 用抽象基类的可覆盖方法；Go 没有抽象类，用接口加结构体嵌入表达同一个骨架，站内 Go 示例走的就是这条路。
- **事件通知** → [观察者](/behavioral/observer)。落地位置分别是 `EventTarget` [S28]、Qt 的 signal/slot、Rx 风格流、Go 的 channel 广播。Go 标准库没有观察者类，站内 Go 示例用接口实现，流水线与取消的写法见官方博客 [S21]。
- **请求逐级处理** → [责任链](/behavioral/chain-of-responsibility)。中间件栈（Servlet Filter、Koa 中间件、Go `http.Handler` 包装）是它在 Web 框架里的形态。
- **状态决定行为** → [状态](/behavioral/state)。TCP 连接状态机、订单状态流转、播放器状态是三个常用例子。
- **对象结构上的多种操作** → [访问者](/behavioral/visitor)。经典形态是 `accept/visit` 双分派，站内正文用 Java 示例展开；C++ 没有双分派语法，惯用 `std::variant` 加 `std::visit` 把分支交给标准库做，不再手写分派表。

## 并发与异步

| 场景 | 模式 | 标准落地 |
| --- | --- | --- |
| 固定规模的后台任务 | [线程池](/concurrency/thread-pool) | `ThreadPoolExecutor` / `std::thread` 池 / goroutine 池 |
| 读多写少 | [读写锁](/concurrency/read-write-lock) | `ReentrantReadWriteLock` / `std::shared_mutex` / `sync.RWMutex` |
| CPU 密集任务分片 | [工作窃取](/concurrency/work-stealing) | `ForkJoinPool` / 工作窃取 deque |
| 缓冲速度差 | [生产者-消费者](/concurrency/producer-consumer) | `BlockingQueue` / 有缓冲 channel |
| 单线程处理 I/O | [事件循环](/concurrency/event-loop)、[反应器](/concurrency/reactor) | Node.js 事件循环、Netty、`libuv` |
| 异步结果占位 | [Future](/concurrency/future) | `CompletableFuture` / `std::future` / `Promise` |
| 惰性安全初始化 | [双重检查锁定](/concurrency/double-checked-locking) | `volatile` + 同步块 / `std::call_once` / `sync.Once` |

这一栏的术语以 Java SE `java.util.concurrent` 文档 [S19] 为准，C++ 部分对照 Core Guidelines 的资源管理建议 [S20]，Go 部分对照官方文档 [S21]。

## 数据与分层

- **表和对象的阻抗失配** → [ORM](/other/orm)：Hibernate、Entity Framework、Django ORM。
- **业务逻辑写在哪一层** → [事务脚本](/other/transaction-script) 与[贫血模型](/anti-patterns/anemic-domain-model)对照，来源是企业应用架构模式 [S5] 与 Martin 的 bliki [S26]。
- **状态可回放** → [事件溯源](/other/event-sourcing)：追加事件日志 + 快照，与[备忘录](/behavioral/memento)的区别是前者记过程、后者记瞬间。
- **前后端职责划分** → [MVC](/other/mvc)、[MVVM](/other/mvvm)：Spring MVC、iOS SwiftUI、Vue 的组件模型。

## 分布式与云上

熔断最初出自 Release It! [S12]，现在是网关与 RPC 客户端的标配（Resilience4j、Polly、Sentinel 的熔断器都是同一个模型）：统计窗口内失败率超阈值就直接失败，不再打下游。本次新增[熔断器](/evolution/circuit-breaker)用 Go 与 Java 两版实现。

微服务方向的 API 网关、Saga、服务发现来自 Richardson 那本书 [S13]，Kubernetes 上的模式来自 Kubernetes Patterns [S15]，这两批条目记在差异表里，暂不新增，理由是它们属于分布式系统设计而非本仓"设计模式"的现有口径。

## 多语言落地的差异（站内写法约定）

1. 需要"多态"的地方：Java/C#/C++ 用接口或抽象类，Go 用小接口加嵌入，站内示例按语言习惯写，不跨语言硬译。
2. 需要"复用逻辑"的地方：继承在 Go 与函数式语言里不存在，统一改写成组合，见[组合式设计](/evolution/composition-over-inheritance)。
3. 单例的代价（全局状态、测试困难）在 Java/C# 上最明显，在 Go 里包级变量同样可测性差，站内单例篇与反模式篇各写一半。
4. 线程模型差异决定了并发篇的示例：Java 用线程池，C++ 用 `std::jthread` 与 `std::stop_token`，Go 用 goroutine 加 channel。
