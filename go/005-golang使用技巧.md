<a id="top"></a>

# golang 使用技巧

----

## 目录

[comment]: <> (<a id="1"></a>)

* [文件路径](#1)
* [go测试](#2)
* [go mod edit 用法](#3)
* [获取当前项目根目录](#4)

<a id="1"></a>

## 文件路径

```go
package main

import "path/filepath"

filepath.Join()
// 此方法获取文件string
// example:
filepath.Join(os.Getenv("GOPATH"),
"study",
"go-sdk-demo",
"fixtures",
"org2.pem")
```

<a id="2"></a>

## go测试

1. 建立test包


2. 创建相应包

```text
比如测试service
报名如下
test.service
```

3. 创建go文件

```text
go文件名xxx_test.go
```

4. 编写go测试方法

```go
package test

import (
	"fmt"
	"testing"
)

func Test_say(t *testing.T) {
	fmt.Println("hello world")
}
```

<a id="3"></a>

## go mod edit 用法

1. 引入某一包

举例: 引入fabric-sdk-go-gm@v0.0.7版本

```sh
go mod edit -require=github.com/hxx258456/fabric-sdk-go-gm@v0.0.7

```

2. 替换包版本

使用原因: 当你引入某一第三方依赖(A)时，你需要的依赖的包(B)在A中被引用，但是版本不是你需要的时，可以使用replace命令进行替换

举例: 替换github.com/zmap/zlint

```bash
go mod edit -replace github.com/zmap/zlint=github.com/zmap/zlint@v0.0.0-20190806154020-fd021b4cfbeb
```

<a id="4"></a>

## 获取工作目录

* 方式1

```go

wd, _ := os.Getwd() // 获取当前ml
fmt.Println("os.Getwd(): ", wd)


```

* 方式2

```go
lookPath, _ := exec.LookPath(os.Args[0])
abs, _ := filepath.Abs(lookPath)
dir := path.Dir(abs)
fmt.Println("os.Args[0]: ", dir)
```

* 方式3

```go
_, file, _, _ := runtime.Caller(0)
fmt.Println("runtime.Caller(0): ", file)

```

## 快速读取文件内容

[comment]: <> (//go:embed)

```go

package main
 
import (
 _ "embed"
 "fmt"
 "strings"
)
 
var (
 Version string = strings.TrimSpace(version)
 //go:embed version.txt
 version string
)
 
func main() {
 fmt.Printf("Version %q\n", Version)
}

```

[回到顶部](#top)