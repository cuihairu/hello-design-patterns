# 金锤子（Golden Hammer）

金锤子是"手里的技术很顺手，于是所有问题都用它解"。AntiPatterns 那本书把它列为最常见的技术类反模式之一 [S7]，特征是技术选型由熟悉度决定，而不是由问题决定。

## 形态

1. 团队的技术方案文档里，某项技术出现在每一栏，连明显不匹配的场景也在。
2. 问"为什么用它"时，答案是"我们熟"或者"以前这么做过"，没有针对这个场景的对比。
3. 需求里出现新约束（强一致、离线、嵌入式体积）时，先想怎么在现有技术上凑，再想换技术。
4. 引入新技术要写三页论证，维持现有技术不用论证。

任何团队都有偏好技术，正常的偏好和金锤子的界线在于：出现不匹配的信号时能不能重新评估。信号包括代码里出现大段绕过框架能力的手写逻辑、配置项数量超过业务代码行数、新人要先学一套自造的抽象才能改业务。

## 代价

- 不匹配的场景里，抽象泄漏要长期补：框架管不到的地方得留逃生口，逃生口最后变成主路。
- 方案成本被低估：看起来"复用现有能力"，实际是把新问题改造成旧工具能处理的形状，改造工作没人算。
- 招聘与维护成本随时间上升：技术栈越窄，能接手的人越少。
- 依赖单点：这个工具的版本升级会牵动全部业务。

## 成因

1. **成功路径依赖**：上个项目靠它成了，团队把"上次的解法"当成"这类问题的解法"。
2. **评估只做一次**：选型时认真比过一次，之后新场景沿用，不再重跑评估。
3. **沉没成本**：已经建了一堆库与工具，换技术意味着这些资产作废，于是继续加功能喂它。

## 走出来

1. **先记账**：把当前技术被硬套的场景列出来，每条写清"为了用它多做了什么"。不带这一步的换技术讨论会变成信仰之争。
2. **挑最小的一块切**：选一个改动频率高、规模小的场景换掉，保留原技术在其他场景不动，用对比结果说话。
3. **留回滚口**：新旧并存期把边界写进接口，别让两边互相 import。
4. **把评估写成门槛**：之后新场景套用这套门槛，回答完"约束是什么、这项技术哪条约束满足不了"再决定沿用。

换技术不是目标，让选型重新与约束挂钩才是。

## 示例

反面：为了不引入规则引擎，把折扣规则写成配置驱动的字符串表达式，再自己实现一个求值器。

```python
class Pricing:
    def __init__(self, rules: list[str]):
        self.rules = rules          # 规则是 "qty>10 and vip" 这类字符串

    def discount(self, order) -> float:
        total = 0.0
        for rule in self.rules:
            if self._eval(rule, order):     # 自造求值器要处理优先级、转义、短路
                total += 5.0
        return total

    def _eval(self, expr, order) -> bool:
        # 手写解析：优先级、括号、错误提示都要自己来，越写越像半个语言
        ...
```

这里真正的问题是"规则会频繁变、由业务方改"。按问题选工具，要么用现成规则引擎，要么用代码表达规则、靠部署发版：

```python
from dataclasses import dataclass
from typing import Callable

Rule = Callable[["Order"], bool]

def qty_over(n: int) -> Rule:
    return lambda o: o.qty > n

def all_of(*rules: Rule) -> Rule:
    return lambda o: all(r(o) for r in rules)

@dataclass
class Pricing:
    rules: list[Rule]

    def discount(self, order) -> float:
        return 5.0 if all_of(*self.rules)(order) else 0.0
```

规则变成可测的函数，优先级、错误提示、解析都不用自己造。如果之后确实需要业务方在线编辑，再把规则来源换成现成引擎，改动只在 `Pricing` 的构造处。

## 相关篇目

- [策略模式](/behavioral/strategy)：把"换算法"做成换一个对象，是治金锤子的第一步。
- [适配器模式](/structural/adapter)：已经套上去、短期换不掉时，用适配器把不匹配的接口挡在边界内。
- [依赖注入](/structural/dependency-injection)：把具体技术藏在构造参数后面，换实现时只动装配处。

## 来源

- [S7] Brown 等，《AntiPatterns》，Wiley，1998。
- [S17] SourceMaking 的 AntiPatterns 条目，形态与代价段落的结构参照。
