#  主动器模式

Proactor模式与Reactor模式类似，也是一种用于处理并发I/O操作的设计模式，但它们在处理I/O事件的方式上有所不同。以下是对Proactor设计模式的详细介绍，包括其用途、组件、优点和缺点，以及示例代码。

### Proactor设计模式

Proactor设计模式是一种事件驱动的并发设计模式，主要用于处理异步I/O操作。与Reactor模式不同，Proactor模式在事件发生时不会立即处理事件，而是将处理工作委托给操作系统或底层库，事件完成后再由Proactor负责回调相应的处理逻辑。

### Proactor模式的核心概念

#### 主要组件

1. **Proactor**：管理异步操作的提交和完成，负责事件的分发。
2. **Completion Handler**：完成处理器，在异步操作完成后被回调以处理结果。
3. **Asynchronous Operation Processor**：异步操作处理器，通常是操作系统提供的异步I/O机制，如Windows的I/O完成端口（IOCP）、Linux的aio库等。
4. **Initiator**：发起异步操作的实体，提交异步I/O请求。

### Proactor模式的工作流程

1. **异步操作提交**：Initiator发起异步操作请求，提交给Proactor。
2. **异步操作处理**：Asynchronous Operation Processor处理异步操作，并在操作完成后通知Proactor。
3. **事件完成通知**：Proactor接收到异步操作完成的通知，并调用相应的Completion Handler。
4. **事件处理**：Completion Handler执行相应的处理逻辑。

### Proactor模式的优点和缺点

#### 优点

1. **高效性**：充分利用操作系统的异步I/O机制，减少阻塞，提高并发性能。
2. **简化逻辑**：异步操作的处理逻辑由操作系统负责，应用层代码简化。
3. **扩展性**：易于扩展，能够处理更多的并发连接。

#### 缺点

1. **复杂性**：需要熟悉操作系统提供的异步I/O机制，增加了实现的复杂性。
2. **依赖性**：依赖于操作系统的异步I/O实现，不同平台之间的移植性较差。

### 示例代码

以下是使用Proactor模式实现简单网络服务器的示例代码，分别使用C++（基于Windows IOCP）和Python（基于asyncio）进行演示。

#### C++ 示例（基于Windows IOCP）

```cpp
#include <windows.h>
#include <iostream>

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
                CreateIoCompletionPort((HANDLE)clientSocket, iocp_, (ULONG_PTR)new Session(iocp_), 0);
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

#### Python 示例（基于asyncio）

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

### 总结

Proactor设计模式通过异步I/O操作提高了并发处理的效率和性能，适用于高性能服务器、网络编程和事件驱动的应用程序。虽然实现起来比较复杂，尤其是在C++等低级语言中，但通过异步操作处理器的支持，Proactor模式能够提供高效、可扩展的并发解决方案。