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