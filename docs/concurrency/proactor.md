# Proactor

Both Proactor and Reactor are used to handle concurrent I/O; the difference lies in the timing of I/O event processing and the division of responsibility. This article documents the uses, components, trade-offs, and examples of Proactor.

### Proactor design pattern

The Proactor design pattern is an event-driven concurrent design pattern primarily used to handle asynchronous I/O operations. Unlike the Reactor pattern, the Proactor pattern does not process events immediately when they occur; instead, it delegates the processing work to the operating system or underlying libraries, and after the operation completes, the Proactor is responsible for invoking the appropriate processing logic via callbacks.

### Core concepts of the Proactor pattern

#### Main components

1. **Proactor**: Manages the submission and completion of asynchronous operations, and is responsible for event dispatch.
2. **Completion Handler**: The completion handler, which is invoked after an asynchronous operation completes to process the result.
3. **Asynchronous Operation Processor**: The asynchronous operation processor, usually an asynchronous I/O mechanism provided by the operating system, such as Windows I/O Completion Ports (IOCP) or the Linux aio library.
4. **Initiator**: The entity that initiates asynchronous operations, submitting asynchronous I/O requests.

### Workflow of the Proactor pattern

1. **Asynchronous operation submission**: The Initiator submits an asynchronous operation request to the Proactor.
2. **Asynchronous operation processing**: The Asynchronous Operation Processor handles the asynchronous operation and notifies the Proactor upon completion.
3. **Event completion notification**: The Proactor receives notification of asynchronous operation completion and invokes the corresponding Completion Handler.
4. **Event processing**: The Completion Handler executes the appropriate processing logic.

### Pros and cons of the Proactor pattern

#### Pros

1. **Efficiency**: Fully leverages the operating system's asynchronous I/O mechanisms, reducing blocking and improving concurrent performance.
2. **Simplified logic**: The operating system handles asynchronous operation processing, simplifying application-layer code.
3. **Scalability**: Easy to scale, capable of handling more concurrent connections.

#### Cons

1. **Complexity**: Requires familiarity with the operating system's asynchronous I/O mechanisms, adding complexity to implementation.
2. **Dependency**: Depends on the operating system's asynchronous I/O implementation, resulting in poor portability across platforms.

### Example code

Below is example code for a simple network server implemented with the Proactor pattern, demonstrated in C++ (based on Windows IOCP) and Python (based on asyncio).

#### C++ example (based on Windows IOCP)

```cpp
#include <winsock2.h> // Must be included before windows.h
#include <windows.h>
#include <iostream>
#include <thread>
#include <chrono>

class CompletionHandler {
public:
    virtual void handleComplete(DWORD bytesTransferred) = 0;
};

class Session : public CompletionHandler {
public:
    Session(HANDLE iocp) : iocp_(iocp), socket_(INVALID_SOCKET) {}

    void start(SOCKET socket) {
        socket_ = socket;
        doRead();
    }

    void handleComplete(DWORD bytesTransferred) override {
        if (bytesTransferred > 0) {
            std::cout << "Read " << bytesTransferred << " bytes: " << buffer_ << std::endl;
            doRead();
        } else {
            closesocket(socket_);
        }
    }

private:
    void doRead() {
        ZeroMemory(&overlapped_, sizeof(overlapped_));
        WSABUF buf = { sizeof(buffer_), buffer_ };
        DWORD flags = 0;
        WSARecv(socket_, &buf, 1, NULL, &flags, &overlapped_, NULL);
    }

    HANDLE iocp_;
    SOCKET socket_;
    OVERLAPPED overlapped_;
    char buffer_[512];
};

class Server {
public:
    Server(short port) : iocp_(CreateIoCompletionPort(INVALID_HANDLE_VALUE, NULL, 0, 0)) {
        WSADATA wsaData;
        WSAStartup(MAKEWORD(2, 2), &wsaData);

        SOCKET listenSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
        sockaddr_in addr = { 0 };
        addr.sin_family = AF_INET;
        addr.sin_port = htons(port);
        addr.sin_addr.s_addr = INADDR_ANY;
        bind(listenSocket, (sockaddr*)&addr, sizeof(addr));
        listen(listenSocket, SOMAXCONN);

        CreateIoCompletionPort((HANDLE)listenSocket, iocp_, 0, 0);
        std::thread(&Server::acceptLoop, this, listenSocket).detach();
        std::thread(&Server::completionLoop, this).detach();
    }

    void acceptLoop(SOCKET listenSocket) {
        while (true) {
            SOCKET clientSocket = accept(listenSocket, NULL, NULL);
            if (clientSocket != INVALID_SOCKET) {
                auto* session = new Session(iocp_);
                // Associate the session with the IOCP as a completion key, then submit the
                // first asynchronous WSARecv; otherwise this connection would never have a
                // completion event enter the queue.
                CreateIoCompletionPort((HANDLE)clientSocket, iocp_, (ULONG_PTR)session, 0);
                session->start(clientSocket);
            }
        }
    }

    void completionLoop() {
        while (true) {
            DWORD bytesTransferred;
            ULONG_PTR key;
            OVERLAPPED* overlapped;
            if (GetQueuedCompletionStatus(iocp_, &bytesTransferred, &key, &overlapped, INFINITE)) {
                auto* handler = reinterpret_cast<CompletionHandler*>(key);
                handler->handleComplete(bytesTransferred);
            }
        }
    }

private:
    HANDLE iocp_;
};

int main() {
    Server server(8080);
    std::this_thread::sleep_for(std::chrono::hours(1));
    return 0;
}
```

#### Python example (based on asyncio)

```python
import asyncio

async def handle_client(reader, writer):
    data = await reader.read(100)
    message = data.decode()
    print(f"Received {message}")

    writer.write(data)
    await writer.drain()
    writer.close()

async def main():
    server = await asyncio.start_server(handle_client, '127.0.0.1', 8888)
    async with server:
        await server.serve_forever()

asyncio.run(main())
```

### Summary

The Proactor design pattern improves the efficiency and performance of concurrent processing through asynchronous I/O operations, making it suitable for high-performance servers, network programming, and event-driven applications. Although the implementation is relatively complex, especially in low-level languages such as C++, the Proactor pattern can provide efficient, scalable concurrent solutions with the support of asynchronous operation processors.

## Sources

- [Wikipedia · Proactor pattern](https://en.wikipedia.org/wiki/Proactor_pattern)
- [Microsoft · I/O completion ports](https://learn.microsoft.com/en-us/windows/win32/fileio/i-o-completion-ports) (Windows implementation, [S24]).
- [S9] The original catalog in POSA Volume 2.

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [reactor](reactor.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
