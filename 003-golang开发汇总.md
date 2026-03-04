# golang语言开发汇总

## 发送https请求(跳过证书验证)

```go
package main

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

func main() {

	client := &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}

	path := "/opt/files/demo.txt"

	file, err := os.Open(path)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}

	body := &bytes.Buffer{}

	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("param1", file.Name())
	if err != nil {
		fmt.Println("Error creating form file:", err)
		return
	}
	_, err = io.Copy(part, file)
	if err != nil {
		fmt.Println("Error copying file:", err)
		return
	}
	err = writer.WriteField("param2", "value2")
	if err != nil {
		fmt.Println("Error writing field:", err)
		return
	}

	err = writer.Close()
	if err != nil {
		fmt.Println("Error closing writer:", err)
		return
	}
	url := "https://example.com/api/demo"
	request, err := http.NewRequest(http.MethodPost, url, body)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}
	request.Header.Set("Content-Type", writer.FormDataContentType())
	response, err := client.Do(request)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			fmt.Println("Error closing response body:", err)
		}
	}(response.Body)
	fmt.Println("Response status:", response.Status)
	fmt.Println("Response body:", response.Body)
}
```

## 原生web开发

## go-libp2p

### 注意事项:

> go version 与go-libp2p 对应关系
>
>> 1.17 github.com/libp2p/go-libp2p.git@v0.21.0
>>
>> 1.18 github.com/libp2p/go-libp2p.git@v0.22.0+
>
>
>> 具体可参考github/jianlu8023/golang-example.git

## golang 获取 docker 相关信息

[comment]: <> (https://pkg.go.dev/github.com/docker/docker@v20.10.26+incompatible/client#Client.ContainerLogs)

### Tips

golang@1.17.5 需要使用低版本docker依赖

此库更高版本均需golang@1.18

```shell
go mod edit -require github.com/docker/docker@v20.10.26+incompatible
```

## go mod相关问题

* 命令: go mod vendor:checksum mismatch
* 错误信息

```text
go: github.com/hyperledger/fabric-contract-api-go@v1.1.1 requires
github.com/cucumber/godog@v0.8.0: verifying go.mod: checksum mismatch
downloaded: h1:FQ2MobPXycdSajAK3inNgLSAKGFmZqbE4S/CExz41Ys=
sum.golang.org: h1:Cp3tEV1LRAyH/RuCThcxHS/+9ORZ+FMzPva2AZ5Ki+A=

SECURITY ERROR
This download does NOT match the one reported by the checksum server.
The bits may have been replaced on the origin server, or an attacker may
have intercepted the download attempt.

For more information, see 'go help module-auth'.
```

* 出错原因: 由于使用了goproxy代理,<br>导致hash值与sum.golang.org中hash值不一致，并且GOSUMDB为on

### 正确流程

* 1 设置go环境 下方二选一

```text
export GOSUMDB=off  此modules不进行checksum
export GONOSUMDB=github.com/hyperledger/* 遇到github.com/hyperledger/所有的依赖都不checksum
```

* 2 go mod init xxx </br>xxx为module名
* 3 指定依赖版本

```text
go mod edit -require=github.com/hyperledger/fabric-contract-api-go@v1.1.1
go mod edit -go=1.16
```

* 4 go mod vendor
* 5 zip -r xxx.zip xxx/

## goland低版本 debug 失败

使用低版本goland进行debug时报错

```text
error layer=debugger cloud not patch runtime.mallogc
```

原因： goland使用dlv进行debug，在使用低版本goland针对高版本go编写代码进行debug时进行报错，dlv版本过低

### 解决方案

1. 更新goland版本


2. 下载新dlv替换旧dlv

    1. 下载dlv的latest版本
    ```shell
    go install github.com/go-delve/delve/cmd/dlv@latest
    ```
    2. 删除goland安装目录下的dlv
    ```shell
    cd 安装目录
    # linux为linux系统中替换
    # 如果时windows 则进入windows
    cd plugins/go/lib/dlv/linux
    rm -rf dlv
    ```
    3. 拷贝新dlv到上一步目录下
   ```shell
   cp $GOPATH/bin/dlv ./dlv
   ```

## go1.16版本使用golang/x相关包的教程

```shell
go mod edit replace golang.org/x/sys => golang.org/x/sys v0.0.0-20201204225414-ed752295db88
```

## gitlab做私服

### 前提设定

```text
* gitlab 采用http协议

* gitlab 私服地址: 10.10.10.99

* gitlab 用户名: jianlu

* gitlab 私服仓库名: go-tools

* gitlab 私服仓库tag v1.0.0,v1.1.2...

```

### 准备工作

```text
1. 安装git、go等工具
```

### 环境配置

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

### go项目依赖引入步骤

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

## 占位
