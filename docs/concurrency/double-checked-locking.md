# Double-Checked Locking

#### Overview
The double-checked locking pattern is a design pattern used to reduce synchronization overhead, particularly suitable for implementing the Singleton pattern. By performing two checks before and after entering a synchronized code block, the pattern ensures synchronization only occurs when necessary, thereby improving performance.

#### Use cases
- **Singleton pattern**: When implementing the Singleton pattern, ensure the instance is created only once while avoiding the synchronization overhead on every access.
- **Lazy initialization**: Used in scenarios requiring lazy initialization of resources with multi-threaded access.

#### Advantages
- **Performance optimization**: Reduces synchronization overhead; synchronization occurs only during the first instantiation, and subsequent accesses return the instance directly.
- **Thread safety**: Ensures instance uniqueness in multi-threaded environments.

#### Disadvantages
- **Implementation complexity**: In some languages (such as C++), correctly implementing double-checked locking requires extra care and is prone to errors.
- **Memory model dependency**: Under some memory models (such as Java's old memory model), double-checked locking may not work correctly.

#### Example code

##### Java example
In Java, implementing double-checked locking requires using the `volatile` keyword to ensure correct instruction reordering.

```java
public class Singleton {
    private static volatile Singleton instance;

    private Singleton() {
        // private constructor, prevents instantiation
    }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

##### C++ example
In C++11 and later standards, `std::atomic` and `std::call_once` can be used to implement double-checked locking.

```cpp
#include <iostream>
#include <atomic>
#include <mutex>
#include <memory>

class Singleton {
private:
    static std::atomic<Singleton*> instance;
    static std::mutex mtx;

    Singleton() {
        // private constructor, prevents instantiation
    }

public:
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    static Singleton* getInstance() {
        Singleton* tmp = instance.load(std::memory_order_acquire);
        if (!tmp) {
            std::lock_guard<std::mutex> lock(mtx);
            tmp = instance.load(std::memory_order_relaxed);
            if (!tmp) {
                tmp = new Singleton();
                instance.store(tmp, std::memory_order_release);
            }
        }
        return tmp;
    }
};

std::atomic<Singleton*> Singleton::instance(nullptr);
std::mutex Singleton::mtx;

int main() {
    Singleton* s1 = Singleton::getInstance();
    Singleton* s2 = Singleton::getInstance();
    std::cout << (s1 == s2) << std::endl;  // prints 1 indicating the same instance
    return 0;
}
```

##### Go example
In Go, `sync.Once` can be used to implement a thread-safe Singleton pattern.

```go
package main

import (
    "fmt"
    "sync"
)

type Singleton struct{}

var instance *Singleton
var once sync.Once

func GetInstance() *Singleton {
    once.Do(func() {
        instance = &Singleton{}
    })
    return instance
}

func main() {
    s1 := GetInstance()
    s2 := GetInstance()
    fmt.Println(s1 == s2)  // prints true indicating the same instance
}
```

### Summary
The double-checked locking pattern performs two checks before and after entering a synchronized code block, ensuring synchronization only occurs when necessary, thereby improving performance. This pattern is particularly suitable for implementing the Singleton pattern, reducing synchronization overhead while maintaining thread safety. However, when implementing it in different programming languages, attention must be paid to the language's memory model and concurrency control mechanisms to ensure correctness and effectiveness.

## Sources

- [Wikipedia · Double-checked locking](https://en.wikipedia.org/wiki/Double-checked_locking)
- [Pugh · Double-Checked Locking is Broken](https://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html) (A failure case under the Java Memory Model)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [read-write-lock](read-write-lock.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [official-docs](/research/official-docs.md)
