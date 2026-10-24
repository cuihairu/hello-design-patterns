# Iterator

The Iterator pattern is a behavioral design pattern that allows you to traverse the elements of an aggregate object sequentially without exposing its internal representation. With this pattern, you can iterate over different types of collection objects, making the implementation details of the collection transparent to the client.

### Components of the Iterator pattern

1. **Iterator interface (Iterator)**: Defines the methods for accessing and traversing elements.
2. **Concrete iterator (Concrete Iterator)**: Implements the iterator interface and is responsible for traversing the collection object.
3. **Aggregate interface (Aggregate)**: Defines the method for creating an iterator.
4. **Concrete aggregate (Concrete Aggregate)**: Implements the aggregate interface and returns an instance of a concrete iterator.

### Advantages of the Iterator pattern

1. **Simplified traversal**: The client can traverse different collection objects using a unified interface, without needing to know the internal implementation of the collection.
2. **Improved flexibility**: New iterators can be defined without changing the collection object, to support different traversal needs.
3. **Follows the single responsibility principle**: Traversal logic is separated from the collection object, focusing solely on the traversal behavior.

### Disadvantages of the Iterator pattern

1. **Overhead**: To support iterators, the collection object and the iterator implementation may incur additional overhead.
2. **Complexity**: The number of classes and interfaces increases, making the system structure more complex.

### Use cases

1. **Accessing the contents of a collection object without exposing its internal representation**.
2. **When a collection object needs to support multiple kinds of traversal**.
3. **When a unified interface is needed to traverse different types of collections**.

### Example code

#### C++ Implementation

```cpp
#include <iostream>
#include <vector>

class Iterator {
public:
    virtual ~Iterator() = default; // Virtual destructor, so that deleting a derived object through a base class pointer is well-defined
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

#### Go Implementation

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

#### Java Implementation

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

### Summary of advantages and disadvantages

#### Advantages
1. **Unified interface**: Provides a unified interface for traversing different types of collection objects.
2. **Simplified client code**: The client does not need to know the specific implementation details of the collection object; it only needs to use the iterator interface to traverse the collection.
3. **Follows the single responsibility principle**: The behavior of traversing a collection is separated from the collection object and is handled solely by the iterator.

#### Disadvantages
1. **Overhead**: Additional overhead may be introduced, particularly when implementing and maintaining complex iterators.
2. **Complexity**: The number of classes and interfaces increases, which may make the system structure more complex.

The Iterator pattern is a useful tool, especially in scenarios that require traversing different types of collection objects, where it can provide a concise and unified access interface.

## Sources

- [S1] GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · Iterator pattern](https://en.wikipedia.org/wiki/Iterator_pattern)
- [Refactoring.Guru · Iterator](https://refactoring.guru/design-patterns/iterator)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
- [official-docs](/research/official-docs.md)
