<a id = "top"></a>

# hyperledger fabric 2.4 国密版本搭建流程

----

## 目录

* [环境准备](#1)
* [环境搭建](#2)
* [验证搭建](#3)

<a id = "1"></a>

## 环境准备

1. 检查go语言版本

```bash
go version #查看当前go语言版本 如果为1.17.5 则不需要重装

# 版本不是1.17.5 则执行下述命令
cd /usr/local/dev/
wget https://golang.google.cn/dl/go1.17.5.linux-amd64.tar.gz
tar xzvf go1.17.5.linux-amd64.tar.gz
```

2. 检查docker版本

```bash
docker version # 查看docker版本 要求大于20
```

3. 检查docker-compose版本

```bash
docker-compose -v # 查看docker-compose版本 
```

<a id = "2"></a>

## 环境搭建

1. 克隆国密2.4版本仓库

```bash
cd $GOPATH/src/github.com/hyperledger/fabric/
git clone https://ghproxy.com/https://github.com/hxx258456/fabric-gm.git
```

2. 重构fabric-docker镜像

```bash
cd $GOPATH/src/github.com/hyperledger/fabric/fabric-gm
make clean-all
make release
make docker 
```

3. 克隆国密版本ca

```bash
cd $GOPATH/src/github.com/hyperledger/fabric/fabric-gm
git clone https://ghproxy.com/https://github.com/hxx258456/fabric-ca-gm.git
```

4. 重构ca-docker镜像

```bash
cd $GOPATH/src/github.com/hyperledger/fabric/fabric-gm/fabric-ca-gm
make clean-all
make release
make docker
```

5. 克隆fabric-sample

```bash
cd $GOPATH/src/github.com/hyperledger/fabric/fabric-gm/scripts
git clone https://ghproxy.com/https://github.com/hxx258456/fabric-samples-gm.git
```

<a id = "3"></a>

## 验证搭建

6. 启动测试网络进行测试

准备工作

```bash
# 进入test
cd $GOPATH/src/github.com/hyperledger/fabric/fabric-gm/scripts/fabric-samples-gm/bin

cp ../../../../fabric-gm/release/linux-amd64/bin/* ./
cp ../../../fabric-ca-gm/release/linux-amd64/bin/* ./ 
```

检查 

```text
检查项1
$GOPATH/src/github.com/hyperledger/fabric/fabric-gm/scripts/fabric-simple-gm/test-network/configtx/configtx.yaml文件中org的端口是否为8051

检查项2
$GOPATH/src/github.com/hyperledger/fabric/fabric-gm/scripts/fabric-simple-gm/test-network/organizations/ccp-generate.sh 中关于org1的部分端口是否为8051
```

启动fabric网络并创建通道:

```sh
# 启动网络
./network.sh up

# 创建通道
./network.sh createChannel

# 使用此条 
./network.sh createChannel -ca -s couchdb
```

发布合约:

```sh
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go

# 使用此条 安装basic合约并初始化
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go -ccv 1 -cci InitLedger
```

切换peer节点:peer0.org1.example.com，并初始化合约资产:

```sh
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:8051

# 此条不执行 上方安装合约时已经初始化
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"InitLedger","Args":[]}'
```

查看资产:

```sh
# 查看合约资产初始数据
peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAssets"]}'

# 查看指定资产
peer chaincode query -C mychannel -n basic -c '{"Args":["ReadAsset","asset6"]}'
```

转移指定资产，将asset6的owner改为Christopher:

```sh
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:8051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"TransferAsset","Args":["asset6","Christopher"]}'
```

查看指定资产:

```sh
# 切换peer节点:peer0.org2.example.com(可选)
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

# 查看指定资产
peer chaincode query -C mychannel -n basic -c '{"Args":["ReadAsset","asset6"]}'
```

至此，可以看到国密改造后的fabric能够正常运行智能合约了。

接下来检查当前通道有没有使用国密算法:

```sh
# 拉取当前通道配置，会在当前目录下生成文件: mychannel_config.block
peer channel fetch config -c mychannel
# 将mychannel_config.block转为json，可以在json中查看到hash算法使用的是SM3(搜索关键字"hash_function")
configtxlator proto_decode  --type common.Block --input mychannel_config.block > mychannel_config.json

# 检查相关证书
# 随便找一个证书，如:"test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp/signcerts/peer0.org1.example.com-cert.pem"
# 通过openssl x509命令可以查看证书内容，看到签名算法为 "SM2-with-SM3" ，证书公钥算法为 "sm2"
# 注意，需要本地openssl支持国密算法。
dir_test_network=${PWD}
cd organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp/signcerts/
openssl x509 -text --no-out -in *.pem

```

最后，关闭fabric网络:

```sh
# 关闭fabric网络
cd ${dir_test_network}
./network.sh down
```
