# Composition over Inheritance

Composition-first design means "compose behavior from the holding relationships between objects, not from the inheritance relationships between classes." GoF wrote this principle right in the book: favor object composition over class inheritance [S1]. Its modern form is not a slogan but the same set of idioms from three languages: Go with struct embedding, Vue with the Composition API [S22], and React with component nesting and custom hooks [S23].

## Two structural problems with inheritance

1. **Welded on at compile time**: a subclass picks its parent in the class declaration and cannot change it at runtime. To "swap a capability" you must swap classes and re-instantiate — exactly what [Strategy](/behavioral/strategy) sets out to avoid.
2. **Coupling spreads**: change the semantics of one protected method in a parent and every subclass is affected, while the compiler will not tell you which subclasses depend on that semantics. With composition, a change reaches only the objects that hold it directly.

White-box reuse (inheritance, where a subclass can see the parent's implementation) is cheap up front and expensive later; black-box reuse (composition, collaborating only through interfaces) means writing a few forwarding methods up front, in exchange for capabilities that can be swapped and tested in isolation.

## The idiom in three languages

### Go: embedding and small interfaces

Go has no inheritance; `struct` embedding provides promoted methods directly, and behavior is composed through interface composition:

```go
type Reader interface {
    Read(p []byte) (int, error)
}

type CountingReader struct {
    Reader                 // embed the interface, get the Read capability
    n int64
}

func (c *CountingReader) Read(p []byte) (int, error) {
    n, err := c.Reader.Read(p)
    c.n += int64(n)
    return n, err
}

func (c *CountingReader) BytesRead() int64 { return c.n }
```

`CountingReader` can wrap any `Reader` and can swap the wrapped object at runtime. This is the unified Go form of Decorator, Proxy, and Adapter: all three Go examples on this site use the composition idiom of an interface plus a held struct, with the only difference being that some hold it in a field while others use embedding.

### Vue: the Composition API

The Options API splits code by option (`data`, `methods`, `watch` each written separately), so the code for one feature is scattered across four places; the Composition API collects by feature ([S22]):

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

// inside a component
const { list, loading, load } = useOrders(api.fetchOrders)
```

The unit of reuse is a function whose return value is composed into the component; swap the data source by swapping the argument, without touching the component. Compare with a mixin: a mixin's state and lifecycle are mixed in by merge rules with their origin untraceable, while a function's return values are explicit.

### React: component nesting and custom hooks

React's official docs put "composition" at the center of component design [S23]: UI is composed by nesting components plus props, repeated logic is collected into custom hooks, and when state is not enough you lift state up:

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

`Panel`, `Greeting`, and `UserAvatar` are independent of each other and depend only on props; `useOrders` returns into the component with no implicit injection. React's official guidance explicitly does not recommend inheriting to reuse component logic, for reasons consistent with GoF.

## When to use inheritance

Three cases where inheritance can stay:

1. **A genuine "is-a" relationship exists and the implementation is the same too**: `ArrayList` is a kind of `List`. Here inheritance expresses a type relationship, not a reuse mechanism.
2. **A framework constraint**: Template Method requires subclasses to override certain steps, and [Template Method](/behavioral/template-method) must use inheritance — that is the cost it pays, and the corresponding piece on this site covers how to contain it.
3. **A library's public API is already fixed**: switching to composition would break existing callers, so compatibility wins.

Go's `embed` and C++ private inheritance ("implement using it" rather than "is a kind of it") show that a type meaning of inheritance and a reuse meaning of inheritance can be used separately; the danger comes only when the two are mixed together.

## The order to migrate

1. Find the middle layers in the inheritance tree that exist "for reuse" — they carry no type meaning, only code.
2. Move the middle layer's fields and methods into a new class, and change the parent to hold a field of that type.
3. Change the externally exposed methods into forwarding calls; caller signatures stay unchanged, and get the regression running first.
4. Where runtime switching is needed, change the field's type to a small interface. See [Strategy](/behavioral/strategy) and [Bridge](/structural/bridge).

## Related readings

- [Strategy](/behavioral/strategy), [State](/behavioral/state): two typical cases of composition replacing inheritance branches.
- [Decorator](/structural/decorator), [Proxy](/structural/proxy), [Adapter](/structural/adapter): the three structural forms of composition, with isomorphic Go examples.
- [Template Method](/behavioral/template-method): the scenarios and cost where inheritance is mandatory (more subclasses, easy to violate LSP).
- [SOLID and Dependency Rules](/evolution/solid): once composition replaces inheritance, dependency direction is set by this.

## Sources

- [S1] GoF, *Design Patterns*, 1994, "favor object composition over class inheritance."
- [S2] *Head First Design Patterns*, 2nd edition, 2020, the trade-off chapter between composition and inheritance.
- [S22] Vue.js official documentation, the Composition API.
- [S23] React official documentation, component composition and state management.
- [S21] Go official documentation, the embedding and interfaces section of Effective Go.

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [solid](solid.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
- [official-docs](/research/official-docs.md)
