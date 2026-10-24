# Reactor

The Reactor design pattern is used to handle concurrent input/output (I/O) operations and is commonly applied in network servers, event-driven programming, and high-performance concurrent applications. It allows one or more service handlers to multiplex over multiple I/O events, achieving efficient event processing.

### Core concepts of the Reactor pattern

The core idea of the Reactor pattern is to manage event dispatch and processing through one or more Reactor objects, separating the event-processing logic from the event-dispatching mechanism.

#### Main components

1. **Reactor**: Responsible for waiting for and dispatching events to the appropriate event handlers.
2. **Handler**: The event handler, which defines the specific event-processing logic.
3. **Synchronous Event Demultiplexer**: A synchronous event demultiplexer used to wait for events to occur (for example, system calls such as `select` and `poll`).
4. **Event Loop**: The event loop that continuously waits for, dispatches, and processes events.

### Workflow of the Reactor pattern

1. **Event waiting**: The Reactor uses a synchronous event demultiplexer to wait for I/O events to occur.
2. **Event dispatch**: When one or more I/O events occur, the Reactor dispatches them to the corresponding event handlers.
3. **Event processing**: The event handlers execute the appropriate processing logic (such as reading/writing data or handling business logic).
4. **Looping**: After event processing is complete, the Reactor continues waiting for the next event.

### Pros and cons of the Reactor pattern

#### Pros

1. **High performance**: Through the event-multiplexing mechanism, it can efficiently handle a large number of concurrent I/O requests.
2. **Scalability**: The system's processing capacity can be scaled by adding more Reactor instances or event handlers.
3. **Flexibility**: Separating event-processing logic from the event-dispatching mechanism improves code flexibility and maintainability.

#### Cons

1. **Complexity**: Implementing the Reactor pattern requires handling complex event-dispatch and processing logic, making the code relatively complex.
2. **Single-threaded bottleneck**: A single Reactor instance can become a bottleneck when processing a large number of events; this can be addressed with multiple Reactor instances or multithreading.

### Example code

Below is example code for a simple network server implemented with the Reactor pattern, demonstrated in Java and C++.

#### Java example (based on NIO)

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.channels.spi.SelectorProvider;
import java.net.InetSocketAddress;
import java.util.Iterator;

public class Reactor implements Runnable {
    private final Selector selector;
    private final ServerSocketChannel serverChannel;

    public Reactor(int port) throws IOException {
        selector = SelectorProvider.provider().openSelector();
        serverChannel = ServerSocketChannel.open();
        serverChannel.configureBlocking(false);
        serverChannel.socket().bind(new InetSocketAddress(port));
        serverChannel.register(selector, SelectionKey.OP_ACCEPT, new Acceptor());
    }

    @Override
    public void run() {
        try {
            while (!Thread.interrupted()) {
                selector.select();
                Iterator<SelectionKey> it = selector.selectedKeys().iterator();
                while (it.hasNext()) {
                    dispatch(it.next());
                    it.remove();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void dispatch(SelectionKey key) {
        Runnable handler = (Runnable) key.attachment();
        if (handler != null) {
            handler.run();
        }
    }

    class Acceptor implements Runnable {
        @Override
        public void run() {
            try {
                SocketChannel clientChannel = serverChannel.accept();
                if (clientChannel != null) {
                    new Handler(selector, clientChannel);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) throws IOException {
        new Thread(new Reactor(8080)).start();
    }
}

class Handler implements Runnable {
    private static final int READ = 0;
    private static final int WRITE = 1;
    private final SocketChannel channel;
    private final SelectionKey key;
    private int state = READ;
    private final ByteBuffer buffer = ByteBuffer.allocate(1024);

    public Handler(Selector selector, SocketChannel channel) throws IOException {
        this.channel = channel;
        channel.configureBlocking(false);
        key = channel.register(selector, SelectionKey.OP_READ);
        key.attach(this);
        selector.wakeup();
    }

    @Override
    public void run() {
        try {
            if (state == READ) {
                read();
            } else if (state == WRITE) {
                write();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void read() throws IOException {
        int bytesRead = channel.read(buffer);
        if (bytesRead > 0) {
            buffer.flip();
            state = WRITE;
            key.interestOps(SelectionKey.OP_WRITE);
        } else {
            key.cancel();
            channel.close();
        }
    }

    private void write() throws IOException {
        channel.write(buffer);
        if (!buffer.hasRemaining()) {
            buffer.clear();
            state = READ;
            key.interestOps(SelectionKey.OP_READ);
        }
    }
}
```

#### C++ example (based on Boost.Asio)

> Note: Boost.Asio's underlying implementation uses the Proactor model (see [Proactor](/concurrency/proactor)). Its `async_*` family of interfaces uses a completion-notification style: submit an asynchronous operation, then receive a callback on completion. Here we borrow it to demonstrate the Reactor-style "register—wait—dispatch—callback" event-processing structure; the differences between the two are detailed in the Proactor article.

```cpp
#include <boost/asio.hpp>
#include <iostream>
#include <memory>
#include <utility>

using boost::asio::ip::tcp;

class Session : public std::enable_shared_from_this<Session> {
public:
    explicit Session(tcp::socket socket) : socket_(std::move(socket)) {}

    void start() {
        do_read();
    }

private:
    void do_read() {
        auto self(shared_from_this());
        socket_.async_read_some(boost::asio::buffer(data_, max_length),
                                [this, self](boost::system::error_code ec, std::size_t length) {
                                    if (!ec) {
                                        do_write(length);
                                    }
                                });
    }

    void do_write(std::size_t length) {
        auto self(shared_from_this());
        boost::asio::async_write(socket_, boost::asio::buffer(data_, length),
                                 [this, self](boost::system::error_code ec, std::size_t /*length*/) {
                                     if (!ec) {
                                         do_read();
                                     }
                                 });
    }

    tcp::socket socket_;
    enum { max_length = 1024 };
    char data_[max_length];
};

class Server {
public:
    Server(boost::asio::io_context& io_context, short port)
        : acceptor_(io_context, tcp::endpoint(tcp::v4(), port)) {
        do_accept();
    }

private:
    void do_accept() {
        acceptor_.async_accept(
            [this](boost::system::error_code ec, tcp::socket socket) {
                if (!ec) {
                    std::make_shared<Session>(std::move(socket))->start();
                }
                do_accept();
            });
    }

    tcp::acceptor acceptor_;
};

int main(int argc, char* argv[]) {
    try {
        if (argc != 2) {
            std::cerr << "Usage: async_tcp_echo_server <port>\n";
            return 1;
        }

        boost::asio::io_context io_context;
        Server s(io_context, std::atoi(argv[1]));
        io_context.run();
    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
```

### Summary

The Reactor design pattern is a powerful tool for handling concurrent I/O operations. By separating event-processing logic from the event-dispatching mechanism, the Reactor pattern not only improves system performance and scalability but also simplifies code maintenance and extension. Although the implementation is relatively complex, the Reactor pattern is an effective design choice in scenarios that require high-concurrency processing.

## Sources

- [Wikipedia · Reactor pattern](https://en.wikipedia.org/wiki/Reactor_pattern)
- [S9] The original catalog in POSA Volume 2.
- [Java · Selector](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/Selector.html) (NIO implementation, [S19])

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
