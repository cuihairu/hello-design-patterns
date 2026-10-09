# 现代演进导读

GoF 那本书定型于 1994 年 [S1]，它解决的是"在继承体系里复用对象"的问题。之后三十年里三件事把问题改了：语言不再以继承为中心（Go 根本没有继承，Java/C# 的默认选择也从继承变成接口与组合）、代码跑在多机与网络上（故障从"写错"变成"下游不可达"）、依赖由容器统一装配（对象不再自己 new 合作者）。本目录收 GoF 之后仍在演化、且工程上已经形成共识的四篇。

## 本目录的四篇

- [组合式设计](/evolution/composition-over-inheritance)：组合优先于继承的落地写法，Go、Vue、React 三个方向的证据。GoF 自己在书里就写了"优先使用对象组合而非类继承"，本篇讲它在语言层面怎么兑现。
- [SOLID 与依赖规则](/evolution/solid)：五条原则与依赖方向。来源是 Martin 2002 与 2017 两本书 [S3][S4]，Head First 第 2 版把它带进入门读物 [S2]。
- [熔断器](/evolution/circuit-breaker)：跨进程调用失败率超阈值就短路，来自 Release It! [S12]。GoF 的代理与装饰控制的是进程内访问，熔断控制的是网络边界。
- [反模式目录](/anti-patterns/overview) 不在本目录，但它与本目录互为正反面，选题时一起看。

## 与已有分区的关系

| 问题 | 旧分区的做法 | 本目录补的 |
| --- | --- | --- |
| 复用与扩展 | [继承](/behavioral/template-method)、[桥接](/structural/bridge)、[装饰](/structural/decorator) 都能解 | 什么时候不该用继承，怎么用组合写等价代码 |
| 依赖方向 | [依赖注入](/structural/dependency-injection)、[服务定位器](/creational/service-locator) 各讲一半 | 五条原则把"谁该依赖谁"定下来 |
| 调用失败 | [代理](/structural/proxy)、[责任链](/behavioral/chain-of-responsibility) 处理进程内失败 | 网络失败需要时间窗、阈值、半开状态，进程内模式没有这些 |

## 选题口径

进这个目录要满足三条，缺一条记入[差异表](/research/coverage)的"暂不收录"：

1. 有出处：出自书籍或官方文档，不是社区口口相传（对应来源清单 [S1]–[S28]）。
2. 有共识：至少两个主流语言或框架有标准实现。
3. 与 GoF 条目互补而不是换名：换名的写进对应模式篇的别名段，不单开一篇。

按这个口径，隔舱、超时、重试（同出 Release It! [S12]）与仓储、规格（同出 DDD [S11]）列为下一批；架构风格类（分层、管道-过滤器）要先定边界，暂不进。

## 怎么读

先读[组合式设计](/evolution/composition-over-inheritance)，它是后面三篇的共同底座；[SOLID 与依赖规则](/evolution/solid)决定依赖怎么摆；[熔断器](/evolution/circuit-breaker)是唯一一篇跨进程的，读它时把前面两篇当作前提。
