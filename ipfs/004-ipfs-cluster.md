# ipfs-cluster

-----

## 简介

## 搭建方案

### 方案一 裸机搭建



#### 搭建步骤

1. 获取ipfs、ipfs-cluster源码

```shell
git clone https://github.com/ipfs/go-ipfs.git

git clone https://github.com/ipfs-cluster/ipfs-cluster.git


```

2. 编译ipfs、ipfs-cluster

```shell
cd ipfs
make install

cd ipfs-cluster
make install

```

3. 启动ipfs

```shell
# 1. 使用ipfs-swarmkey生成教程生成swarm.key文件

export IPFS_PATH=${PWD}/ipfs

ipfs init --profile server

ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
ipfs config Addresses.Swarm /ip4/0.0.0.0/tcp/4001,/ip4/0.0.0.0/udp/4001/quic
ipfs config Swarm.PrivateNetwork true
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config Swarm.Key ${PWD}/ipfs/swarm.key
ipfs config Routing.Type dht
ipfs bootstrap rm --all
# 2. 获取id 将本结点连接信息加入bootstrap
ipfs id 
ipfs bootstrap add /ip4/127.0.0.1/tcp/4001/p2p/${获取id}

# 3. 启动ipfs
ipfs daemon
```

4. 启动ipfs-cluster

```shell

export IPFS_CLUSTER_PATH=${PWD}/cluster

# 1. 生成ipfs-cluster的配置文件
ipfs-cluster-service init

# 3. 查看secret

jq '.cluster.secret' ${IPFS_CLUSTER_PATH}/service.json

# 4. 查看机器id 
jq '.id' ${IPFS_CLUSTER_PATH}/identify.json

# 2. 启动ipfs-cluster
ipfs-cluster-service --loglevel debug daemon

```

5. 其他机器启动ipfs

```shell
export IPFS_PATH=${PWD}/ipfs

# 1. 拷贝 swarm.key 到 IPFS_PATH

ipfs init --profile server

ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
ipfs config Addresses.Swarm /ip4/0.0.0.0/tcp/4001,/ip4/0.0.0.0/udp/4001/quic
ipfs config Swarm.PrivateNetwork true
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config Swarm.Key ${PWD}/ipfs/swarm.key
ipfs config Routing.Type dht
ipfs bootstrap rm --all
# 2. 获取id 将本结点连接信息加入bootstrap
ipfs id 
ipfs bootstrap add /ip4/127.0.0.1/tcp/4001/p2p/${获取id}
ipfs bootstrap add /ip4/${其他机器 IP }/udp/4001/quic/p2p/${其他机器 id}

# 3. 启动ipfs
ipfs daemon
```

6. 其他机器启动ipfs-cluster

```shell
export IPFS_CLUSTER_PATH=${PWD}/cluster


# 1. 获取第一台机器的secret
export CLUSTER_SECRET=${第一台机器的secret}

ipfs-cluster-service --loglevel debug daemon -j /ip4/${第一台机器的 IP}/udp/9096/quic/p2p/${第一台机器的 id}  
```

### 方案二 docker部署


#### 搭建步骤


1. 编写docker-compose.yaml文件

```yaml
version: '3.9'
networks:
  ipfs:
    name: "ipfs_cluster"
    ipam:
      config:
        - subnet: 172.27.138.0/24
services:
  ipfs:
    image: ipfs/go-ipfs:release
    restart: always
    container_name: ipfs
    hostname: ipfs_node
    ports:
      - "4001:4001"
      - "5001:5001"
      - "8080:8080"
    volumes:
      - ./compose/ipfs:/data/ipfs
      - /etc/hosts:/etc/hosts
    networks:
      ipfs:
        ipv4_address: 172.27.138.22 
  cluster:
    restart: always
    image: ipfs/ipfs-cluster:stable
    container_name: cluster
    depends_on:
      - ipfs
    networks:
      ipfs:
        ipv4_address: 172.27.138.23
    environment:
      CLUSTER_PEERNAME: cluster0
      CLUSTER_SECRET: ${CLUSTER_SECRET} # From shell variable if set
      CLUSTER_IPFSHTTP_NODEMULTIADDRESS: /dns4/ipfs/tcp/5001
      CLUSTER_CRDT_TRUSTEDPEERS: '*' # Trust all peers in Cluster
      CLUSTER_RESTAPI_HTTPLISTENMULTIADDRESS: /ip4/0.0.0.0/tcp/9094 # Expose API
      CLUSTER_MONITORPINGINTERVAL: 2s # Speed up peer discovery
      #CLUSTER_PEERADDRESSES: "/ip4/172.25.138.45/tcp/9096/p2p/12D3KooWBBrgH6r7mKyxMG1t8rk2iesqUPWKSmSmv2gcGLpevdVy"
    ports:
      - "9094:9094"
      - '9095:9095'
      - '9096:9096'
#      - '9097:9097'
    volumes:
      - ./compose/cluster:/data/ipfs-cluster
      - /etc/hosts:/etc/hosts
    command: --loglevel debug daemon
```

