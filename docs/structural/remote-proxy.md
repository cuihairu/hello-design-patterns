# Remote Proxy

## Overview

The remote proxy pattern is a structural design pattern that provides a surrogate or placeholder for another object in order to control access to it. In distributed systems, remote proxies are used to access remote objects, allowing local code to access remote objects as transparently as if they were local. The proxy handles the network communication details (serialization, connection management, timeout and retry, etc.), and the client is unaware of them.

## Use cases

- **Distributed systems**: objects live on different physical machines and communicate over the network
- **Microservice architectures**: RPC calls between services, with the proxy shielding network details
- **Lazy initialization**: the connection is established only on the first call
- **Access control**: authentication, rate limiting, and circuit breaking performed at the proxy layer
- **Fault isolation**: timeout, retry, and circuit breaking logic centralized in the proxy, without polluting business code

## Core components

1. **Subject**: defines the method signatures clients call; local and remote implementations share the same interface
2. **RealSubject**: the actual business logic running on the server
3. **Proxy**: the stub held by the client, responsible for serializing parameters, sending network requests, and deserializing results
4. **Communication layer**: gRPC / RMI / HTTP+JSON / custom protocols

## Example code

Below are minimal remote proxy implementations in three mainstream stacks: **Java gRPC**, **Go gRPC**, and **C++ gRPC**. gRPC defines interfaces via Protobuf and generates stubs/skeletons automatically, making it the standard choice for modern microservices.

### Shared Protobuf definition (`service.proto`)

```protobuf
syntax = "proto3";

package hellopattern;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply);
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

---

### Java implementation (gRPC + Netty)

**Dependencies** (add `grpc-stub`, `grpc-protobuf`, `grpc-netty-shaded`, and `protobuf-java` yourself via Maven/Gradle)

#### Server implementation

```java
// GreeterServiceImpl.java
package com.example.remotepattern;

import hellopattern.GreeterGrpc;
import hellopattern.HelloReply;
import hellopattern.HelloRequest;
import io.grpc.stub.StreamObserver;

public class GreeterServiceImpl extends GreeterGrpc.GreeterImplBase {
    @Override
    public void sayHello(HelloRequest req, StreamObserver<HelloReply> responseObserver) {
        String reply = "Hello, " + req.getName() + " (from Java gRPC server)";
        HelloReply response = HelloReply.newBuilder().setMessage(reply).build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}

// Server.java
package com.example.remotepattern;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import java.io.IOException;

public class Server {
    public static void main(String[] args) throws IOException, InterruptedException {
        Server server = ServerBuilder.forPort(50051)
                .addService(new GreeterServiceImpl())
                .build()
                .start();
        System.out.println("Java gRPC server started on port 50051");
        server.awaitTermination();
    }
}
```

#### Client proxy (remote proxy)

```java
// GreeterProxy.java
package com.example.remotepattern;

import hellopattern.GreeterGrpc;
import hellopattern.HelloReply;
import hellopattern.HelloRequest;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

public class GreeterProxy implements AutoCloseable {
    private final ManagedChannel channel;
    private final GreeterGrpc.GreeterBlockingStub stub;

    public GreeterProxy(String host, int port) {
        this.channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext()  // Use TLS in production
                .build();
        this.stub = GreeterGrpc.newBlockingStub(channel);
    }

    // Proxy method: local call → remote RPC
    public String sayHello(String name) {
        HelloRequest request = HelloRequest.newBuilder().setName(name).build();
        HelloReply reply = stub.sayHello(request);  // Blocking call
        return reply.getMessage();
    }

