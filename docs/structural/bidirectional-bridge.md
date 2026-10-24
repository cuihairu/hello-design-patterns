# Bidirectional Bridge

The Bidirectional Bridge is a structural design pattern that extends the traditional Bridge pattern so that the bridging interfaces can communicate with each other in both directions. This pattern is particularly suited to scenarios that require two-way communication between two independent hierarchies, allowing objects in each hierarchy to interact with objects in the other.

### Recap of the traditional Bridge pattern

The traditional Bridge pattern separates the abstraction from its implementation so that the two can vary independently. The typical structure is as follows:

- **Abstraction**: defines the high-level abstract interface.
- **RefinedAbstraction**: extends the abstract interface with concrete behavior.
- **Implementor**: defines the interface for concrete implementations.
- **ConcreteImplementor**: a concrete implementation of the Implementor interface.

```java
// Java example of traditional Bridge pattern
abstract class Shape {
    protected Color color;

    protected Shape(Color color) {
        this.color = color;
    }

    abstract void draw();
}

interface Color {
    void fill();
}

class RedColor implements Color {
    public void fill() {
        System.out.println("Filling with red color");
    }
}

class Circle extends Shape {
    protected Circle(Color color) {
        super(color);
    }

    void draw() {
        System.out.println("Drawing Circle");
        color.fill();
    }
}

public class BridgePatternDemo {
    public static void main(String[] args) {
        Shape redCircle = new Circle(new RedColor());
        redCircle.draw();
    }
}
```

The Bidirectional Bridge is mainly useful in scenarios that require two-way communication and interaction, and it provides a flexible, decoupled way to achieve that goal. Specific uses include:

1. **Complex UI frameworks**:
   - **Use**: in a complex UI framework, components need to communicate with one another. With the Bidirectional Bridge, components can call each other's methods and pass data or events, enabling more flexible UI interactions.
   - **Example**: for instance, a button click event needs to notify several other UI components so they can update accordingly.

2. **Distributed systems**:
   - **Use**: in a distributed system, services need to communicate and cooperate with one another. The Bidirectional Bridge lets services communicate in both directions through the bridging interface, making coordination and management between services easier.
   - **Example**: in a microservice architecture, different microservices need to call each other's APIs and exchange data.

3. **Real-time systems**:
   - **Use**: in a real-time system, sensors and controllers need two-way communication. With the Bidirectional Bridge, sensors can pass data to controllers, and controllers can also send commands to sensors.
   - **Example**: in an industrial automation system, sensors monitor equipment status in real time and pass the data to controllers, which then make the appropriate control decisions based on that data.

4. **Network communication**:
   - **Use**: in network communication, clients and servers need to send and receive data from each other. The Bidirectional Bridge allows clients and servers to transfer data in both directions through the bridging interface.
   - **Example**: in instant messaging software, clients and servers need to send messages to and receive messages from each other.

5. **Plugin architectures**:
   - **Use**: in a plugin architecture, the host program and plugins need two-way communication. With the Bidirectional Bridge, the host program can call plugin methods, and plugins can also call host program methods.
   - **Example**: in an IDE, the host program and the various plugins need to communicate in both directions to provide extension features.

### Advantages

1. **High flexibility**: the abstraction and the implementation can vary independently, making extension and maintenance easy.
2. **Decoupling**: reduces the coupling between the parts of the system, making it easier to manage and modify.
3. **Two-way communication**: allows objects to communicate in both directions, improving the system's interactivity and functionality.

### Disadvantages

1. **Increased complexity**: bidirectional references add complexity to both design and implementation.
2. **Risk of circular dependencies**: if handled carelessly, circular dependencies may arise, making debugging and maintenance harder.

### Concrete implementation example

Take the client and server in network communication as an example:

#### Java implementation

```java
import java.util.ArrayList;
import java.util.List;

// Abstraction
abstract class NetworkDevice {
    protected NetworkBridge networkBridge;

    public void setNetworkBridge(NetworkBridge networkBridge) {
        this.networkBridge = networkBridge;
        networkBridge.setNetworkDevice(this);
    }

    abstract void sendData(String data);
    abstract void receiveData(String data);
}

// Implementor interface
interface NetworkBridge {
    void setNetworkDevice(NetworkDevice networkDevice);
    // The sender must be carried along so the bridge can route the data to the other side instead of echoing it back to the sender itself
    void transmitData(NetworkDevice sender, String data);
}

// Concrete implementor
class NetworkBridgeImpl implements NetworkBridge {
    private final List<NetworkDevice> devices = new ArrayList<>();

    @Override
    public void setNetworkDevice(NetworkDevice networkDevice) {
        devices.add(networkDevice);
    }

    @Override
    public void transmitData(NetworkDevice sender, String data) {
        for (NetworkDevice device : devices) {
            if (device != sender) {
                device.receiveData(data);
            }
        }
    }
}

// Concrete abstraction
class Client extends NetworkDevice {
    @Override
    void sendData(String data) {
        System.out.println("Client sending data: " + data);
        networkBridge.transmitData(this, data);
    }

    @Override
    void receiveData(String data) {
        System.out.println("Client received data: " + data);
    }
}

class Server extends NetworkDevice {
    @Override
    void sendData(String data) {
        System.out.println("Server sending data: " + data);
        networkBridge.transmitData(this, data);
    }

    @Override
    void receiveData(String data) {
        System.out.println("Server received data: " + data);
    }
}

// Client code
public class BidirectionalBridgeDemo {
    public static void main(String[] args) {
        Client client = new Client();
        Server server = new Server();
        NetworkBridge networkBridge = new NetworkBridgeImpl();

        client.setNetworkBridge(networkBridge);
        server.setNetworkBridge(networkBridge);

        client.sendData("Hello from Client");
        server.sendData("Hello from Server");
    }
}
```

Output when run:

```text
Client sending data: Hello from Client
Server received data: Hello from Client
Server sending data: Hello from Server
Client received data: Hello from Server
```

In this example:

- `NetworkDevice` is the abstraction and holds a reference to the `NetworkBridge`.
- The `NetworkBridge` interface also holds references to `NetworkDevice` objects (a bidirectional association) and routes data to the other side based on the sender.
- `NetworkBridgeImpl` is the concrete implementation of `NetworkBridge`, responsible for keeping track of the connected devices and forwarding data.
- `Client` and `Server` are concrete implementations of `NetworkDevice`, achieving two-way data transfer through the bridging interface.

## Sources

- [Wikipedia · Bridge pattern](https://en.wikipedia.org/wiki/Bridge_pattern) (bidirectional references are its engineered form).
- [Refactoring.Guru · Bridge](https://refactoring.guru/design-patterns/bridge)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [reference](/reference.md)
- [overview](overview.md)
