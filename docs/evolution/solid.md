# SOLID 与依赖规则

SOLID 是五条类与组件设计原则的首字母缩写，出处是 Martin 2002 年那本书 [S4]，2017 年的《架构整洁之道》把它与依赖规则、组件原则合在一起讲 [S3]。它的作用不是让代码"更优雅"，而是给出一个可检查的判断：改一个需求时，需要动的文件有几个。

## 五条原则与站内对应

### 单一职责（SRP）

一个类只有一个引起它变化的理由。判断方法是把"将来可能变化的原因"列出来，超过一条就该拆。

站内对应：[神对象](/anti-patterns/god-object)是 SRP 反面的极端形态，其"按不变式分组搬字段"的拆法就是按职责分。

### 开闭原则（OCP）

对扩展开放、对修改关闭。新增一种情况时应当新增文件，而不是在已有 `switch` 里加分支。

站内对应：[策略](/behavioral/strategy)把"算法可换"做成加一个类；[工厂方法](/creational/factory-method)与[抽象工厂](/creational/abstract-factory)把"实例化哪个类"挪出调用方；[装饰](/structural/decorator)在不改原类的前提下叠职责。Head First 在观察者一章讲的就是这条 [S2]。

### 里氏替换（LSP）

子类替换父类后，调用方不该察觉。违反的典型是子类抛出父类不抛的异常、或者要求调用方先调某个子类特有的方法。

站内对应：组合替代继承可直接绕开这条约束，见[组合式设计](/evolution/composition-over-inheritance)；留下的继承则要求子类实现完整语义，[模板方法](/behavioral/template-method)的骨架方法就是靠这个约定工作的。

### 接口隔离（ISP）

不要强迫实现方实现它用不到的方法。接口按使用方的需要拆，而不是按提供方的能力列。

站内对应：Go 的"接口由使用方定义"是 ISP 的语言级实现 [S21]；[适配器](/structural/adapter)常做的正是把胖接口切成几个小接口再分别提供。

### 依赖倒置（DIP）

高层模块不依赖低层模块，两者都依赖抽象；抽象不依赖细节，细节依赖抽象。

站内对应：[依赖注入](/structural/dependency-injection)是 DIP 的装配手段，[服务定位器](/creational/service-locator)是它的另一种做法但把依赖藏进了实现（Fowler 把后者列为反模式 [S26]）。两篇对照读。

## 依赖规则

《架构整洁之道》[S3] 在五条之上加了一条方向约束：源代码依赖只能指向内层，内层不知道外层的存在。

```
实体（企业规则） ← 用例（应用规则） ← 接口适配器 ← 框架与驱动
        越往内越稳定，越往外越易变
```

含义是具体的：领域层不能 import 框架的注解，不能出现数据库连接、HTTP 请求这些词。站内[贫血模型](/anti-patterns/anemic-domain-model)的改造之所以把规则搬回实体，正是为了让内层不再依赖外层的仓储与服务。

## 组件级三原则（延伸）

《架构整洁之道》还给了包与组件级别的三条：复用与使用等价（不能让同一个组件既被使用又依赖使用者）、稳定依赖（不稳定的东西依赖稳定的）、无环依赖（包之间不能成环，用依赖倒置破环）。站内暂无组件设计专篇；同书的分层架构、管道-过滤器按[差异表](/research/coverage)已定的口径（约束全系统拓扑的架构风格不收）维持不收录，需要时以 [S3] 原书为准。

## 用它做一次体检

按这五步过一个模块，产出是几份可执行的清单，不是一份评分：

1. 列出模块里每个类的"变化理由"，重复的合并，超过一条的标 SRP 问题。
2. 找所有 `switch`/`if-else` 按类型分支的地方，逐条问"新增一种要改几个文件"，两个以上的标 OCP 问题。
3. 找子类，看有没有父类没要求、子类却抛出或抛回的异常，标 LSP 问题。
4. 找实现方从没用过的方法，标 ISP 问题。
5. 找领域代码里的框架注解、SQL 字符串、URL 字面量，标 DIP 问题。

标完按"改一个需求要动几个文件"排序，先动最疼的那个。这比一次改完所有问题有效：一次改完的重构通常没有回归保护，见[意面代码](/anti-patterns/spaghetti-code)第 1 步。

## 五条原则不是目标

原则是代价的记账方式。每个 `interface` 都要付出多一层间接的阅读成本，每拆一个类都要付出多一次跳转的阅读成本。什么时候值得：预计会变的地方才值得按原则切，一次性脚本按原则切只会更难读。Martin 自己在 [S3] 里的口径也是按稳定度分层，不是要求所有代码都做到五条。

## 相关篇目

- [组合式设计](/evolution/composition-over-inheritance)：LSP 的绕开方式，也是五条原则的共同底座。
- [依赖注入](/structural/dependency-injection)、[服务定位器](/creational/service-locator)：DIP 的两种落法。
- [策略](/behavioral/strategy)、[工厂方法](/creational/factory-method)、[装饰](/structural/decorator)：OCP 的三个常用工具。
- [反模式导读](/anti-patterns/overview)：五条的反面案例在这里。

## 来源

- [S3] Robert C. Martin，《Clean Architecture》，2017。依赖规则与组件原则。
- [S4] Robert C. Martin，《Agile Software Development: Principles, Patterns, and Practices》，2002。SOLID 出处。
- [S2] 《Head First Design Patterns》第 2 版，2020，开闭原则的入门讲法。
- [S26] martinfowler.com bliki，服务定位器作为反模式的论述。
