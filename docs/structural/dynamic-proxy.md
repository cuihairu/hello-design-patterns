# Dynamic Proxy

Dynamic Proxy is a technique that generates proxy classes at runtime rather than determining them at compile time. Dynamic proxies are commonly used to implement cross-cutting concerns (such as logging, transaction management, and access control), making code more concise and modular. Dynamic proxies are widely used in languages such as Java and C#.

### Use cases

Dynamic proxies are often used in the following scenarios:

1. **Cross-cutting concerns**: such as logging, authorization, and transactions — dynamic proxies can add these capabilities without changing business logic.
2. **Interface proxying**: dynamic proxies are suitable for proxying classes that implement interfaces, without needing to create a static proxy class for each concrete class.
3. **Simplifying code**: reduces the number of proxy classes and code duplication, especially suitable when proxying large numbers of interface implementations.

### Example code

#### Java example

In Java, dynamic proxies are typically implemented through the `java.lang.reflect.Proxy` class and the `java.lang.reflect.InvocationHandler` interface.

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

// Interface
interface Subject {
    void request();
}

// Real subject
class RealSubject implements Subject {
    public void request() {
        System.out.println("RealSubject: Handling request.");
    }
}

// Dynamic proxy handler
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

        proxyInstance.request(); // Output: Proxy: Before invoking request
                                 //      RealSubject: Handling request.
                                 //      Proxy: After invoking request
    }
}
```

#### C# example

In C#, dynamic proxies can be implemented using classes in the `System.Reflection.Emit` namespace, or by using open-source libraries such as Castle DynamicProxy.

Example using the Castle DynamicProxy library:

```csharp
using System;
using Castle.DynamicProxy;

// Interface
public interface ISubject
{
    void Request();
}

// Real subject
public class RealSubject : ISubject
{
    public void Request()
    {
        Console.WriteLine("RealSubject: Handling request.");
    }
}

// Interceptor
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

        proxy.Request(); // Output: Proxy: Before invoking Request
                         //      RealSubject: Handling request.
                         //      Proxy: After invoking Request
    }
}
```

#### Python example

Python can use the built-in `__getattr__` method and `functools.wraps` to implement a simple dynamic proxy.

```python
from functools import wraps

# Real subject
class RealSubject:
    def request(self):
        print("RealSubject: Handling request.")

# Dynamic proxy
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
    proxy.request() # Output: Proxy: Before invoking request
                    //      RealSubject: Handling request.
                    //      Proxy: After invoking request
```

### Key points

1. **Dynamism**: proxy classes are generated at runtime, with no need to determine the proxy class at compile time.
2. **Flexibility**: proxy behavior can be decided at runtime, adapting to the requirements of different scenarios.
3. **Conciseness**: reduces code duplication, especially suitable when proxying large numbers of interfaces.

### Summary

Dynamic proxies are a powerful technique that can add extra functionality without modifying business logic, especially suitable for implementing cross-cutting concerns. With dynamic proxies, developers can write more concise, modular, and maintainable code.

## Sources

- [Wikipedia · Proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern) (dynamic proxy is one of its variants, categorized by runtime proxying).
- [Java · java.lang.reflect.Proxy](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/Proxy.html) (JDK dynamic proxy, [S19]).
- [MDN · Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) (frontend application, [S28]).

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [introduction](/introduction.md)
- [reference](/reference.md)
- [official-docs](/research/official-docs.md)
- [overview](overview.md)
