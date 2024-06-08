动态代理（Dynamic Proxy）是一种在运行时生成代理类的技术，而不是在编译时确定代理类。动态代理通常用于横切关注点（如日志记录、事务管理、权限控制等）的实现，使得代码更简洁、更模块化。动态代理广泛应用于Java、C#等语言中。

### 使用场景

动态代理常用于以下场景：

1. **横切关注点**：如日志、权限、事务等，动态代理可以在不改变业务逻辑的情况下添加这些功能。
2. **接口代理**：动态代理适用于代理实现接口的类，而无需为每个具体类创建静态代理类。
3. **简化代码**：减少代理类的数量和代码冗余，特别适用于需要代理大量接口实现的情况。

### 示例代码

#### Java 示例

Java中的动态代理通常通过`java.lang.reflect.Proxy`类和`java.lang.reflect.InvocationHandler`接口来实现。

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

// 接口
interface Subject {
    void request();
}

// 真实对象
class RealSubject implements Subject {
    public void request() {
        System.out.println("RealSubject: Handling request.");
    }
}

// 动态代理处理器
class DynamicProxyHandler implements InvocationHandler {
    private final Object realSubject;

    public DynamicProxyHandler(Object realSubject) {
        this.realSubject = realSubject;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("Proxy: Before invoking " + method.getName());
        Object result = method.invoke(realSubject, args);
        System.out.println("Proxy: After invoking " + method.getName());
        return result;
    }
}

public class Main {
    public static void main(String[] args) {
        RealSubject realSubject = new RealSubject();
        Subject proxyInstance = (Subject) Proxy.newProxyInstance(
                realSubject.getClass().getClassLoader(),
                realSubject.getClass().getInterfaces(),
                new DynamicProxyHandler(realSubject)
        );

        proxyInstance.request(); // 输出: Proxy: Before invoking request
                                 //      RealSubject: Handling request.
                                 //      Proxy: After invoking request
    }
}
```

#### C# 示例

C#中的动态代理可以使用`System.Reflection.Emit`命名空间中的类来实现，或者使用开源库如Castle DynamicProxy。

使用Castle DynamicProxy库的示例：

```csharp
using System;
using Castle.DynamicProxy;

// 接口
public interface ISubject
{
    void Request();
}

// 真实对象
public class RealSubject : ISubject
{
    public void Request()
    {
        Console.WriteLine("RealSubject: Handling request.");
    }
}

// 拦截器
public class DynamicProxyInterceptor : IInterceptor
{
    public void Intercept(IInvocation invocation)
    {
        Console.WriteLine("Proxy: Before invoking " + invocation.Method.Name);
        invocation.Proceed();
        Console.WriteLine("Proxy: After invoking " + invocation.Method.Name);
    }
}

class Program
{
    static void Main()
    {
        ProxyGenerator generator = new ProxyGenerator();
        ISubject proxy = generator.CreateInterfaceProxyWithTarget<ISubject>(
            new RealSubject(),
            new DynamicProxyInterceptor()
        );

        proxy.Request(); // 输出: Proxy: Before invoking Request
                         //      RealSubject: Handling request.
                         //      Proxy: After invoking Request
    }
}
```

#### Python 示例

Python可以使用内置的`__getattr__`方法和`functools.wraps`来实现简单的动态代理。

```python
from functools import wraps

# 真实对象
class RealSubject:
    def request(self):
        print("RealSubject: Handling request.")

# 动态代理
class DynamicProxy:
    def __init__(self, real_subject):
        self._real_subject = real_subject

    def __getattr__(self, name):
        attr = getattr(self._real_subject, name)

        if callable(attr):
            @wraps(attr)
            def new_attr(*args, **kwargs):
                print(f"Proxy: Before invoking {name}")
                result = attr(*args, **kwargs)
                print(f"Proxy: After invoking {name}")
                return result
            return new_attr
        else:
            return attr

if __name__ == "__main__":
    real_subject = RealSubject()
    proxy = DynamicProxy(real_subject)
    proxy.request() # 输出: Proxy: Before invoking request
                    #      RealSubject: Handling request.
                    #      Proxy: After invoking request
```

### 关键点

1. **动态性**：代理类在运行时生成，无需在编译时确定代理类。
2. **灵活性**：可以在运行时决定代理的行为，适应不同的场景需求。
3. **简洁性**：减少代码冗余，尤其适用于需要代理大量接口的情况。

### 总结

动态代理是一种强大的技术，能够在不修改业务逻辑的情况下添加额外的功能，尤其适用于横切关注点的实现。通过动态代理，开发人员可以编写更加简洁、模块化和可维护的代码。