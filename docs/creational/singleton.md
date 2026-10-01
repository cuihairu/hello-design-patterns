
# 单例模式

### 单例模式简介

单例模式（Singleton Pattern）是一种创建型设计模式，确保一个类只有一个实例，并提供全局访问点。单例模式常用于需要控制资源访问，或需要全局共享数据的场景。

#### 使用场景

- **日志系统**：确保日志文件对象在系统中只有一个实例。
- **配置文件管理**：在程序中共享和访问配置文件。
- **线程池**：在多线程环境中共享和管理线程池实例。
- **数据库连接池**：管理数据库连接，减少连接创建和销毁的开销。

### 单例模式的实现

单例模式可以用多种语言实现。下面给出C++和Go的实现例子。

#### C++ 实现单例模式

**懒汉模式**：只有在第一次访问时才创建实例。

```cpp
#include <iostream>
#include <mutex>

class Singleton {
private:
    static Singleton* instance;
    static std::mutex mtx;

    // 私有构造函数，防止外部实例化
    Singleton() {}

public:
    // 禁止拷贝构造和赋值操作
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    // 静态方法，返回单例实例
    static Singleton* getInstance() {
        if (instance == nullptr) {
            std::lock_guard<std::mutex> lock(mtx);
            if (instance == nullptr) {
                instance = new Singleton();
            }
        }
        return instance;
    }

    void showMessage() {
        std::cout << "Hello, Singleton!" << std::endl;
    }
};

// 初始化静态成员变量
Singleton* Singleton::instance = nullptr;
std::mutex Singleton::mtx;

int main() {
    Singleton* singleton = Singleton::getInstance();
    singleton->showMessage();
    return 0;
}
```

**饿汉模式**：在程序开始运行时就创建实例。

```cpp
#include <iostream>

class Singleton {
private:
    static Singleton* instance;

    // 私有构造函数，防止外部实例化
    Singleton() {}

public:
    // 禁止拷贝构造和赋值操作
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    // 静态方法，返回单例实例
    static Singleton* getInstance() {
        return instance;
    }

    void showMessage() {
        std::cout << "Hello, Singleton!" << std::endl;
    }
};

// 初始化静态成员变量
Singleton* Singleton::instance = new Singleton();

int main() {
    Singleton* singleton = Singleton::getInstance();
    singleton->showMessage();
    return 0;
}
```

#### Go 实现单例模式

Go语言没有类的概念，但可以使用结构体和包级别的变量来实现单例模式。

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

### 小结

单例模式是一种用于确保一个类只有一个实例的设计模式。在C++中，可以通过懒汉模式和饿汉模式来实现单例，而在Go中，可以利用`sync.Once`来确保只创建一个实例。单例模式在需要全局共享资源、控制资源访问时非常有用。