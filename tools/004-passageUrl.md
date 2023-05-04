#### 二次元机场订阅

[comment]:<>(https://owo.ecydy.com/link/Gset1vsZrkjgPTfb?clash=1)

#### ubuntu root auto-login

```text
https://blog.csdn.net/m0_46128839/article/details/116133371
```

#### 修改终端中用户名显示颜色

```text
https://blog.csdn.net/vactivx/article/details/62219349
```

显示蓝色代码 加在

```shell
if [ "$color_prompt" = yes ]; then 
  PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\W\[\033[00m\]\$ '
else 
  PS1='${debian_chroot:+($debian_chroot)}\u@\h:\W\$ '
fi 
unset color_prompt force_color_prompt
```

后

```shell
PS1='${debian_chroot:+($debian_chroot)}\[\033[01;34;1m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
```

#### win11 ubuntu 双系统 安装

```text
https://www.bilibili.com/video/av50786831/
```

#### win11 ubuntu 双系统 创建u盘

```text
https://blog.csdn.net/weixin_43002202/article/details/120951578
```

#### ubuntu打字问题解决

```text
https://blog.csdn.net/qq_44866828/article/details/122472530
```

##### 步骤

```text
1. rm -rf ibus
2. sudo apt install ibus ibus-rime
3. 重启下系统、
4. [设置] - [区域与语言] - [输入源] - [+]->选择 中文(Rime)->
   然后删掉其他不需要的输入法->[管理已安装的语言] - [键盘输入法系统]->选择ibus
5. cd ~/.config/ibus/rime/->gedit default.custom.yaml
```

```yaml
patch:
schema_list:

  - schema:
      luna_pinyin_simp menu:
    page_size:
      9 ascii_composer:
    switch_key:
    Shift_L: commit_code
```

```text
6. cd ~/.config/ibus/rime/build/->gedit ibus_rime.yaml
```

```yaml
style:
  horizontal: true
```

```text
7. ibus restart
```

#### 为什么使用 CouchDB

```text
https://blog.csdn.net/aitutou/article/details/124102503
```

#### Hyperledger Fabric 学习智能合约（链码）使用富查询

```text
https://my.oschina.net/u/4414726/blog/4520892
```

#### ubuntu atom

```text
https://atomsk.univ-lille.fr/dl.php
```

#### ubuntu 安装微信

```text
https://www.cnblogs.com/fusheng-rextimmy/p/15416967.html
```

#### goland破解

```text
https://www.jetbrains.com.cn/en-us/go/download/other.html
https://easyhappy.github.io/travel-coding/ideaGoland%E6%9C%80%E6%96%B0%E7%A0%B4%E8%A7%A3%E6%95%99%E7%A8%8B.html
```

#### fabric中文文档

```text
https://hyperledger-fabric.readthedocs.io/zh_CN/release-2.2/who_we_are.html
```

#### wps安装字体

```shell
sudo unzip wps_symbol_fonts.zip -d /usr/share/fonts/wps-office
```

#### 安装sublime

```shell
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/sublimehq-archive.gpg echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list 
sudo apt-get install apt-transport-https 
sudo apt-get install sublime-text
#sublime创建软链接 
sudo ln -s /opt/sublime_text/sublime_text /usr/local/bin/sublime
```

#### ubuntu 无声音输出

```text
https://www.cnblogs.com/GengMingYan/p/14853513.html
```

#### apt install所有

```shell
apt install libtool libltdl-dev curl wget git build-essential docker-compose docker ubuntu-restricted-extras
```

#### h5

```shell
sudo apt-get install ubuntu-restricted-extras
```

#### nvm安装

##### 使用git工具进行安装

##### 步骤

```shell
# 1 cd ~/ from anywhere
cd ~/
# 2 git clone 
git clone https://ghproxy.com/https://github.com/nvm-sh/nvm.git .nvm
# 3 cd ~/.nvm
cd ~/.nvm
# 4 
git checkout v0.39.1
# 5 
. ./nvm.sh
# 6 edit ~/.bashrc ~/.zshrc or ~/.profile 
edit ~/.zshrc
# 7 
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
# 8 
source ~/.zshrc
```

[comment]: <> (1. cd ~/ from anywhere then ==>git clone https://ghproxy.com/https://github.com/nvm-sh/nvm.git .nvm)

[comment]: <> (2. cd ~/.nvm and check out the latest version with ==>git checkout v0.39.1 activate nvm by sourcing it from your)

[comment]: <> (   shell: >. ./nvm.sh Now add these lines to your ~/.bashrc, ~/.profile, or ~/.zshrc file to have it automatically)

[comment]: <> (   sourced upon login: &#40;you may have to add to more than one of the above files&#41;)

[comment]: <> (export NVM_DIR="$HOME/.nvm")

[comment]: <> ([ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm)

[comment]: <> ([ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion)

```shell
curl -o- https://ghproxy.com/https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

```shell
wget -qO- https://ghproxy.com/https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

#### docker 国内加速

```shell
vi /etc/docker/daemon.json 
```

```text
{
"registry-mirrors": [

        "http://hub-mirror.c.163.com",
        "https://docker.mirrors.ustc.edu.cn"
    ]

}
```

```shell
systemctl restart docker.service
```

#### 智能合约导包

```gotemplate
import (
"encoding/json"
"fmt"
"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

```

#### github代理

```shell
https://ghproxy.com/
```

#### golang

```text
wget https://golang.google.cn/dl/go1.16.15.linux-amd64.tar.gz
```

#### java jdk

```text
wget https://repo.huaweicloud.com/java/jdk/8u202-b08/jdk-8u202-linux-x64.tar.gz
```

#### fabric2.2.0

```shell
git clone -b release-2.2 https://gitee.com/hyperledger/fabric.git fabric2.2 
git clone -b release-2.2 https://ghproxy.com/https://github.com/hyperledger/fabric.git fabric2.2

```

#### test-network env shell

```shell
./network.sh createChannel -ca -s couchdb
```

```text
启动后服务地址
http://localhost:5984/_utils
admin adminpw

安装合约 go mod tidy

go版合约 ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go

./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-java -ccl java

export PATH=${PWD}/../bin:$PATH 设置成功后即可使用二进制文件命令：
将fabric-samples代码库中的FABRIC_CFG_PATH设置为指向core.yaml（fabric-samples/config/目录下)文件： export FABRIC_CFG_PATH=$PWD/../config/

设置org1下的peer的环境变量(需操作哪个组织下的peer就设置哪个peer的环境变量)
export CORE_PEER_TLS_ENABLED=true export CORE_PEER_LOCALMSPID="Org1MSP"
export
CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
-C mychannel -n transfer --peerAddresses localhost:7051 --tlsRootCertFiles "
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses
localhost:9051 --tlsRootCertFiles "
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"Init"
,"Args":[]}'
```

#### blockchain keyword

```text
Anchor Peer / 锚节点 
Block / 区块 
Chain / 链 
Chaincode / 链码 
Channel / 通道 
Commitment / 提交 
CCVC / 英文全拼Concurrency Control
Version Check / 保持peer节点间状态同步的算法 
Configuration Block / 配置区块 
Consensus / 共识 
Current State / 当前状态 
Dynamic Membership /动态成员 
Endorsement / 背书 
Endorsement policy / 背书策略 
Genesis Block / 初始区块 
Gossip Protocol / Gossip协议 /就是一个协议的名称，Gossip可以翻译成八卦的意思，但是没有意义 
Initialize / 初始化 
Install / 安装 
Instantiate / 实例化 
Invoke / 调用 
Leading Peer / 主导节点 
Ledger / 账本 
Member / 成员 
MSP / Membership Service Provider / 直翻为成员服务提供商，FabricCA就是一种MSP 
Membership Services / 成员服务 
Ordering Service / 排序服务或共识服务 
Peer / 节点 
Policy / 策略 
Proposal / 提案 
Query / 查询 
SDK / Software Development Kit / 软件开发工具 
State Database / stateDB / 状态数据库 
System Chain / 系统链 或 system channel 系统通道 
Transaction / 交易

```