2. 启动ipfs服务

```shell
docker-compose up -d ipfs
```

3. 进入容器执行ipfs配置

```shell
docker exec -it ipfs ash
```

4. 停止容器

```shell
docker-compose down ipfs
```

5. 重新启动ipfs服务

```shell
docker-compose up -d ipfs
```

6. 生成ipfs-cluster的secret

```shell
bash swarmkey.sh ${PWD}
cat swarm.key
```

7. 加入compose文件中响应位置

```text
service.cluster.environment.CLUSTER_SECRET: ${CLUSTER_SECRET} # From shell variable if set
```

8. 启动ipfs-cluster服务

```shell
docker-compose up -d cluster
```

9. 其他机器启动

```yaml
version: '3.9'

networks:
  ipfs:
    name: "ipfs_cluster"
    ipam:
      config:
        - subnet: 172.27.138.0/24
services:
  ipfs:
    image: ipfs/go-ipfs:release
    restart: always
    container_name: ipfs
    hostname: ipfs_node
    ports:
      - "4001:4001"
      - "5001:5001"
      - "8080:8080"
    volumes:
      - ./compose/ipfs:/data/ipfs
      - /etc/hosts:/etc/hosts
    networks:
      ipfs:
        ipv4_address: 172.27.138.27

  cluster:
    restart: always
    image: ipfs/ipfs-cluster:stable
    container_name: cluster
    depends_on:
      - ipfs
    networks:
      ipfs:
        ipv4_address: 172.27.138.26
    environment:
      CLUSTER_PEERNAME: cluster1
      CLUSTER_SECRET: ${第一台机器的SECRET} # From shell variable if set
      CLUSTER_IPFSHTTP_NODEMULTIADDRESS: /dns4/ipfs/tcp/5001
      CLUSTER_CRDT_TRUSTEDPEERS: '*' # Trust all peers in Cluster
      CLUSTER_RESTAPI_HTTPLISTENMULTIADDRESS: /ip4/0.0.0.0/tcp/9094 # Expose API
      CLUSTER_MONITORPINGINTERVAL: 2s # Speed up peer discovery
#      CLUSTER_PEERADDRESSES: "/ip4/172.25.138.45/tcp/9096/p2p/12D3KooWBBrgH6r7mKyxMG1t8rk2iesqUPWKSmSmv2gcGLpevdVy"
    ports:
      - "9094:9094"
      - '9095:9095'
      - '9096:9096'
#      - '9097:9097'
    volumes:
      - ./compose/cluster:/data/ipfs-cluster
      - /etc/hosts:/etc/hosts
    command: --loglevel debug daemon -j /ip4/172.25.138.45/tcp/9096/p2p/12D3KooWBBrgH6r7mKyxMG1t8rk2iesqUPWKSmSmv2gcGLpevdVy
```


## 调用ipfs-cluster

