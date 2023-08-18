### 解决go mod相关问题

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