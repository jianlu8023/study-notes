# ipfs swarm.key 生成

## 方案一

Tips: 此方案直白来说就是使用crypto.random生成32位随机数，然后转化为16进制，最后生成swarm.key文件。

### 步骤

1. 安装工具

```shell
go install github.com/Kubuxu/go-ipfs-swarm-key-gen/ipfs-swarm-key-gen@latest
```

2. 生成swarm.key文件

```shell
ipfs-swarm-key-gen >./swarm.key
```

## 方案二

### 步骤

1. 编写shell脚本

```shell
PWD=$1
echo "/key/swarm/psk/1.0.0/" > $PWD/swarm.key
echo "/base16/" >> $PWD/swarm.key
cat /dev/urandom | tr -dc 'a-f0-9' | head -c64 >> $PWD/swarm.key

#echo "/key/swarm/psk/1.0.0/" > ~/.ipfs/swarm.key
#echo "/base16/" >> ~/.ipfs/swarm.key
#cat /dev/urandom | tr -dc 'a-f0-9' | head -c64 >> ~/.ipfs/swarm.key


```

2. 执行脚本

```shell
bash swarmkey.sh ${PWD}

```
