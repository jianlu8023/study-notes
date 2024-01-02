<a id = "top"></a>

# 配置fabric开发环境

----

## 目录

* [步骤](#1)

<a id = "1"></a>

### 步骤

1. 到gopath目录

```shell
cd $GOPATH
```

2. 创建文件夹

```shell
mkdir {src,pkg,bin}
mkdir -p src/github.com/hyperledger/fabric/
```

3. 克隆指定版本fabric

```shell
git clone -b v2.2.0 https://gitee.com/hyperledger/fabric.git fabric2.2.0
```

4. 进入fabric/script文件夹

```shell
cd $GOPATH/src/github.com/hyperledger/fabric/fabric2.2.0/script
```

5. 修改bootstrap.sh

```shell
vi bootstrap.sh
```

内容

```text
######################展示有改动位置##########################
# 这里指定fabric-simple版本
VERSION=2.2.0

# 指定fabric-ca版本
CA_VERSION=1.4.9

cloneSamplesRepo() {
    if [ -d test-network ]; then
        echo "==> Already in fabric-samples repo"
    elif [ -d fabric-samples ]; then
        echo "===> Changing directory to fabric-samples"
        cd fabric-samples
    else
        echo "===> Cloning hyperledger/fabric-samples repo"
        # 这里有修改
        git clone -b main https://ghproxy.com/https://github.com/hyperledger/fabric-samples.git && cd fabric-samples
    fi
    if GIT_DIR=.git git rev-parse v${VERSION} >/dev/null 2>&1; then
        echo "===> Checking out v${VERSION} of hyperledger/fabric-samples"
        git checkout -q v${VERSION}
    else
        echo "fabric-samples v${VERSION} does not exist, defaulting to main. fabric-samples main branch is intended to work with recent versions of fabric."
        git checkout -q main
    fi
}
pullBinaries() {
    echo "===> Downloading version ${FABRIC_TAG} platform specific fabric binaries"
            # 这里有修改
    download "${BINARY_FILE}" "https://ghproxy.com/https://github.com/hyperledger/fabric/releases/download/v${VERSION}/${BINARY_FILE}"
    if [ $? -eq 22 ]; then
        echo
        echo "------> ${FABRIC_TAG} platform specific fabric binary is not available to download <----"
        echo
        exit
    fi
    echo "===> Downloading version ${CA_TAG} platform specific fabric-ca-client binary"
# 这里有修改
    download "${CA_BINARY_FILE}" "https://ghproxy.com/https://github.com/hyperledger/fabric-ca/releases/download/v${CA_VERSION}/${CA_BINARY_FILE}"
    if [ $? -eq 22 ]; then
        echo
        echo "------> ${CA_TAG} fabric-ca-client binary is not available to download  (Available from 1.1.0-rc1) <----"
        echo
        exit
    fi
}
```

保存后

```shell
./bootstrap.sh
```

6. 启动测试环境

```shell
cd fabric-simples/test-network
# 启动测试网络并创建名为mychannel的通道
./network.sh createChannel -ca -s couchdb
# 关闭测试网络
./network.sh down
```