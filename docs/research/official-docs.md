# 官方与社区文档调研

书籍给目录和定义，官方文档给 API 口径，社区站点给分类与别名核对。这三类来源决定了站内正文里的类名、方法名与术语能不能对上现用的工具链。

## 官方文档

### Java SE：`java.util.concurrent` [S19]

并发目录的术语基准。站内引用到的标准库实现：

| 站内篇目 | 标准库对应 |
| --- | --- |
| [信号量模式](/concurrency/semaphore) | `java.util.concurrent.Semaphore` |
| [Future 模式](/concurrency/future) | `java.util.concurrent.Future`、`CompletableFuture` |
| [生产者-消费者模式](/concurrency/producer-consumer) | `BlockingQueue` 系列 |
| [线程池模式（本次新增）](/concurrency/thread-pool) | `ExecutorService`、`ThreadPoolExecutor` |
| [读写锁模式（本次新增）](/concurrency/read-write-lock) | `ReadWriteLock`、`ReentrantReadWriteLock` |
| [双重检查锁定](/concurrency/double-checked-locking) | `volatile` 的 JMM 语义 |

口径要留意：`Future.get()` 是阻塞取值，`CompletableFuture` 才带组合与回调；`Semaphore` 的 `acquire` 可被中断，示例里必须在拿到许可后才 `release`（站内信号量篇已按此写）。

### C++ Core Guidelines [S20]

结构型与并发两处的 C++ 现代写法依据：

- 资源用 RAII 表达（资源获取即初始化），`shared_ptr`/`unique_ptr` 的所有权规则对应站内[智能指针模式](/structural/smart-pointer)；
- 回调与可调用对象用 `std::function` 加 `std::visit`/lambda 表达，不手写函数指针表，对应[回调模式](/behavioral/callback)与[策略模式](/behavioral/strategy)；
- 接口小而窄、用抽象类表达运行时多态，与[桥接模式](/structural/bridge)的抽象与实现分离一致。

Guidelines 的 R.30/R.31 等条目讲 `unique_ptr` 与 `shared_ptr` 的参数传递，站内智能指针篇的示例按"值传递 + 移动"写，与之一致。

### Go 官方文档与博客 [S21]

Go 的模式落地方式与 Java、C++ 不同：没有继承，靠接口隐式实现加结构体嵌入。

- 策略、模板方法这类"算法可换"的模式在 Go 里用函数类型或小接口表达，对应[策略模式](/behavioral/strategy)与[模板方法模式](/behavioral/template-method)；
- 组合优先于继承在 Go 里是语言默认，对应本次新增的[组合式设计](/evolution/composition-over-inheritance)；
- goroutine 加 channel 的流水线写法对应[生产者-消费者模式](/concurrency/producer-consumer)，官方博客的 Pipelines and cancellation 一节给出 `close`、`range`、`select` 的正确姿势；
- `context.Context` 承担超时与取消传播，站内 [gRPC 远程代理示例](/structural/remote-proxy) 的 Go 代码就带 `ctx` 参数，这是 Go 侧写超时与取消的默认习惯；责任链一类的中间件同样把 `ctx` 当第一参数传。

### Vue.js 官方文档 [S22]

组合式 API 是"组合式设计"在前端的直接落地：把同一功能的逻辑、状态、生命周期收在一个函数里，而不是按选项分散在 `data`/`methods`/`computed` 里。[组合式设计](/evolution/composition-over-inheritance)一节的前端例子按该文档的口径写，包括逻辑复用靠函数返回值组合、不靠 mixin。

### React 官方文档 [S23]

React 的组件组合路径：自底向上用组件嵌套 + props 组合出 UI，状态不够用时状态提升，重复逻辑用自定义 Hook 收口。与 Vue 组合式 API 同属"组合优于继承"的落地，一起写在[组合式设计](/evolution/composition-over-inheritance)里。

### Microsoft Learn：.NET 设计指南 [S24]

.NET 侧的接口设计、可扩展性与命名约定。站内依赖注入、代理、装饰三篇的 C# 示例遵循它的约定：依赖通过构造函数注入，扩展点用接口而不是虚方法基类。

### Spring 官方文档 [S27]

依赖注入的落地事实来源：控制反转是容器负责对象组装，应用代码只声明需要什么。对应[依赖注入](/structural/dependency-injection)与[服务定位器](/creational/service-locator)的对比一节——两者都把"查找实现"移出业务代码，区别在谁发起装配。

### MDN Web Docs [S28]

前端语言层核对：`Proxy` 对应[动态代理](/structural/dynamic-proxy)与[保护代理](/structural/protection-proxy)，迭代器协议对应[迭代器模式](/behavioral/iterator)，`EventTarget` 的 `addEventListener`/`removeEventListener` 是观察者模式的语言内置，对应[观察者模式](/behavioral/observer)。

## 社区站点

### Refactoring.Guru [S16]

模式条目按语言切示例（Java、C#、Go、TypeScript 等），每个条目给意图、结构、代码与"如何识别要不要用"。站内条目命名与它一致的地方：创建型/结构型/行为型三分法、代理的四个变体（虚拟、保护、远程、动态）、组合与装饰的对比。差异点：它把"空对象"当独立条目，站内没有，记入差异表。

### SourceMaking [S17]

设计模式与反模式条目带 UML 与优缺点段落。站内反模式四篇的结构（形态、成因、代价、怎么走出来）沿用它的段落顺序；术语"意面代码"的中文译法与它对 Spaghetti Code 的处理一致。

### iluwatar/java-design-patterns [S18]

约百个模式条目的 Java 实现仓库，每条含类图与可运行示例。它收录而站内没有的条目，本次按是否在权威书籍目录里出现决定取舍：

- 在书里有出处的（空对象、仓储、规格、隔舱、熔断）→ 熔断本次补，其余记入差异表；
- 只在社区流传、没有书籍出处的（例如"类别对象"、"环境对象"）→ 不收录。

## 交叉核对的结果

1. 站内并发篇的标准库名与 Java SE 文档一致，本次新增的线程池、读写锁两篇直接以 `ThreadPoolExecutor` 与 `ReentrantReadWriteLock` 为准。
2. 站内 C++ 示例的智能指针赋值用 copy-and-swap 写法，与 Guidelines 的资源管理意图一致（本次一并修正了旧版手写自赋值判断的写法）。
3. Go 示例不出现"继承"字样，组合写法用嵌入表达。
4. 前端示例不写 Vue 2 选项式与 React class 组件，统一用组合式 API 与函数组件。
