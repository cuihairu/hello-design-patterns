# 组合式设计（组合优于继承）

组合式设计指"用对象之间的持有关系拼出行为，而不是用类之间的继承关系拼出行为"。GoF 在书里就写下了这条原则：优先使用对象组合而非类继承 [S1]。它的现代形态不是一句口号，而是三种语言给出的同一套写法：Go 用结构体嵌入，Vue 用组合式 API [S22]，React 用组件嵌套与自定义 Hook [S23]。

## 继承的两个结构性问题

1. **编译期就焊死**：子类在类声明处选定父类，运行时换不了。要"换一个能力"就得换类、重新实例化，[策略模式](/behavioral/strategy)想做的事情做不到。
2. **耦合扩散**：父类改一个 protected 方法的语义，所有子类一起受影响，而编译器不会告诉你哪些子类依赖了这条语义。用组合时，改动只波及直接持有它的对象。

白盒复用（继承，子类能看到父类实现）省事在前，代价在后；黑盒复用（组合，只通过接口协作）前期多写几个转发方法，换来实现可换、可单独测试。

## 三种语言的写法

### Go：嵌入与小接口

Go 没有继承，`struct` 嵌入直接提供方法提升（promoted methods），行为拼装靠接口组合：

```go
type Reader interface {
    Read(p []byte) (int, error)
}

type CountingReader struct {
    Reader                 // 嵌入接口，拿到 Read 的能力
    n int64
}

func (c *CountingReader) Read(p []byte) (int, error) {
    n, err := c.Reader.Read(p)
    c.n += int64(n)
    return n, err
}

func (c *CountingReader) BytesRead() int64 { return c.n }
```

`CountingReader` 可以包任何 `Reader`，也可以在运行时换掉被包装的对象。这是装饰、代理、适配器三种模式在 Go 里的统一形态：站内这三篇的 Go 示例都是接口加结构体持有的组合写法，只是有的用字段持有、没有用嵌入。

### Vue：组合式 API

选项式 API 按选项分（`data`、`methods`、`watch` 分开写），同一个功能的代码散在四处；组合式 API 按功能收（[S22]）：

```js
import { ref, onMounted } from 'vue'

export function useOrders(fetcher) {
  const list = ref([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      list.value = await fetcher()
    } finally {
      loading.value = false
    }
  }

  onMounted(load)
  return { list, loading, load }
}

// 组件里
const { list, loading, load } = useOrders(api.fetchOrders)
```

复用单元是一个函数，返回值组合进组件；换数据源就换参数，不改组件。对比 mixin：mixin 的状态与生命周期按合并规则混入，来源看不出来，函数返回值则是显式的。

### React：组件嵌套与自定义 Hook

React 的官方文档把"组合"放在组件设计的核心位置 [S23]：UI 用组件嵌套加 props 拼，重复逻辑用自定义 Hook 收口，状态不够用就状态提升：

```jsx
function Page({ user }) {
  return (
    <Panel>
      <Greeting name={user.name} />
      <UserAvatar user={user} />
    </Panel>
  );
}

function useOrders(fetcher) {
  const [list, setList] = useState([]);
  useEffect(() => { fetcher().then(setList); }, [fetcher]);
  return list;
}
```

`Panel`、`Greeting`、`UserAvatar` 互不依赖，只依赖 props；`useOrders` 返回值进组件，没有隐式注入。React 官方明确不推荐用继承复用组件逻辑，理由与 GoF 一致。

## 什么时候该用继承

三条可以留继承的情况：

1. **确实存在"是一个"关系且实现也一样**：`ArrayList` 是 `List` 的一种，这种时候继承表达的是类型关系，不是复用手段。
2. **框架约束**：模板方法模式要求子类覆盖某些步骤，[模板方法](/behavioral/template-method)必须用继承，这是它自己付出的代价，站内该篇写了怎么控制。
3. **类库的公开 API 已经定型**：改成组合会破坏既有调用方，按兼容性优先。

Go 的 `embed` 与 C++ 的私有继承（"用它实现"而非"是它一种"）说明：继承的类型含义和复用含义可以分开用，只有把两者混在一起时才危险。

## 走出来的顺序

1. 找出继承树里"为了复用而存在"的中间层，它没有类型含义，只有代码。
2. 把中间层的字段与方法搬进一个新类，父类改成持有一个该类型的字段。
3. 对外暴露的方法改成转发调用，调用方签名不变，先跑通回归。
4. 需要运行时切换的，把字段类型换成小接口，见[策略](/behavioral/strategy)与[桥接](/structural/bridge)。

## 相关篇目

- [策略模式](/behavioral/strategy)、[状态模式](/behavioral/state)：组合换掉继承分支的两个典型。
- [装饰](/structural/decorator)、[代理](/structural/proxy)、[适配器](/structural/adapter)：组合在结构型上的三种形态，Go 示例同构。
- [模板方法](/behavioral/template-method)：必须用继承的场景与代价（子类数量增加、易违反 LSP）。
- [SOLID 与依赖规则](/evolution/solid)：组合替继承之后，依赖方向靠它定。

## 来源

- [S1] GoF《Design Patterns》，1994，"优先使用对象组合而非类继承"。
- [S2] 《Head First Design Patterns》第 2 版，2020，组合与继承的取舍章节。
- [S22] Vue.js 官方文档，组合式 API。
- [S23] React 官方文档，组件组合与状态管理。
- [S21] Go 官方文档，Effective Go 的嵌入与接口部分。
