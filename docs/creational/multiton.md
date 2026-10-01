### 多例模式（Multiton Pattern）

#### 简介

多例模式（Multiton Pattern）是一种设计模式，旨在确保某个类在每个给定的关键字上最多只有一个实例。它类似于单例模式，但允许多个受控的实例存在，每个实例对应一个特定的关键字或上下文。多例模式可以用于需要一组受限实例的情况，如数据库连接池但不同的数据库实例、配置管理器等。

#### 使用场景

1. **配置管理器**：不同的配置文件实例。
2. **数据库连接池**：每个数据库一个连接池实例。
3. **日志记录器**：每个日志记录上下文一个实例。

#### 实现方法

多例模式通常通过一个静态的 Map 或字典来存储实例，每个实例由一个唯一的键值标识。

#### 示例代码

##### C++ 实现

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

##### Go 实现

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

##### Java 实现

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

### 总结

多例模式是一种灵活的单例模式变体，允许在一个类中创建多个受控的实例，每个实例由一个唯一的键值标识。通过这种方式，可以有效地管理和控制多个相关实例的创建和访问。在实际应用中，可以根据具体需求选择实现方式，并注意线程安全问题。