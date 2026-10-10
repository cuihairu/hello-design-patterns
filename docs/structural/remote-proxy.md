# 远程代理模式（Remote Proxy Pattern）

## 概述

远程代理模式是一种结构型设计模式，它为其他对象提供一种代理以控制对这个对象的访问。在分布式系统中，远程代理用于访问远程对象，使本地对象可以像访问本地对象一样透明地访问远程对象。代理负责处理网络通信细节（序列化、连接管理、超时重试等），客户端无感知。

## 使用场景

- **分布式系统**：对象位于不同物理机器，通过网络通信
- **微服务架构**：服务间 RPC 调用，代理屏蔽网络细节
- **延迟初始化**：首次调用时才建立连接
- **访问控制**：在代理层做鉴权、限流、熔断
- **故障隔离**：超时、重试、熔断逻辑集中在代理，不污染业务代码

## 核心组件

1. **代理接口（Subject）**：定义客户端调用的方法签名，本地/远程实现同接口
2. **远程实现（RealSubject）**：运行在服务端的实际业务逻辑
3. **代理对象（Proxy）**：客户端持有的存根，负责序列化参数、发起网络请求、反序列化结果
4. **通信层**：gRPC / RMI / HTTP+JSON / 自定义协议

## 示例代码

以下展示三种主流技术栈的最小化远程代理实现：**Java gRPC**、**Go gRPC**、**C++ gRPC**。gRPC 基于 Protobuf 定义接口，自动生成存根/骨架，是现代微服务的标准选择。

### 共享 Protobuf 定义 (`service.proto`)

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

### Java 实现（gRPC + Netty）

**依赖**（Maven/Gradle 自行添加 `grpc-stub`、`grpc-protobuf`、`grpc-netty-shaded`、`protobuf-java`）

#### 服务端实现

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

#### 客户端代理（远程代理）

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
                .usePlaintext()  // 生产环境请用 TLS
                .build();
        this.stub = GreeterGrpc.newBlockingStub(channel);
    }

    // 代理方法：本地调用 → 远程 RPC
    public String sayHello(String name) {
        HelloRequest request = HelloRequest.newBuilder().setName(name).build();
        HelloReply reply = stub.sayHello(request);  // 阻塞式调用
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

### Go 实现（gRPC）

**依赖**：`google.golang.org/grpc`、`google.golang.org/protobuf`，`protoc --go-grpc_out=. --go_out=. service.proto` 生成代码

#### 服务端

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

#### 客户端代理

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

// GreeterProxy 远程代理：封装 gRPC 存根，暴露业务接口
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

### C++ 实现（gRPC）

**依赖**：`grpc++`、`grpc++_reflection`、`protobuf`，`protoc --grpc_out=. --cpp_out=. service.proto` 生成 `service.grpc.pb.h/cc`、`service.pb.h/cc`

#### 服务端

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

#### 客户端代理

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

## 关键点总结

| 维度 | 说明 |
|---|---|
| **透明性** | 客户端通过 `Subject` 接口调用，无感知网络细节 |
| **序列化** | Protobuf 二进制，跨语言、版本兼容、体积小 |
| **错误处理** | 代理层统一处理超时、重试、熔断、降级（示例为简洁省略） |
| **生命周期** | `Channel`/`ManagedChannel` 需显式关闭，避免连接泄漏 |
| **安全** | 生产环境必须启用 TLS（`grpc.WithTransportCredentials` / `SslServerCredentials`） |

## 总结

远程代理模式通过在客户端引入代理对象，将网络通信、序列化、错误处理等基础设施逻辑封装起来，使业务代码像调用本地函数一样调用远程服务。现代工程实践中，**gRPC + Protobuf** 是跨语言远程代理的首选方案，配合服务治理框架（服务发现、负载均衡、可观测性）可构建生产级分布式系统。

## 相关篇目

- [远程外观与数据传输对象](/structural/remote-facade)：跨进程的另一种取向——代理保透明、粒度跟对象，外观弃透明、粒度跟用例。
- [外观模式](/structural/facade)：进程内版本的统一入口。
- [超时](/evolution/timeout)、[重试](/evolution/retry)、[熔断器](/evolution/circuit-breaker)：代理层统一处理的稳定性逻辑。