## golang grpc 使用

[comment]: <> (https://zhuanlan.zhihu.com/p/411317961)

[comment]: <> (https://www.cnblogs.com/nonsec/p/15504579.html)

[comment]: <下载protoc> (https://github.com/protocolbuffers/protobuf/releases)

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
  int64 code =1;
  string message = 2;
}

service UserService {
  rpc Login(LoginRequest) returns (LoginResponse){};
}
```

[comment]: <> (https://www.cnblogs.com/tohxyblog/p/8974763.html)


[comment]: <> (http好比普通话，rpc好比团伙内部黑话。 讲普通话，好处就是谁都听得懂，谁都会讲。 讲黑话，好处是可以更精简、更加保密、更加可定制，坏处就是要求“说”黑话的那一方（client端）也要懂，而且一旦大家都说一种黑话了，换黑话就困难了。)