# golang 使用技巧

## 文件路径

```go
package main


imports (
"path/filepath"
)


filepath.Join()
// 此方法获取文件string
// example:
filepath.Join(os.Getenv("GOPATH"),
"study",
"go-sdk-demo",
"fixtures",
"org2.pem")
```

