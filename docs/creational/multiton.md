# Multiton

#### Overview

The Multiton Pattern is a design pattern aimed at ensuring that a class has at most one instance per given key. It is similar to the Singleton Pattern, but allows multiple controlled instances to exist, each corresponding to a specific key or context. The Multiton Pattern is useful in situations that require a bounded set of instances, such as a connection pool per database instance, or configuration managers.

#### Use cases

1. **Configuration manager**: one instance per configuration file.
2. **Database connection pool**: one connection pool instance per database.
3. **Logger**: one instance per logging context.

#### Implementation approach

The Multiton Pattern is typically implemented with a static Map or dictionary that stores the instances, each identified by a unique key.

#### Example code

##### C++ implementation

```cpp
#include <iostream>
#include <map>
#include <memory>
#include <string>
#include <mutex>

class Multiton {
public:
    static std::shared_ptr<Multiton> getInstance(const std::string& key) {
        std::lock_guard<std::mutex> guard(mutex_);
        if (instances_.find(key) == instances_.end()) {
            instances_[key] = std::shared_ptr<Multiton>(new Multiton());
        }
        return instances_[key];
    }

    void doSomething() {
        std::cout << "Multiton instance at work!" << std::endl;
    }

private:
    Multiton() = default;
    static std::map<std::string, std::shared_ptr<Multiton>> instances_;
    static std::mutex mutex_;
};

std::map<std::string, std::shared_ptr<Multiton>> Multiton::instances_;
std::mutex Multiton::mutex_;

int main() {
    auto instance1 = Multiton::getInstance("Database1");
    auto instance2 = Multiton::getInstance("Database2");
    
    instance1->doSomething();
    instance2->doSomething();

    return 0;
}
```

##### Go implementation

```go
package main

import (
	"fmt"
	"sync"
)

type Multiton struct{}

var instances = make(map[string]*Multiton)
var lock = &sync.Mutex{}

func GetInstance(key string) *Multiton {
	lock.Lock()
	defer lock.Unlock()

	if instance, ok := instances[key]; ok {
		return instance
	}

	instance := &Multiton{}
	instances[key] = instance
	return instance
}

func (m *Multiton) DoSomething() {
	fmt.Println("Multiton instance at work!")
}

func main() {
	instance1 := GetInstance("Database1")
	instance2 := GetInstance("Database2")

	instance1.DoSomething()
	instance2.DoSomething()
}
```

##### Java implementation

```java
import java.util.HashMap;
import java.util.Map;

public class Multiton {
    private static Map<String, Multiton> instances = new HashMap<>();
    
    private Multiton() {}
    
    public static synchronized Multiton getInstance(String key) {
        if (!instances.containsKey(key)) {
            instances.put(key, new Multiton());
        }
        return instances.get(key);
    }

    public void doSomething() {
        System.out.println("Multiton instance at work!");
    }

    public static void main(String[] args) {
        Multiton instance1 = Multiton.getInstance("Database1");
        Multiton instance2 = Multiton.getInstance("Database2");

        instance1.doSomething();
        instance2.doSomething();
    }
}
```

### Summary

The Multiton Pattern is a flexible variant of the Singleton Pattern that allows a class to create multiple controlled instances, each identified by a unique key. This makes it possible to manage and control the creation of and access to several related instances effectively. In practice, the implementation can be chosen to suit the specific requirements, with attention paid to thread-safety.

#### Complete C++ implementation (with `std::make_shared` optimization)

```cpp
#include <iostream>
#include <map>
#include <memory>
#include <string>
#include <mutex>

class Multiton {
public:
    static std::shared_ptr<Multiton> getInstance(const std::string& key) {
        std::lock_guard<std::mutex> guard(mutex_);
        auto it = instances_.find(key);
        if (it == instances_.end()) {
            auto ptr = std::make_shared<Multiton>();
            instances_[key] = ptr;
            return ptr;
        }
        return it->second;
    }

    void doSomething() {
        std::cout << "Multiton instance at work!" << std::endl;
    }

private:
    Multiton() = default;
    static std::map<std::string, std::shared_ptr<Multiton>> instances_;
    static std::mutex mutex_;
};

std::map<std::string, std::shared_ptr<Multiton>> Multiton::instances_;
std::mutex Multiton::mutex_;

int main() {
    auto instance1 = Multiton::getInstance("Database1");
    auto instance2 = Multiton::getInstance("Database2");
    
    instance1->doSomething();
    instance2->doSomething();

    return 0;
}
```

## Sources

- Multiton is not in the [S1] catalog; for the term see [Wikipedia · Multiton pattern](https://en.wikipedia.org/wiki/Multiton_pattern).
- [Wikipedia · Software design pattern](https://en.wikipedia.org/wiki/Software_design_pattern) (coverage beyond GoF)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
