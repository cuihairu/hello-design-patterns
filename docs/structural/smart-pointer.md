# Smart Pointer

The Smart Pointer pattern is a classic resource management pattern, primarily used to manage dynamically allocated memory or other resources, preventing memory leaks and undefined behavior. In C++, the smart pointer pattern leverages the RAII (Resource Acquisition Is Initialization) principle to manage resources automatically.

#### Use cases

1. **Memory management**: prevents memory leaks by automatically freeing dynamically allocated memory.
2. **Resource management**: manages resources such as file handles and network connections, ensuring that they are released automatically when no longer needed.
3. **Object lifetime management**: ensures that objects exist while needed and are destroyed when no longer needed.

#### Advantages

1. **Automated resource management**: reduces the complexity of manual resource management and lowers the risk of mistakes.
2. **Safety**: prevents memory leaks and undefined behavior, making code safer and more robust.
3. **Simpler code**: simplifies resource management code, making it easier to read and maintain.

#### Disadvantages

1. **Performance overhead**: smart pointers can introduce extra overhead in some situations, such as reference count updates.
2. **Circular reference problems**: with reference-counting smart pointers, circular references can occur and require extra handling.

### Implementing smart pointers in C++

C++11 introduced several smart pointers in the standard library, including `std::unique_ptr`, `std::shared_ptr`, and `std::weak_ptr`. The following shows how to implement a simplified version of `shared_ptr`.

#### A simple implementation

```cpp
#include <iostream>
#include <utility> // std::swap

template<typename T>
class SharedPtr {
public:
    // Constructor
    explicit SharedPtr(T* ptr = nullptr)
        : ptr_(ptr), ref_count_(new int(1)) {}

    // Copy constructor
    SharedPtr(const SharedPtr& other)
        : ptr_(other.ptr_), ref_count_(other.ref_count_) {
        ++(*ref_count_);
    }

    // Assignment operator (copy-and-swap idiom, avoids use-after-free on self-assignment and on shared control blocks)
    SharedPtr& operator=(SharedPtr other) {
        swap(other);
        return *this;
    }

    // Destructor
    ~SharedPtr() {
        if (--(*ref_count_) == 0) {
            delete ptr_;
            delete ref_count_;
        }
    }

    // Swap
    void swap(SharedPtr& other) noexcept {
        std::swap(ptr_, other.ptr_);
        std::swap(ref_count_, other.ref_count_);
    }

    // Get the raw pointer
    T* get() const { return ptr_; }

    // Overload the * operator
    T& operator*() const { return *ptr_; }

    // Overload the -> operator
    T* operator->() const { return ptr_; }

private:
    T* ptr_;         // raw pointer
    int* ref_count_; // reference count
};

// Test SharedPtr
int main() {
    SharedPtr<int> p1(new int(10));
    SharedPtr<int> p2 = p1;

    std::cout << *p1 << std::endl; // outputs 10
    std::cout << *p2 << std::endl; // outputs 10

    return 0;
}
```

#### Explanation

1. **Constructor**: initializes the raw pointer and the reference count.
2. **Copy constructor**: increments the reference count, implementing shared ownership.
3. **Assignment operator**: uses the copy-and-swap idiom — a temporary object is constructed first via pass-by-value (incrementing the reference count), then the internal states are swapped, and finally the temporary object's destructor releases the old resources. This approach naturally handles self-assignment, exception safety, and use-after-free with shared control blocks.
4. **Destructor**: decrements the reference count, releasing the resources when the count reaches zero.
5. **Operator overloading**: overloads the `*` and `->` operators to make it convenient to access and manipulate the object managed by the smart pointer.

#### Use cases

1. **Memory management**: avoids manually managing dynamically allocated memory and prevents memory leaks.
2. **Resource sharing**: when multiple objects share the same resource, smart pointers manage the resource's lifetime automatically.
3. **Complex data structures**: when implementing complex data structures (such as graphs or trees), smart pointers can simplify memory management.

### Summary of advantages and disadvantages

#### Advantages

1. **Automated management**: reduces the complexity of manually freeing memory.
2. **Prevents memory leaks**: smart pointers release resources automatically at the appropriate time.
3. **Improves code safety**: reduces the likelihood of undefined behavior.

#### Disadvantages

1. **Performance overhead**: reference count updates introduce some performance overhead.
2. **Circular reference problems**: these must be handled carefully to avoid memory leaks caused by circular references.

The smart pointer pattern leverages the RAII principle to manage resources automatically, effectively solving the problems of memory leaks and complex resource management. The smart pointer pattern is a very important part of modern C++ programming and is widely used in all kinds of scenarios.

## Sources

- [Wikipedia · Smart pointer](https://en.wikipedia.org/wiki/Smart_pointer)
- [cppreference · Memory management library](https://en.cppreference.com/w/cpp/memory) (standard library reference).
- [S20] The C++ Core Guidelines' resource management recommendations (see the research overview for the list)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [official-docs](/research/official-docs.md)
- [overview](overview.md)
