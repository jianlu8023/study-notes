# 011-gitlab私服当module依赖

## 前提设定

```text
* gitlab 采用http协议

* gitlab 私服地址: 10.10.10.99

* gitlab 用户名: jianlu

* gitlab 私服仓库名: go-tools

* gitlab 私服仓库tag v1.0.0,v1.1.2...

```

## 准备工作

```text
1. 安装git、go等工具
```

## 环境配置

```text
提示 /etc/profile 或 ~/.zshrc 或 ~/.bashrc等配置文件中设置

提示 /etc/profile 或 ~/.zshrc 或 ~/.bashrc等配置文件中设置

提示 /etc/profile 或 ~/.zshrc 或 ~/.bashrc等配置文件中设置
```

1. GOINSECURE 设置
```shell
export GOINSECURE=10.10.10.99
```

2. GOPRIVATE 设置
```shell
export GOPRIVATE=10.10.10.99
```

3. GONOSUMDB 设置
```shell
export GONOSUMDB=10.10.10.99/*,github.com/hyperledger/fabric*
```

4. GIT_TERMINAL_PROMPT 设置
```shell
export GIT_TERMINAL_PROMPT=1
```

5. 相关完整配置如下
```shell
WD=/usr/local/dev
export EDITOR=/usr/bin/vim

export GOROOT=${WD}/go1.22.2
export GOPATH=/root/go
export GONOSUMDB=github.com/hyperledger/fabric*,10.10.10.99/*
export GOSUMDB=sum.golang.google.cn
export GOINSECURE=10.10.10.99
export GOPRIVATE=10.10.10.99
export GO111MODULE=on
export GOPROXY=https://goproxy.cn,direct

export GIT_TERMINAL_PROMPT=1

export PATH=$GOROOT/bin:$GOPATH/bin:$PATH

```
6. git 设置
```shell
git config --global url."http://10.10.10.99".insteadOf "https://10.10.10.99"
```

7. git 设置从文件中查看样例
```text
[core]
        autocrlf = input
[url "http://10.10.10.99"]
        insteadOf = https://10.10.10.99
```

8. 代码提交到gitlab仓库并打tag


## go项目依赖引入步骤

```shell
cd /tmp

mkdir go-module-demo

cd go-module-demo

go mod init go-module-demo

# 编辑main.go 文件
# 内容如下:
###
package main

import (
	"fmt"

	"10.10.10.99/jianlu/go-tools/pkg/echo"
)

func main() {
	fmt.Println(echo.Echo("testing"))
}
###


go mod edit -require 10.10.10.99/jianlu/go-tools@v1.0.0

go mod tidy

go run main.go

# 此时会输出
###
testing
###

######目录结构#########
go-module-demo
├── go.mod
├── go.sum
└── main.go

```