    @Override
    public void close() {
        channel.shutdown();
    }
}

// Client.java
package com.example.remotepattern;

public class Client {
    public static void main(String[] args) {
        try (GreeterProxy proxy = new GreeterProxy("localhost", 50051)) {
            String resp = proxy.sayHello("DesignPattern");
            System.out.println("Response: " + resp);
        }
    }
}
```

---

### Go implementation (gRPC)

**Dependencies**: `google.golang.org/grpc`, `google.golang.org/protobuf`; generate code with `protoc --go-grpc_out=. --go_out=. service.proto`

#### Server

```go
// server/main.go
package main

import (
	"context"
	"log"
	"net"

	"google.golang.org/grpc"
	pb "hellopattern"
)

type greeterServer struct {
	pb.UnimplementedGreeterServer
}

func (s *greeterServer) SayHello(ctx context.Context, req *pb.HelloRequest) (*pb.HelloReply, error) {
	return &pb.HelloReply{Message: "Hello, " + req.Name + " (from Go gRPC server)"}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGreeterServer(s, &greeterServer{})
	log.Println("Go gRPC server started on port 50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
```

#### Client proxy

```go
// client/main.go
package main

import (
	"context"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	pb "hellopattern"
)

// GreeterProxy remote proxy: wraps the gRPC stub and exposes a business interface
type GreeterProxy struct {
	client pb.GreeterClient
	conn   *grpc.ClientConn
}

func NewGreeterProxy(addr string) (*GreeterProxy, error) {
	conn, err := grpc.Dial(addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
		grpc.WithTimeout(5*time.Second),
	)
	if err != nil {
		return nil, err
	}
	return &GreeterProxy{
		client: pb.NewGreeterClient(conn),
		conn:   conn,
	}, nil
}

func (p *GreeterProxy) SayHello(name string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	reply, err := p.client.SayHello(ctx, &pb.HelloRequest{Name: name})
	if err != nil {
		return "", err
	}
	return reply.Message, nil
}

func (p *GreeterProxy) Close() error {
	return p.conn.Close()
}

func main() {
	proxy, err := NewGreeterProxy("localhost:50051")
	if err != nil {
		log.Fatalf("dial failed: %v", err)
	}
	defer proxy.Close()

	resp, err := proxy.SayHello("DesignPattern")
	if err != nil {
		log.Fatalf("RPC failed: %v", err)
	}
	log.Printf("Response: %s", resp)
}
```

---

### C++ implementation (gRPC)

**Dependencies**: `grpc++`, `grpc++_reflection`, `protobuf`; `protoc --grpc_out=. --cpp_out=. service.proto` generates `service.grpc.pb.h/cc` and `service.pb.h/cc`

#### Server

```cpp
// server.cc
#include <grpcpp/grpcpp.h>
#include "service.grpc.pb.h"

using grpc::Server;
using grpc::ServerBuilder;
using grpc::ServerContext;
using grpc::Status;
using hellopattern::Greeter;
using hellopattern::HelloReply;
using hellopattern::HelloRequest;

class GreeterServiceImpl final : public Greeter::Service {
    Status SayHello(ServerContext* context, const HelloRequest* request, HelloReply* reply) override {
        std::string prefix("Hello, ");
        reply->set_message(prefix + request->name() + " (from C++ gRPC server)");
        return Status::OK;
    }
};

int main() {
    std::string server_address("0.0.0.0:50051");
    GreeterServiceImpl service;
    ServerBuilder builder;
    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
    builder.RegisterService(&service);
    std::unique_ptr<Server> server(builder.BuildAndStart());
    std::cout << "C++ gRPC server listening on " << server_address << std::endl;
    server->Wait();
    return 0;
}
```

#### Client proxy

```cpp
// client.cc
#include <grpcpp/grpcpp.h>
#include "service.grpc.pb.h"
#include <iostream>
#include <memory>
#include <string>

using grpc::Channel;
using grpc::ClientContext;
using grpc::Status;
using hellopattern::Greeter;
using hellopattern::HelloReply;
using hellopattern::HelloRequest;

class GreeterProxy {
public:
    explicit GreeterProxy(std::shared_ptr<Channel> channel)
        : stub_(Greeter::NewStub(channel)) {}

    std::string SayHello(const std::string& name) {
        HelloRequest request;
        request.set_name(name);
        HelloReply reply;
        ClientContext context;
        context.set_deadline(std::chrono::system_clock::now() + std::chrono::seconds(3));

        Status status = stub_->SayHello(&context, request, &reply);
        if (status.ok()) {
            return reply.message();
        }
        std::cerr << "RPC failed: " << status.error_message() << std::endl;
        return "RPC failed";
    }

private:
    std::unique_ptr<Greeter::Stub> stub_;
};

int main() {
    auto channel = grpc::CreateChannel("localhost:50051", grpc::InsecureChannelCredentials());
    GreeterProxy proxy(channel);
    std::string reply = proxy.SayHello("DesignPattern");
    std::cout << "Response: " << reply << std::endl;
    return 0;
}
```

---

## Key points summary

| Dimension | Description |
|---|---|
| **Transparency** | Clients call through the `Subject` interface, unaware of network details |
| **Serialization** | Protobuf binary — cross-language, version-compatible, compact |
| **Error handling** | The proxy layer uniformly handles timeouts, retries, circuit breaking, and degradation (omitted in the examples for brevity) |
| **Lifecycle** | `Channel`/`ManagedChannel` must be closed explicitly to avoid connection leaks |
| **Security** | TLS must be enabled in production (`grpc.WithTransportCredentials` / `SslServerCredentials`) |

## Summary

The remote proxy pattern introduces a proxy object on the client side, encapsulating infrastructure logic such as network communication, serialization, and error handling, so that business code can call remote services just like local functions. In modern engineering practice, **gRPC + Protobuf** is the preferred cross-language remote proxy solution; combined with service governance frameworks (service discovery, load balancing, observability), it can build production-grade distributed systems.

## Related articles

- [Remote Facade and Data Transfer Object](/structural/remote-facade): the other orientation across processes — the proxy keeps transparency with object-level granularity, while the facade gives up transparency and follows use-case granularity.
- [Facade](/structural/facade): the unified entry point for the in-process version.
- [Timeout](/evolution/timeout), [Retry](/evolution/retry), [Circuit Breaker](/evolution/circuit-breaker): stability logic handled uniformly at the proxy layer.

## Sources

- [Wikipedia · Proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern) (see that entry for variant terminology).
- [Refactoring.Guru · Proxy](https://refactoring.guru/design-patterns/proxy)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [message-translator](/integration/message-translator.md)
- [introduction](/introduction.md)
- [reference](/reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
- [official-docs](/research/official-docs.md)
- [overview](overview.md)
- [remote-facade](remote-facade.md)
