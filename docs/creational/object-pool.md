# Object Pool

The Object Pool Pattern is a creational design pattern used to manage and reuse a group of pre-created objects instead of creating and destroying objects every time they are needed. This pattern can significantly improve performance, especially when creating and destroying objects is expensive or when the number of objects is large. The Object Pool Pattern is commonly used for database connections, thread pools, string buffer pools, and similar scenarios.

### Structure of the Object Pool Pattern

The Object Pool Pattern mainly consists of the following parts:

1. **Object Pool**: manages a pool of objects, responsible for providing and reclaiming them.
2. **Reusable**: objects that can be managed by the pool; they must implement certain interfaces so that their state can be reset when reclaimed.
3. **Client**: clients that use the pool, obtaining objects from it for use.

### Workflow of the Object Pool Pattern

1. **Initialization**: create a certain number of reusable objects and put them in the pool.
2. **Acquire an object**: when a client needs an object, take one available object out of the pool.
3. **Use the object**: the client uses the acquired object to complete a task.
4. **Return the object**: after use, the client returns the object to the pool so that other clients can use it.

### Advantages of the Object Pool Pattern

1. **Performance improvement**: reduces frequent object creation and destruction, lowering the frequency of garbage collection.
2. **Resource management**: manages limited resources (such as database connections and threads) effectively and avoids resource leaks.
3. **Scalability**: by adjusting the pool size, resource usage can be conveniently controlled.

### Disadvantages of the Object Pool Pattern

1. **Implementation complexity**: managing and maintaining the pool is relatively complex and requires handling synchronization in multithreaded environments.
2. **Initial cost**: a large number of objects must be created during initialization, which may incur some performance overhead.

### Example code

The following is a simple example of the Object Pool Pattern:

```python
class Reusable:
    def __init__(self):
        self.state = "initial state"

    def reset(self):
        self.state = "initial state"


class ObjectPool:
    def __init__(self, size):
        self.pool = [Reusable() for _ in range(size)]
        self.available = [True] * size

    def acquire(self):
        for i in range(len(self.pool)):
            if self.available[i]:
                self.available[i] = False
                return self.pool[i]
        return None  # If no object is available, you could grow the pool or wait

    def release(self, obj):
        for i in range(len(self.pool)):
            if self.pool[i] == obj:
                obj.reset()
                self.available[i] = True
                break


# Usage example
if __name__ == "__main__":
    pool = ObjectPool(2)
    obj1 = pool.acquire()
    obj2 = pool.acquire()
    obj3 = pool.acquire()  # Should return None, because the pool only has two objects

    if obj1:
        print(f"Acquired object 1: {obj1.state}")
        obj1.state = "used"
        pool.release(obj1)

    if obj2:
        print(f"Acquired object 2: {obj2.state}")
        obj2.state = "used"
        pool.release(obj2)

    if obj3:
        print(f"Acquired object 3: {obj3.state}")  # Will not run, because obj3 is None

    # Acquire an object again
    obj1 = pool.acquire()
    print(f"Reacquired object 1: {obj1.state}")  # Should print "initial state"
```

In this example, we create an object pool containing two `Reusable` objects. We acquire objects from the pool, use them, and then return them to the pool. Objects are reset to their initial state when returned, so they can be reused.

### Implementing the Object Pool Pattern in C++

#### Use cases

In game development, large numbers of bullet objects are often created and destroyed frequently. Using the Object Pool Pattern avoids repeated memory allocation and reclamation and improves performance.

#### C++ code example

```cpp
#include <iostream>
#include <vector>
#include <memory>

class Bullet {
public:
    void reset() {
        // Reset the bullet state
        active = false;
    }

    void activate() {
        active = true;
    }

    bool isActive() const {
        return active;
    }

private:
    bool active = false;
};

class BulletPool {
public:
    BulletPool(size_t size) {
        for (size_t i = 0; i < size; ++i) {
            pool.push_back(std::make_shared<Bullet>());
        }
    }

    std::shared_ptr<Bullet> acquire() {
        for (auto& bullet : pool) {
            if (!bullet->isActive()) {
                bullet->activate();
                return bullet;
            }
        }
        return nullptr; // Pool exhausted
    }

    void release(std::shared_ptr<Bullet> bullet) {
        bullet->reset();
    }

private:
    std::vector<std::shared_ptr<Bullet>> pool;
};

int main() {
    BulletPool pool(5);
    auto b1 = pool.acquire();
    auto b2 = pool.acquire();
    pool.release(b1);
    auto b3 = pool.acquire(); // Reuses b1

    std::cout << "Bullet b3 is active: " << b3->isActive() << std::endl; // Should be true
    return 0;
}
```

#### Advantages

1. **Performance improvement**: reduces the overhead of memory allocation and reclamation.
2. **Resource management**: manages limited resources effectively and avoids resource leaks.

#### Disadvantages

1. **Implementation complexity**: requires handling synchronization in multithreaded environments.
2. **Initial cost**: a large number of objects must be created during initialization, which may incur some performance overhead.

