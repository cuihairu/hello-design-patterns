# Singleton

### Introduction to Singleton

The Singleton Pattern is a creational design pattern that ensures a class has only one instance and provides a global access point to it. It is commonly used in scenarios that require controlling resource access or sharing global data.

#### Use cases

- **Logging system**: Ensures the log file object has only one instance in the system.
- **Configuration file management**: Shares and accesses configuration files throughout a program.
- **Thread pool**: Shares and manages a thread pool instance in a multithreaded environment.
- **Database connection pool**: Manages database connections, reducing the overhead of creating and destroying connections.

### Implementing Singleton

Singleton can be implemented in many languages. The examples below show implementations in C++ and Go.

#### C++ Implementation

**Lazy initialization**: The instance is created only on the first access.

```cpp
#include <iostream>
#include <mutex>
#include <atomic>

class Singleton {
private:
    // Use atomic to ensure the first lock-free read does not constitute a data race (C++11 memory model)
    static std::atomic<Singleton*> instance;
    static std::mutex mtx;

    // Private constructor to prevent external instantiation
    Singleton() {}

public:
    // Disable copy constructor and assignment operator
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    // Static method that returns the singleton instance
    static Singleton* getInstance() {
        Singleton* tmp = instance.load(std::memory_order_acquire);
        if (tmp == nullptr) {
            std::lock_guard<std::mutex> lock(mtx);
            tmp = instance.load(std::memory_order_relaxed);
            if (tmp == nullptr) {
                tmp = new Singleton();
                instance.store(tmp, std::memory_order_release);
            }
        }
        return tmp;
    }

    void showMessage() {
        std::cout << "Hello, Singleton!" << std::endl;
    }
};

// Initialize static member variables
std::atomic<Singleton*> Singleton::instance{nullptr};
std::mutex Singleton::mtx;

int main() {
    Singleton* singleton = Singleton::getInstance();
    singleton->showMessage();
    return 0;
}
```

**Eager initialization**: The instance is created when the program starts running.

```cpp
#include <iostream>

class Singleton {
private:
    static Singleton* instance;

    // Private constructor to prevent external instantiation
    Singleton() {}

public:
    // Disable copy constructor and assignment operator
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    // Static method that returns the singleton instance
    static Singleton* getInstance() {
        return instance;
    }

    void showMessage() {
        std::cout << "Hello, Singleton!" << std::endl;
    }
};

// Initialize static member variables
Singleton* Singleton::instance = new Singleton();

int main() {
    Singleton* singleton = Singleton::getInstance();
    singleton->showMessage();
    return 0;
}
```

#### Go Implementation

Go has no concept of classes, but Singleton can be implemented using a struct and a package-level variable.

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

func (s *Singleton) ShowMessage() {
	fmt.Println("Hello, Singleton!")
}

func main() {
	singleton := GetInstance()
	singleton.ShowMessage()
}
```

### Summary

Singleton is a design pattern used to ensure that a class has only one instance. In C++, it can be implemented with both lazy and eager initialization, while in Go, `sync.Once` can be used to ensure that only one instance is created. The Singleton pattern is very useful when global shared resources are needed or resource access needs to be controlled.

## Sources

- [S1] GoF creational catalog (Chapter 3), the original source of this pattern.
- [Wikipedia · Singleton pattern](https://en.wikipedia.org/wiki/Singleton_pattern)
- [Refactoring.Guru · Singleton](https://refactoring.guru/design-patterns/singleton)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](/anti-patterns/overview.md)
- [overview](overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
