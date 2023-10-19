# golang grpc 使用

[grpc官网](https://grpc.io)
[grpc中文版](http://doc.oschina.net/grpc)

[comment]: <> (https://zhuanlan.zhihu.com/p/411317961)

[comment]: <> (https://www.cnblogs.com/nonsec/p/15504579.html)

[comment]: <下载protoc> (https://github.com/protocolbuffers/protobuf/releases)

## 安装 protobuf工具,用于生成各种不同语言的代码

```shell
wget https://ghproxy.com/https://github.com/protocolbuffers/protobuf/releases/download/v24.4/protoc-24.4-linux-x86_64.zip
```

## 安装golang代码生成器

```shell
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest      
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

## proto 文件编写

```protobuf
syntax = "proto3";

package demo.proto;

option go_package = "./proto;proto";

message LoginRequest{
  string username = 1;
  string password = 2;
}

message LoginResponse{
  int64 code = 1;
  string message = 2;
}

service UserService {
  rpc Login(LoginRequest) returns (LoginResponse){};
}
```

## proto文件

```protobuf
syntax = 'proto3';

option go_package = '.;service';

service SayHello {
  rpc SayHello(HelloRequest) returns (HelloResponse){}
}

message HelloRequest{
  string requestName = 1;

}

message HelloResponse{
  string responseName = 1;
}

message PersonInfo{
  message Person{
    repeated string email = 1;
    optional string sex = 2;
    string name = 3;
  }
  repeated Person info = 1;
}

// 要在它的父消息类型的外部重用这个消息类型 
message PersonMessage{
  PersonInfo.Person info = 1;
}
```

## 生成

在proto文件夹下

```shell
protoc --go_out= . hello.proto
protoc --go-grpc_out= . hello.proto
```

## proto文件介绍

```text
message : protobuf中定义一个消息类型是通过关键字message字段指定的。struct

required 消息中必填字段
optional 消息中可选字段
repeated 消息中可重复字段

消息号 每个字段都必须有一个唯一的标识号 [1,2^99-1]的整数
```

## 服务端、客户端编写

* 服务端

1. 创建grpc Server对象
2. 将server注册到grpc Server的内部注册中心，可以接收到请求时，通过内部服务发现，发现该服务端接口并转发
3. 创建listen 监听tcp端口
4. grpc Server 开始lis.Accept 直到stop


* 客户端

1. 创建与给定目标的连接交互
2. 创建server的客户端对象
3. 发送rpc请求，等待同步响应，得到回调后返回响应结果
4. 输出响应结果

## 认证与安全传输

* tls
* token

[comment]: <> (https://www.cnblogs.com/tohxyblog/p/8974763.html)


[comment]: <> (http好比普通话，rpc好比团伙内部黑话。 讲普通话，好处就是谁都听得懂，谁都会讲。 讲黑话，好处是可以更精简、更加保密、更加可定制，坏处就是要求“说”黑话的那一方（client端）也要懂，而且一旦大家都说一种黑话了，换黑话就困难了。)