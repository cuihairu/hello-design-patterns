# 迭代器模式

迭代器模式（Iterator Pattern）是一种行为设计模式，允许顺序访问一个聚合对象的元素，而无需暴露其内部表示。通过这个模式，可以遍历不同类型的集合对象，使得集合的实现细节对客户端透明。

### 迭代器模式的组成部分

1. **迭代器接口（Iterator）**：定义访问和遍历元素的方法。
2. **具体迭代器（Concrete Iterator）**：实现迭代器接口，负责遍历集合对象。
3. **聚合接口（Aggregate）**：定义创建迭代器的方法。
4. **具体聚合（Concrete Aggregate）**：实现聚合接口，返回具体迭代器的实例。

### 迭代器模式的优点

1. **简化遍历**：客户端可以使用统一的接口遍历不同的集合对象，无需了解集合的内部实现。
2. **提高灵活性**：可以在不改变集合对象的情况下定义新的迭代器，以支持不同的遍历需求。
3. **遵循单一职责原则**：将遍历逻辑从集合对象中分离出来，专注于遍历行为。

### 迭代器模式的缺点

1. **开销**：为了支持迭代器，集合对象和迭代器的实现可能会有额外的开销。
2. **复杂性**：增加了类和接口的数量，使系统结构变得更复杂。

### 适用场景

1. **访问一个集合对象的内容而无需暴露其内部表示**。
2. **需要对集合对象进行多种遍历**。
3. **提供一个统一的接口遍历不同类型的集合**。

### 示例代码

#### C++ 实现

```cpp
#include <iostream>
#include <vector>

class Iterator {
public:
    virtual int next() = 0;
    virtual bool hasNext() = 0;
};

class ConcreteIterator : public Iterator {
private:
    std::vector<int> collection;
    int position = 0;

public:
    ConcreteIterator(const std::vector<int>& collection) : collection(collection) {}

    int next() override {
        return collection[position++];
    }

    bool hasNext() override {
        return position < collection.size();
    }
};

class Aggregate {
public:
    virtual Iterator* createIterator() = 0;
};

class ConcreteAggregate : public Aggregate {
private:
    std::vector<int> collection;

public:
    void addItem(int item) {
        collection.push_back(item);
    }

    Iterator* createIterator() override {
        return new ConcreteIterator(collection);
    }
};

int main() {
    ConcreteAggregate aggregate;
    aggregate.addItem(1);
    aggregate.addItem(2);
    aggregate.addItem(3);

    Iterator* iterator = aggregate.createIterator();
    while (iterator->hasNext()) {
        std::cout << iterator->next() << " ";
    }
    std::cout << std::endl;

    delete iterator;
    return 0;
}
```

#### Go 实现

```go
package main

import "fmt"

type Iterator interface {
	Next() int
	HasNext() bool
}

type ConcreteIterator struct {
	collection []int
	position   int
}

func (it *ConcreteIterator) Next() int {
	item := it.collection[it.position]
	it.position++
	return item
}

func (it *ConcreteIterator) HasNext() bool {
	return it.position < len(it.collection)
}

type Aggregate interface {
	CreateIterator() Iterator
}

type ConcreteAggregate struct {
	collection []int
}

func (a *ConcreteAggregate) AddItem(item int) {
	a.collection = append(a.collection, item)
}

func (a *ConcreteAggregate) CreateIterator() Iterator {
	return &ConcreteIterator{collection: a.collection}
}

func main() {
	aggregate := &ConcreteAggregate{}
	aggregate.AddItem(1)
	aggregate.AddItem(2)
	aggregate.AddItem(3)

	iterator := aggregate.CreateIterator()
	for iterator.HasNext() {
		fmt.Print(iterator.Next(), " ")
	}
	fmt.Println()
}
```

#### Java 实现

```java
import java.util.ArrayList;
import java.util.List;

interface Iterator {
    boolean hasNext();
    int next();
}

class ConcreteIterator implements Iterator {
    private List<Integer> collection;
    private int position = 0;

    public ConcreteIterator(List<Integer> collection) {
        this.collection = collection;
    }

    public boolean hasNext() {
        return position < collection.size();
    }

    public int next() {
        return collection.get(position++);
    }
}

interface Aggregate {
    Iterator createIterator();
}

class ConcreteAggregate implements Aggregate {
    private List<Integer> collection = new ArrayList<>();

    public void addItem(int item) {
        collection.add(item);
    }

    public Iterator createIterator() {
        return new ConcreteIterator(collection);
    }
}

public class IteratorPatternDemo {
    public static void main(String[] args) {
        ConcreteAggregate aggregate = new ConcreteAggregate();
        aggregate.addItem(1);
        aggregate.addItem(2);
        aggregate.addItem(3);

        Iterator iterator = aggregate.createIterator();
        while (iterator.hasNext()) {
            System.out.print(iterator.next() + " ");
        }
        System.out.println();
    }
}
```

### 优缺点总结

#### 优点
1. **统一接口**：提供一个统一的接口来遍历不同类型的集合对象。
2. **简化客户端代码**：客户端不需要知道集合对象的具体实现细节，只需使用迭代器接口即可遍历集合。
3. **遵循单一职责原则**：将遍历集合的行为从集合对象中分离出来，专门由迭代器负责。

#### 缺点
1. **开销**：可能会引入额外的开销，特别是在实现和维护复杂的迭代器时。
2. **复杂性**：增加了类和接口的数量，可能使系统结构变得更加复杂。

迭代器模式是一个有用的工具，特别是在需要遍历不同类型集合对象的场景中，能够提供简洁和统一的访问接口。