### Implementing the Object Pool Pattern in Go

#### Use cases

In network servers, each request requires creating and destroying many connections. Using the Object Pool Pattern reduces frequent connection creation and destruction and improves server performance.

#### Go code example

```go
package main

import (
    "fmt"
    "sync"
)

type Connection struct {
    active bool
}

func (c *Connection) reset() {
    c.active = false
}

func (c *Connection) activate() {
    c.active = true
}

type ConnectionPool struct {
    pool      []*Connection
    available []bool
    mutex     sync.Mutex
}

func NewConnectionPool(size int) *ConnectionPool {
    pool := make([]*Connection, size)
    available := make([]bool, size)
    for i := 0; i < size; i++ {
        pool[i] = &Connection{}
        available[i] = true
    }
    return &ConnectionPool{pool: pool, available: available}
}

func (cp *ConnectionPool) Acquire() *Connection {
    cp.mutex.Lock()
    defer cp.mutex.Unlock()
    for i, available := range cp.available {
        if available {
            cp.available[i] = false
            cp.pool[i].activate()
            return cp.pool[i]
        }
    }
    return nil // Pool exhausted
}

func (cp *ConnectionPool) Release(conn *Connection) {
    cp.mutex.Lock()
    defer cp.mutex.Unlock()
    for i, poolConn := range cp.pool {
        if poolConn == conn {
            conn.reset()
            cp.available[i] = true
            break
        }
    }
}

func main() {
    pool := NewConnectionPool(2)
    conn1 := pool.Acquire()
    conn2 := pool.Acquire()
    pool.Release(conn1)
    conn3 := pool.Acquire() // Reuses conn1

    fmt.Println("Connection conn3 is active:", conn3.active) // Should be true

    pool.Release(conn2) // Return conn2 to the pool after use
    fmt.Println("Connection conn2 released back to pool")
}
```

#### Advantages

1. **Performance improvement**: reduces the overhead of creating and destroying connections.
2. **Resource management**: manages limited resources effectively and avoids resource leaks.

#### Disadvantages

1. **Implementation complexity**: requires handling synchronization in multithreaded environments.
2. **Initial cost**: a large number of objects must be created during initialization, which may incur some performance overhead.

### Implementing the Object Pool Pattern in Java

#### Use cases

In web applications, database connections are a limited resource. Using the Object Pool Pattern reduces frequent creation and destruction of database connections, improving application performance and response time.

#### Java code example

```java
import java.util.ArrayList;
import java.util.List;

class DatabaseConnection {
    private boolean active;

    public void reset() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    public boolean isActive() {
        return active;
    }
}

class ConnectionPool {
    private List<DatabaseConnection> pool;
    private List<Boolean> available;

    public ConnectionPool(int size) {
        pool = new ArrayList<>(size);
        available = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            pool.add(new DatabaseConnection());
            available.add(true);
        }
    }

    public synchronized DatabaseConnection acquire() {
        for (int i = 0; i < pool.size(); i++) {
            if (available.get(i)) {
                available.set(i, false);
                pool.get(i).activate();
                return pool.get(i);
            }
        }
        return null; // Pool exhausted
    }

    public synchronized void release(DatabaseConnection conn) {
        for (int i = 0; i < pool.size(); i++) {
            if (pool.get(i) == conn) {
                conn.reset();
                available.set(i, true);
                break;
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        ConnectionPool pool = new ConnectionPool(2);
        DatabaseConnection conn1 = pool.acquire();
        DatabaseConnection conn2 = pool.acquire();
        pool.release(conn1);
        DatabaseConnection conn3 = pool.acquire(); // Reuses conn1

        System.out.println("Connection conn3 is active: " + conn3.isActive()); // Should be true
    }
}
```

#### Advantages

1. **Performance improvement**: reduces the overhead of creating and destroying database connections.
2. **Resource management**: manages limited database connections effectively, avoiding connection exhaustion and leaks.

#### Disadvantages

1. **Implementation complexity**: requires handling synchronization in multithreaded environments.
2. **Initial cost**: a large number of connection objects must be created during initialization, which may incur some performance overhead.

### Summary

The Object Pool Pattern is very useful in scenarios where objects are created and destroyed frequently; it can significantly improve performance and manage resources effectively. Although the implementation is relatively complex, with appropriate synchronization and resource management it can greatly optimize system performance and resource utilization.

## Sources

- Object pool is not in the [S1] catalog; for the term see [Wikipedia · Object pool pattern](https://en.wikipedia.org/wiki/Object_pool_pattern).
- [Apache Commons Pool](https://commons.apache.org/proper/commons-pool/) (the standard implementation in the Java ecosystem).
- [Wikipedia · Thread pool](https://en.wikipedia.org/wiki/Thread_pool) (the thread-resource version of the same idea)

<!-- BACKLINKS-AUTO -->
## Related pages

- [read-write-lock](/concurrency/read-write-lock.md)
- [thread-pool](/concurrency/thread-pool.md)
- [overview](overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
