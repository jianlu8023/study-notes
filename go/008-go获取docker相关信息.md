# golang 获取 docker 相关信息

[comment]: <> (https://pkg.go.dev/github.com/docker/docker@v20.10.26+incompatible/client#Client.ContainerLogs)

## Tips

golang@1.17.5 需要使用低版本docker依赖

此库更高版本均需golang@1.18

```shell
go mod edit -require github.com/docker/docker@v20.10.26+incompatible
```