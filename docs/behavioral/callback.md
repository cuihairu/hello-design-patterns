# Callback

The Callback pattern is a common design pattern used for asynchronous task processing. By encapsulating the processing logic in callback functions or callback objects and invoking these callbacks when a specific event occurs or an asynchronous operation completes, the Callback pattern handles asynchronous operations.

### Core concepts of the Callback pattern

#### Main components

1. **Callback Function (Callback Function)**: A function called when an asynchronous operation completes or a specific event occurs.
2. **Callback Object (Callback Object)**: An object containing one or more callback methods used to handle tasks after an asynchronous operation completes.
3. **Asynchronous Operation (Asynchronous Operation)**: A task that needs to be executed asynchronously, such as I/O operations, network requests, etc.
4. **Initiator (Initiator)**: The entity that initiates the asynchronous operation and calls the callback function or callback object's method after the operation completes.

### Workflow of the Callback pattern

1. **Initiate asynchronous operation**: The initiator starts the asynchronous operation and passes in the callback function or callback object.
2. **Asynchronous operation execution**: The asynchronous operation executes in the background without blocking the main thread.
3. **Callback notification**: After the asynchronous operation completes, the system invokes the pre-specified callback function or callback object's method.
4. **Result processing**: The callback function or callback object's method executes the specific processing logic.

### Advantages and disadvantages of the Callback pattern

#### Advantages

1. **Asynchronous processing**: Avoids blocking the main thread, improving the system's responsiveness and concurrent processing capability.
2. **Flexibility**: By passing in different callback functions or callback objects, the processing logic after an asynchronous operation completes can be flexibly customized.
3. **Decoupling**: The code initiating the asynchronous operation is separated from the code handling the result, reducing coupling.

#### Disadvantages

1. **Complexity**: Code logic may become complex, especially when multiple nested callbacks exist, which can easily lead to the "callback hell" problem.
2. **Error handling**: Handling errors in callbacks may be more difficult, increasing the difficulty of debugging and maintenance.

### Use cases of the Callback pattern

The Callback pattern applies to various scenarios requiring asynchronous processing, such as:

- **Network requests**: such as handling HTTP request responses.
- **File I/O**: such as processing data after file reading completes.
- **User interface events**: such as handling button click events.
- **Timers**: such as executing scheduled tasks.

### Example code

Below is example code for the Callback pattern, demonstrated in C++ and JavaScript respectively.

#### C++ example

```cpp
#include <iostream>
#include <functional>

// Callback function type
using Callback = std::function<void(int)>;

// Initiator of the asynchronous operation
void asyncOperation(Callback callback) {
    // Simulate an asynchronous operation
    int result = 42; // Assume this is the result of the asynchronous operation
    // Call the callback function after the asynchronous operation completes
    callback(result);
}

// Callback function
void onOperationComplete(int result) {
    std::cout << "Async operation completed with result: " << result << std::endl;
}

int main() {
    // Initiate the asynchronous operation and pass in the callback function
    asyncOperation(onOperationComplete);
    return 0;
}
```

#### JavaScript example

```javascript
// Initiator of the asynchronous operation
function asyncOperation(callback) {
    // Simulate an asynchronous operation
    setTimeout(() => {
        const result = 42; // Assume this is the result of the asynchronous operation
        // Call the callback function after the asynchronous operation completes
        callback(result);
    }, 1000);
}

// Callback function
function onOperationComplete(result) {
    console.log(`Async operation completed with result: ${result}`);
}

// Initiate the asynchronous operation and pass in the callback function
asyncOperation(onOperationComplete);
```

### Summary

The Callback pattern is a common design pattern widely used for handling asynchronous operations. Through callback functions or callback objects, the Callback pattern enables flexible handling after an asynchronous operation completes. Although the Callback pattern may increase code complexity, with reasonable design and usage, it can effectively improve the system's responsiveness and concurrent processing capability.

## Sources

- [Wikipedia · Callback](https://en.wikipedia.org/wiki/Callback_%28computer_programming%29)
- [MDN · Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) (Frontend implementation, [S28])

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [official-docs](/research/official-docs.md)