```go
package ipfscluster

import (
	"context"
	"fmt"
	"io"
	"os"
	"time"
	
	"github.com/ipfs-cluster/ipfs-cluster/api"
	cluster "github.com/ipfs-cluster/ipfs-cluster/api/rest/client"
	ma "github.com/multiformats/go-multiaddr"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var log *zap.Logger

func init() {
	cfg := zap.NewDevelopmentConfig()
	cfg.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	cfg.EncoderConfig.EncodeTime = func(time time.Time, encoder zapcore.PrimitiveArrayEncoder) {
		encoder.AppendString(time.Format("2006-01-02 15:04:05.000"))
	}
	cfg.Development = true
	logger, err := cfg.Build()
	if err != nil {
		fmt.Println("Failed to initialize logger:", err)
	}
	defer func(logger *zap.Logger) {
		err := logger.Sync()
		if err != nil {
		
		}
	}(logger)
	log = logger.Named("cluster")
}

type IpfsCluster struct {
	client cluster.Client
}

type Config struct {
	APIAddr  string
	Username string
	Password string
}

func (ic *IpfsCluster) GetClient() cluster.Client {
	return ic.client
}
func (ic *IpfsCluster) ID() (api.ID, error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	id, err := ic.GetClient().ID(ctx)
	return id, err
}

func (ic *IpfsCluster) Download(cid, path string) error {
	log.Debug("starting downloading...")
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	_, err := os.Create(path)
	if err != nil {
		log.Error("Failed to create file", zap.Error(err))
		return err
	}
	err = os.Chmod(path, 0777)
	if err != nil {
		log.Error("Failed to change file permission", zap.Error(err))
		return err
	}
	
	ipfs := ic.GetClient().IPFS(ctx)
	err = ipfs.Get(cid, path)
	if err != nil {
		log.Error("Failed to download file", zap.Error(err))
		return err
	}
	return nil
	
}

func NewIpfsClusterClient(cfg *Config) (cc *IpfsCluster) {
	log.Debug("starting...")
	if len(cfg.APIAddr) == 0 {
		log.Info("IPFS Cluster API address not provided, using default address")
		cfg.APIAddr = "/ip4/127.0.0.1/udp/9094/quic"
		
	}
	apiAddr, err := ma.NewMultiaddr(cfg.APIAddr)
	if err != nil {
		log.Error("Failed to parse IPFS Cluster API address", zap.Error(err))
		return nil
	}
	config := &cluster.Config{
		APIAddr:  apiAddr,
		Username: cfg.Username,
		Password: cfg.Password,
	}
	client, err := cluster.NewDefaultClient(config)
	if err != nil {
		log.Error("Failed to create IPFS Cluster client", zap.Error(err))
		return nil
	}
	cc = &IpfsCluster{
		client: client,
	}
	return cc
}

```

```go
package main

import (
	"fmt"
	"time"
	
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	ic "xjipc.cas.cn/fs-go/ipfscluster"
)

var log *zap.Logger

func init() {
	cfg := zap.NewDevelopmentConfig()
	cfg.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	cfg.EncoderConfig.EncodeTime = func(time time.Time, encoder zapcore.PrimitiveArrayEncoder) {
		encoder.AppendString(time.Format("2006-01-02 15:04:05.000"))
	}
	logger, err := cfg.Build()
	if err != nil {
		fmt.Println("Failed to initialize logger:", err)
	}
	defer func(logger *zap.Logger) {
		err := logger.Sync()
		if err != nil {
		
		}
	}(logger)
	log = logger.Named("main")
}

func main() {
	
	log.Info("testing")
	client := ic.NewIpfsClusterClient(&ic.Config{
		APIAddr:  "/ip4/127.0.0.1/udp/9094/quic",
		Username: "",
		Password: "",
	})
	if client == nil {
		log.Info("get client error")
	}
	
	log.Info("connecting to cluster")
	
	id, err := client.ID()
	if err != nil {
		log.Error("get id error", zap.Error(err))
	}
	fmt.Println(id)
	
	err = client.Download("QmQGiYLVAdSHJQKYFRTJZMG4BXBHqKperaZtyKGmCRLmsF",
		"/root/go/src/xjipc.cas.cn/fs-go/testdata/usedemo.txt")
	if err != nil {
		log.Error("download error", zap.Error(err))
		return
	}
	
}
```

[comment]: <> (https://docs.ipfs.tech/install/server-infrastructure/#features)

[comment]: <> (https://blog.csdn.net/npu_nazi/article/details/131935407)