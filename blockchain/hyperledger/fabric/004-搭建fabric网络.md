<a id = "top"></a>

# 手动搭建fabric网络

----

## 目录

## fabric 2.4.3环境搭建过程

### 目录结构

```text
fabric2.4.3-demo
├── channel-artifacts
│   └── mychannel.block
├── compose
│   └── docker-compose.yaml
├── configtx
│   └── configtx.yaml
├── organizations
│   ├── crypto
│   │   └── crypto-config.yaml
│   ├── ordererOrganizations
│   │   └── jianlu.com
│   │       ├── ca
│   │       │   ├── ca.jianlu.com-cert.pem
│   │       │   ├── fabric-ca-server-config.yaml
│   │       │   ├── fabric-ca-server.db
│   │       │   ├── IssuerPublicKey
│   │       │   ├── IssuerRevocationPublicKey
│   │       │   ├── msp
│   │       │   │   └── keystore
│   │       │   │       ├── 9771c352accb9e88982f00b7fc57a2781d4d21fd7d335fa357afcf03796047ba_sk
│   │       │   │       ├── IssuerRevocationPrivateKey
│   │       │   │       └── IssuerSecretKey
│   │       │   └── priv_sk
│   │       ├── msp
│   │       │   ├── admincerts
│   │       │   ├── cacerts
│   │       │   │   └── ca.jianlu.com-cert.pem
│   │       │   ├── config.yaml
│   │       │   └── tlscacerts
│   │       │       └── tlsca.jianlu.com-cert.pem
│   │       ├── orderers
│   │       │   └── orderer.jianlu.com
│   │       │       ├── msp
│   │       │       │   ├── admincerts
│   │       │       │   ├── cacerts
│   │       │       │   │   └── ca.jianlu.com-cert.pem
│   │       │       │   ├── config.yaml
│   │       │       │   ├── keystore
│   │       │       │   │   └── priv_sk
│   │       │       │   ├── signcerts
│   │       │       │   │   └── orderer.jianlu.com-cert.pem
│   │       │       │   └── tlscacerts
│   │       │       │       └── tlsca.jianlu.com-cert.pem
│   │       │       └── tls
│   │       │           ├── ca.crt
│   │       │           ├── server.crt
│   │       │           └── server.key
│   │       ├── tlsca
│   │       │   ├── priv_sk
│   │       │   └── tlsca.jianlu.com-cert.pem
│   │       └── users
│   │           └── Admin@jianlu.com
│   │               ├── msp
│   │               │   ├── admincerts
│   │               │   ├── cacerts
│   │               │   │   └── ca.jianlu.com-cert.pem
│   │               │   ├── config.yaml
│   │               │   ├── keystore
│   │               │   │   └── priv_sk
│   │               │   ├── signcerts
│   │               │   │   └── Admin@jianlu.com-cert.pem
│   │               │   └── tlscacerts
│   │               │       └── tlsca.jianlu.com-cert.pem
│   │               └── tls
│   │                   ├── ca.crt
│   │                   ├── client.crt
│   │                   └── client.key
│   └── peerOrganizations
│       ├── org1.jianlu.com
│       │   ├── ca
│       │   │   ├── ca.org1.jianlu.com-cert.pem
│       │   │   ├── fabric-ca-server-config.yaml
│       │   │   ├── fabric-ca-server.db
│       │   │   ├── IssuerPublicKey
│       │   │   ├── IssuerRevocationPublicKey
│       │   │   ├── msp
│       │   │   │   └── keystore
│       │   │   │       ├── 0c127b155cb7ed1c1c170e78dc9e6a44784c60efe3311adb33465dc5e6e79632_sk
│       │   │   │       ├── IssuerRevocationPrivateKey
│       │   │   │       └── IssuerSecretKey
│       │   │   └── priv_sk
│       │   ├── msp
│       │   │   ├── admincerts
│       │   │   ├── cacerts
│       │   │   │   └── ca.org1.jianlu.com-cert.pem
│       │   │   ├── config.yaml
│       │   │   └── tlscacerts
│       │   │       └── tlsca.org1.jianlu.com-cert.pem
│       │   ├── peers
│       │   │   └── peer0.org1.jianlu.com
│       │   │       ├── msp
│       │   │       │   ├── admincerts
│       │   │       │   ├── cacerts
│       │   │       │   │   └── ca.org1.jianlu.com-cert.pem
│       │   │       │   ├── config.yaml
│       │   │       │   ├── keystore
│       │   │       │   │   └── priv_sk
│       │   │       │   ├── signcerts
│       │   │       │   │   └── peer0.org1.jianlu.com-cert.pem
│       │   │       │   └── tlscacerts
│       │   │       │       └── tlsca.org1.jianlu.com-cert.pem
│       │   │       └── tls
│       │   │           ├── ca.crt
│       │   │           ├── server.crt
│       │   │           └── server.key
│       │   ├── tlsca
│       │   │   ├── priv_sk
│       │   │   └── tlsca.org1.jianlu.com-cert.pem
│       │   └── users
│       │       ├── Admin@org1.jianlu.com
│       │       │   ├── msp
│       │       │   │   ├── admincerts
│       │       │   │   ├── cacerts
│       │       │   │   │   └── ca.org1.jianlu.com-cert.pem
│       │       │   │   ├── config.yaml
│       │       │   │   ├── keystore
│       │       │   │   │   └── priv_sk
│       │       │   │   ├── signcerts
│       │       │   │   │   └── Admin@org1.jianlu.com-cert.pem
│       │       │   │   └── tlscacerts
│       │       │   │       └── tlsca.org1.jianlu.com-cert.pem
│       │       │   └── tls
│       │       │       ├── ca.crt
│       │       │       ├── client.crt
│       │       │       └── client.key
│       │       └── User1@org1.jianlu.com
│       │           ├── msp
│       │           │   ├── admincerts
│       │           │   ├── cacerts
│       │           │   │   └── ca.org1.jianlu.com-cert.pem
│       │           │   ├── config.yaml
│       │           │   ├── keystore
│       │           │   │   └── priv_sk
│       │           │   ├── signcerts
│       │           │   │   └── User1@org1.jianlu.com-cert.pem
│       │           │   └── tlscacerts
│       │           │       └── tlsca.org1.jianlu.com-cert.pem
│       │           └── tls
│       │               ├── ca.crt
│       │               ├── client.crt
│       │               └── client.key
│       └── org2.jianlu.com
│           ├── ca
│           │   ├── ca.org2.jianlu.com-cert.pem
│           │   ├── fabric-ca-server-config.yaml
│           │   ├── fabric-ca-server.db
│           │   ├── IssuerPublicKey
│           │   ├── IssuerRevocationPublicKey
│           │   ├── msp
│           │   │   └── keystore
│           │   │       ├── 8ceb540b8d60d0105e49cee106f60588134c794ff5dc769bf42df834c384c7e0_sk
│           │   │       ├── IssuerRevocationPrivateKey
│           │   │       └── IssuerSecretKey
│           │   └── priv_sk
│           ├── msp
│           │   ├── admincerts
│           │   ├── cacerts
│           │   │   └── ca.org2.jianlu.com-cert.pem
│           │   ├── config.yaml
│           │   └── tlscacerts
│           │       └── tlsca.org2.jianlu.com-cert.pem
│           ├── peers
│           │   └── peer0.org2.jianlu.com
│           │       ├── msp
│           │       │   ├── admincerts
│           │       │   ├── cacerts
│           │       │   │   └── ca.org2.jianlu.com-cert.pem
│           │       │   ├── config.yaml
│           │       │   ├── keystore
│           │       │   │   └── priv_sk
│           │       │   ├── signcerts
│           │       │   │   └── peer0.org2.jianlu.com-cert.pem
│           │       │   └── tlscacerts
│           │       │       └── tlsca.org2.jianlu.com-cert.pem
│           │       └── tls
│           │           ├── ca.crt
│           │           ├── server.crt
│           │           └── server.key
│           ├── tlsca
│           │   ├── priv_sk
│           │   └── tlsca.org2.jianlu.com-cert.pem
│           └── users
│               ├── Admin@org2.jianlu.com
│               │   ├── msp
│               │   │   ├── admincerts
│               │   │   ├── cacerts
│               │   │   │   └── ca.org2.jianlu.com-cert.pem
│               │   │   ├── config.yaml
│               │   │   ├── keystore
│               │   │   │   └── priv_sk
│               │   │   ├── signcerts
│               │   │   │   └── Admin@org2.jianlu.com-cert.pem
│               │   │   └── tlscacerts
│               │   │       └── tlsca.org2.jianlu.com-cert.pem
│               │   └── tls
│               │       ├── ca.crt
│               │       ├── client.crt
│               │       └── client.key
│               └── User1@org2.jianlu.com
│                   ├── msp
│                   │   ├── admincerts
│                   │   ├── cacerts
│                   │   │   └── ca.org2.jianlu.com-cert.pem
│                   │   ├── config.yaml
│                   │   ├── keystore
│                   │   │   └── priv_sk
│                   │   ├── signcerts
│                   │   │   └── User1@org2.jianlu.com-cert.pem
│                   │   └── tlscacerts
│                   │       └── tlsca.org2.jianlu.com-cert.pem
│                   └── tls
│                       ├── ca.crt
│                       ├── client.crt
│                       └── client.key
├── peercfg
│   └── core.yaml
└── scripts
```

### 步骤

```shell
# 创建文件夹
mkdir ~/myfabric/demo
cd ~/myfabric/demo

# 创建模板文件
cryptogen showtemplate > ./organizations/crypto/crypto-config.yaml
```

crypto-config.yaml

```yaml
---
OrdererOrgs:
  - Name: Orderer
    Domain: jianlu.com
    EnableNodeOUs: true
    Specs:
      - Hostname: orderer
PeerOrgs:
  - Name: Org1
  Domain: org1.jianlu.com
  EnableNodeOUs: true
  Template:
  Count: 1
  Users:
  Count: 1
           - Name: Org2
  Domain: org2.jianlu.com
  EnableNodeOUs: true
  Template:
  Count: 1
  Users:
  Count: 1
```

```shell
# 生成对应文件夹
cryptogen generate --config ./organizations/crypto/crypto-config.yaml --output ./organizations

# 编写容器编排文件
mkdir compose
touch compose/docker-compose.yaml
```

docker-compose.yaml

```yaml
version: "3.7"
networks:
  fabric:
    name: fabric_demo
volumes:
  orderer.jianlu.com:
  peer0.org1.jianlu.com:
  peer0.org2.jianlu.com:
services:
  orderer.jianlu.com:
    image: hyperledger/fabric-orderer:2.4.3
    networks:
      - fabric
    labels:
      service: hyperledger-fabric
    container_name: orderer.jianlu.com
    environment:
      - FABRIC_LOGGING_SPEC=INFO
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_LISTENPORT=7050
      - ORDERER_GENERAL_LOCALMSPID=OrdererMSP
      - ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp
      # enabled TLS
      - ORDERER_GENERAL_TLS_ENABLED=true
      - ORDERER_GENERAL_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key
      - ORDERER_GENERAL_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt
      - ORDERER_GENERAL_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
      - ORDERER_GENERAL_CLUSTER_CLIENTCERTIFICATE=/var/hyperledger/orderer/tls/server.crt
      - ORDERER_GENERAL_CLUSTER_CLIENTPRIVATEKEY=/var/hyperledger/orderer/tls/server.key
      - ORDERER_GENERAL_CLUSTER_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
      - ORDERER_GENERAL_BOOTSTRAPMETHOD=none
      - ORDERER_CHANNELPARTICIPATION_ENABLED=true
      - ORDERER_ADMIN_TLS_ENABLED=true
      - ORDERER_ADMIN_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt
      - ORDERER_ADMIN_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key
      - ORDERER_ADMIN_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
      - ORDERER_ADMIN_TLS_CLIENTROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
      - ORDERER_ADMIN_LISTENADDRESS=0.0.0.0:7053
      - ORDERER_OPERATIONS_LISTENADDRESS=orderer.jianlu.com:9443
      - ORDERER_METRICS_PROVIDER=prometheus
    working_dir: /root
    command:
      - orderer
    ports:
      - 7050:7050
      - 7053:7053
      - 9443:9443
    volumes:
      - /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime:ro
      - /var/run/docker.sock:/host/var/run/docker.sock
      # msp tls
      - ../organizations/ordererOrganizations/jianlu.com/orderers/orderer.jianlu.com/msp:/var/hyperledger/orderer/msp
      - ../organizations/ordererOrganizations/jianlu.com/orderers/orderer.jianlu.com/tls:/var/hyperledger/orderer/tls
        - orderer.jianlu.com:/var/hyperledger/production/orderer
        # core.yaml
        - ../peercfg:/etc/hyperledger/peercfg
  peer0.org1.jianlu.com:
    image: hyperledger/fabric-peer:2.4.3
    networks:
      - fabric
    container_name: peer0.org1.jianlu.com
    labels:
      service: hyperledger-fabric
    environment:
      - FABRIC_CFG_PATH=/etc/hyperledger/peercfg
      - FABRIC_LOGGING_SPEC=INFO
      #- FABRIC_LOGGING_SPEC=DEBUG
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_PROFILE_ENABLED=false
      - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
      # Peer specific variables
      - CORE_PEER_ID=peer0.org1.jianlu.com
      - CORE_PEER_ADDRESS=peer0.org1.jianlu.com:7051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:7051
      - CORE_PEER_CHAINCODEADDRESS=peer0.org1.jianlu.com:7052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:7052
      - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org1.jianlu.com:7051
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org1.jianlu.com:7051
      - CORE_PEER_LOCALMSPID=Org1MSP
      - CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/msp
      - CORE_OPERATIONS_LISTENADDRESS=peer0.org1.jianlu.com:9443
      - CORE_METRICS_PROVIDER=prometheus
      - CHAINCODE_AS_A_SERVICE_BUILDER_CONFIG={"peername":"peer0org1"}
      - CORE_CHAINCODE_EXECUTETIMEOUT=300s
      # docker
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=fabric_demo
      # couchdb
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb0:5984
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=admin
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=adminpw
    working_dir: /root
    command: peer node start
    ports:
      - 7051:7051
      - 9444:9443
    volumes:
      - /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime:ro
      - /var/run/docker.sock:/host/var/run/docker.sock
      - ../organizations/peerOrganizations/org1.jianlu.com/peers/peer0.org1.jianlu.com:/etc/hyperledger/fabric
      - peer0.org1.jianlu.com:/var/hyperledger/production
      - ../peercfg:/etc/hyperledger/peercfg
    depends_on:
      - couchdb0
  peer0.org2.jianlu.com:
    image: hyperledger/fabric-peer:2.4.3
    networks:
      - fabric
    container_name: peer0.org2.jianlu.com
    labels:
      service: hyperledger-fabric
    environment:
      - FABRIC_CFG_PATH=/etc/hyperledger/peercfg
      - FABRIC_LOGGING_SPEC=INFO
      #- FABRIC_LOGGING_SPEC=DEBUG
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_PROFILE_ENABLED=false
      - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
      # Peer specific variables
      - CORE_PEER_ID=peer0.org2.jianlu.com
      - CORE_PEER_ADDRESS=peer0.org2.jianlu.com:9051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:9051
      - CORE_PEER_CHAINCODEADDRESS=peer0.org2.jianlu.com:9052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:9052
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org2.jianlu.com:9051
      - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org2.jianlu.com:9051
      # mspId
      - CORE_PEER_LOCALMSPID=Org2MSP
      - CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/msp
      - CORE_OPERATIONS_LISTENADDRESS=peer0.org2.jianlu.com:9443
      - CORE_METRICS_PROVIDER=prometheus
      - CHAINCODE_AS_A_SERVICE_BUILDER_CONFIG={"peername":"peer0org2"}
      - CORE_CHAINCODE_EXECUTETIMEOUT=300s
      # docker
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=fabric_demo
      # couchdb
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb1:5984
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=admin
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=adminpw
    working_dir: /root
    command: peer node start
    ports:
      - 9051:9051
      - 9445:9443
    volumes:
      - /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime:ro
      - /var/run/docker.sock:/host/var/run/docker.sock
      - ../organizations/peerOrganizations/org2.jianlu.com/peers/peer0.org2.jianlu.com:/etc/hyperledger/fabric
      - peer0.org2.jianlu.com:/var/hyperledger/production
      - ../peercfg:/etc/hyperledger/peercfg
    depends_on:
      - couchdb1
  ca.orderer.jianlu.com:
    image: hyperledger/fabric-ca:1.5.2
    labels:
      service: hyperledger-fabric
    networks:
      - fabric
    container_name: ca.orderer.jianlu.com
    environment:
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca-orderer
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_SERVER_PORT=9054
      - FABRIC_CA_SERVER_OPERATIONS_LISTENADDRESS=0.0.0.0:19054
      - FABRIC_CA_SERVER_CA_CERTFILE=ca.jianlu.com-cert.pem
      - FABRIC_CA_SERVER_CA_KEYFILE=priv_sk
      - FABRIC_CA_SERVER_TLS_CERTFILE=ca.jianlu.com-cert.pem
      - FABRIC_CA_SERVER_TLS_KEYFILE=priv_sk
    working_dir: /etc/hyperledger/fabric-ca-server
    command: sh -c 'fabric-ca-server start -b admin:adminpw -d'
    ports:
      - "9054:9054"
      - "19054:19054"
    volumes:
      - /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime:ro
      - ../organizations/ordererOrganizations/jianlu.com/ca:/etc/hyperledger/fabric-ca-server
  ca.org1.jianlu.com:
    image: hyperledger/fabric-ca:1.5.2
    networks:
      - fabric
    container_name: ca.org1.jianlu.com
    environment:
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca-orderer
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_SERVER_PORT=7054
      - FABRIC_CA_SERVER_OPERATIONS_LISTENADDRESS=0.0.0.0:17054
      - FABRIC_CA_SERVER_CA_CERTFILE=ca.org1.jianlu.com-cert.pem
      - FABRIC_CA_SERVER_CA_KEYFILE=priv_sk
      - FABRIC_CA_SERVER_TLS_CERTFILE=ca.org1.jianlu.com-cert.pem
      - FABRIC_CA_SERVER_TLS_KEYFILE=priv_sk
    working_dir: /etc/hyperledger/fabric-ca-server
    command: sh -c 'fabric-ca-server start -b admin:adminpw -d'
    ports:
      - "7054:7054"
      - "17054:17054"
    volumes:
      - /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime:ro
      - ../organizations/peerOrganizations/org1.jianlu.com/ca:/etc/hyperledger/fabric-ca-server
  ca.org2.jianlu.com:
    image: hyperledger/fabric-ca:1.5.2
    networks:
      - fabric
    container_name: ca.org2.jianlu.com
    environment:
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca-org2
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_SERVER_PORT=8054
      - FABRIC_CA_SERVER_OPERATIONS_LISTENADDRESS=0.0.0.0:18054
      - FABRIC_CA_SERVER_CA_CERTFILE=ca.org2.jianlu.com-cert.pem
      - FABRIC_CA_SERVER_CA_KEYFILE=priv_sk
      - FABRIC_CA_SERVER_TLS_CERTFILE=ca.org2.jianlu.com-cert.pem
      - FABRIC_CA_SERVER_TLS_KEYFILE=priv_sk
    working_dir: /etc/hyperledger/fabric-ca-server
    command: sh -c 'fabric-ca-server start -b admin:adminpw -d'
    ports:
      - "8054:8054"
      - "18054:18054"
    volumes:
      - /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime:ro
      - ../organizations/peerOrganizations/org2.jianlu.com/ca:/etc/hyperledger/fabric-ca-server
  cli:
    container_name: cli
    image: hyperledger/fabric-tools:2.4.3
    labels:
      service: hyperledger-fabric
    tty: true
    stdin_open: true
    environment:
      - GOPATH=/opt/gopath
      - FABRIC_LOGGING_SPEC=INFO
      - FABRIC_CFG_PATH=/etc/hyperledger/peercfg
      #- FABRIC_LOGGING_SPEC=DEBUG
    working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
    command: /bin/bash
    volumes:
      - ../organizations:/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations
      - ../scripts:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/
      - ../peercfg:/etc/hyperledger/peercfg
      - ../channel-artifacts:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts
    depends_on:
      - peer0.org1.jianlu.com
      - peer0.org2.jianlu.com
    networks:
      - fabric
  couchdb0:
    container_name: couchdb0
    image: couchdb:3.1.1
    labels:
      service: hyperledger-fabric
    # Populate the COUCHDB_USER and COUCHDB_PASSWORD to set an admin user and password
    # for CouchDB.  This will prevent CouchDB from operating in an "Admin Party" mode.
    environment:
      - COUCHDB_USER=admin
      - COUCHDB_PASSWORD=adminpw
    # Comment/Uncomment the port mapping if you want to hide/expose the CouchDB service,
    # for example map it to utilize Fauxton User Interface in dev environments.
    ports:
      - "5984:5984"
    networks:
      - fabric
  couchdb1:
    container_name: couchdb1
    image: couchdb:3.1.1
    labels:
      service: hyperledger-fabric
    # Populate the COUCHDB_USER and COUCHDB_PASSWORD to set an admin user and password
    # for CouchDB.  This will prevent CouchDB from operating in an "Admin Party" mode.
    environment:
      - COUCHDB_USER=admin
      - COUCHDB_PASSWORD=adminpw
    # Comment/Uncomment the port mapping if you want to hide/expose the CouchDB service,
    # for example map it to utilize Fauxton User Interface in dev environments.
    ports:
      - "7984:5984"
    networks:
      - fabric
```

```shell
# 创建core.yaml
mkdir peercfg
touch peercfg/core.yaml
```

core.yaml

```yaml
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

###############################################################################
#
#    Peer section
#
###############################################################################
peer:

    # The peer id provides a name for this peer instance and is used when
    # naming docker resources.
    id: jdoe

    # The networkId allows for logical separation of networks and is used when
    # naming docker resources.
    networkId: dev

    # The Address at local network interface this Peer will listen on.
    # By default, it will listen on all network interfaces
    listenAddress: 0.0.0.0:7051

    # The endpoint this peer uses to listen for inbound chaincode connections.
    # If this is commented-out, the listen address is selected to be
    # the peer's address (see below) with port 7052
    # chaincodeListenAddress: 0.0.0.0:7052

    # The endpoint the chaincode for this peer uses to connect to the peer.
    # If this is not specified, the chaincodeListenAddress address is selected.
    # And if chaincodeListenAddress is not specified, address is selected from
    # peer address (see below). If specified peer address is invalid then it
    # will fallback to the auto detected IP (local IP) regardless of the peer
    # addressAutoDetect value.
    # chaincodeAddress: 0.0.0.0:7052

    # When used as peer config, this represents the endpoint to other peers
    # in the same organization. For peers in other organization, see
    # gossip.externalEndpoint for more info.
    # When used as CLI config, this means the peer's endpoint to interact with
    address: 0.0.0.0:7051

    # Whether the Peer should programmatically determine its address
    # This case is useful for docker containers.
    # When set to true, will override peer address.
    addressAutoDetect: false

    # Settings for the Peer's gateway server.
    gateway:
        # Whether the gateway is enabled for this Peer.
        enabled: true
        # endorsementTimeout is the duration the gateway waits for a response
        # from other endorsing peers before returning a timeout error to the client.
        endorsementTimeout: 30s
        # dialTimeout is the duration the gateway waits for a connection
        # to other network nodes.
        dialTimeout: 2m


    # Keepalive settings for peer server and clients
    keepalive:
        # Interval is the duration after which if the server does not see
        # any activity from the client it pings the client to see if it's alive
        interval: 7200s
        # Timeout is the duration the server waits for a response
        # from the client after sending a ping before closing the connection
        timeout: 20s
        # MinInterval is the minimum permitted time between client pings.
        # If clients send pings more frequently, the peer server will
        # disconnect them
        minInterval: 60s
        # Client keepalive settings for communicating with other peer nodes
        client:
            # Interval is the time between pings to peer nodes.  This must
            # greater than or equal to the minInterval specified by peer
            # nodes
            interval: 60s
            # Timeout is the duration the client waits for a response from
            # peer nodes before closing the connection
            timeout: 20s
        # DeliveryClient keepalive settings for communication with ordering
        # nodes.
        deliveryClient:
            # Interval is the time between pings to ordering nodes.  This must
            # greater than or equal to the minInterval specified by ordering
            # nodes.
            interval: 60s
            # Timeout is the duration the client waits for a response from
            # ordering nodes before closing the connection
            timeout: 20s


    # Gossip related configuration
    gossip:
        # Bootstrap set to initialize gossip with.
        # This is a list of other peers that this peer reaches out to at startup.
        # Important: The endpoints here have to be endpoints of peers in the same
        # organization, because the peer would refuse connecting to these endpoints
        # unless they are in the same organization as the peer.
        bootstrap: 127.0.0.1:7051

        # NOTE: orgLeader and useLeaderElection parameters are mutual exclusive.
        # Setting both to true would result in the termination of the peer
        # since this is undefined state. If the peers are configured with
        # useLeaderElection=false, make sure there is at least 1 peer in the
        # organization that its orgLeader is set to true.

        # Defines whenever peer will initialize dynamic algorithm for
        # "leader" selection, where leader is the peer to establish
        # connection with ordering service and use delivery protocol
        # to pull ledger blocks from ordering service.
        useLeaderElection: false
        # Statically defines peer to be an organization "leader",
        # where this means that current peer will maintain connection
        # with ordering service and disseminate block across peers in
        # its own organization. Multiple peers or all peers in an organization
        # may be configured as org leaders, so that they all pull
        # blocks directly from ordering service.
        orgLeader: true

        # Interval for membershipTracker polling
        membershipTrackerInterval: 5s

        # Overrides the endpoint that the peer publishes to peers
        # in its organization. For peers in foreign organizations
        # see 'externalEndpoint'
        endpoint:
        # Maximum count of blocks stored in memory
        maxBlockCountToStore: 10
        # Max time between consecutive message pushes(unit: millisecond)
        maxPropagationBurstLatency: 10ms
        # Max number of messages stored until a push is triggered to remote peers
        maxPropagationBurstSize: 10
        # Number of times a message is pushed to remote peers
        propagateIterations: 1
        # Number of peers selected to push messages to
        propagatePeerNum: 3
        # Determines frequency of pull phases(unit: second)
        # Must be greater than digestWaitTime + responseWaitTime
        pullInterval: 4s
        # Number of peers to pull from
        pullPeerNum: 3
        # Determines frequency of pulling state info messages from peers(unit: second)
        requestStateInfoInterval: 4s
        # Determines frequency of pushing state info messages to peers(unit: second)
        publishStateInfoInterval: 4s
        # Maximum time a stateInfo message is kept until expired
        stateInfoRetentionInterval:
        # Time from startup certificates are included in Alive messages(unit: second)
        publishCertPeriod: 10s
        # Should we skip verifying block messages or not (currently not in use)
        skipBlockVerification: false
        # Dial timeout(unit: second)
        dialTimeout: 3s
        # Connection timeout(unit: second)
        connTimeout: 2s
        # Buffer size of received messages
        recvBuffSize: 20
        # Buffer size of sending messages
        sendBuffSize: 200
        # Time to wait before pull engine processes incoming digests (unit: second)
        # Should be slightly smaller than requestWaitTime
        digestWaitTime: 1s
        # Time to wait before pull engine removes incoming nonce (unit: milliseconds)
        # Should be slightly bigger than digestWaitTime
        requestWaitTime: 1500ms
        # Time to wait before pull engine ends pull (unit: second)
        responseWaitTime: 2s
        # Alive check interval(unit: second)
        aliveTimeInterval: 5s
        # Alive expiration timeout(unit: second)
        aliveExpirationTimeout: 25s
        # Reconnect interval(unit: second)
        reconnectInterval: 25s
        # Max number of attempts to connect to a peer
        maxConnectionAttempts: 120
        # Message expiration factor for alive messages
        msgExpirationFactor: 20
        # This is an endpoint that is published to peers outside of the organization.
        # If this isn't set, the peer will not be known to other organizations.
        externalEndpoint:
        # Leader election service configuration
        election:
            # Longest time peer waits for stable membership during leader election startup (unit: second)
            startupGracePeriod: 15s
            # Interval gossip membership samples to check its stability (unit: second)
            membershipSampleInterval: 1s
            # Time passes since last declaration message before peer decides to perform leader election (unit: second)
            leaderAliveThreshold: 10s
            # Time between peer sends propose message and declares itself as a leader (sends declaration message) (unit: second)
            leaderElectionDuration: 5s

        pvtData:
            # pullRetryThreshold determines the maximum duration of time private data corresponding for a given block
            # would be attempted to be pulled from peers until the block would be committed without the private data
            pullRetryThreshold: 60s
            # As private data enters the transient store, it is associated with the peer's ledger's height at that time.
            # transientstoreMaxBlockRetention defines the maximum difference between the current ledger's height upon commit,
            # and the private data residing inside the transient store that is guaranteed not to be purged.
            # Private data is purged from the transient store when blocks with sequences that are multiples
            # of transientstoreMaxBlockRetention are committed.
            transientstoreMaxBlockRetention: 1000
            # pushAckTimeout is the maximum time to wait for an acknowledgement from each peer
            # at private data push at endorsement time.
            pushAckTimeout: 3s
            # Block to live pulling margin, used as a buffer
            # to prevent peer from trying to pull private data
            # from peers that is soon to be purged in next N blocks.
            # This helps a newly joined peer catch up to current
            # blockchain height quicker.
            btlPullMargin: 10
            # the process of reconciliation is done in an endless loop, while in each iteration reconciler tries to
            # pull from the other peers the most recent missing blocks with a maximum batch size limitation.
            # reconcileBatchSize determines the maximum batch size of missing private data that will be reconciled in a
            # single iteration.
            reconcileBatchSize: 10
            # reconcileSleepInterval determines the time reconciler sleeps from end of an iteration until the beginning
            # of the next reconciliation iteration.
            reconcileSleepInterval: 1m
            # reconciliationEnabled is a flag that indicates whether private data reconciliation is enable or not.
            reconciliationEnabled: true
            # skipPullingInvalidTransactionsDuringCommit is a flag that indicates whether pulling of invalid
            # transaction's private data from other peers need to be skipped during the commit time and pulled
            # only through reconciler.
            skipPullingInvalidTransactionsDuringCommit: false
            # implicitCollectionDisseminationPolicy specifies the dissemination  policy for the peer's own implicit collection.
            # When a peer endorses a proposal that writes to its own implicit collection, below values override the default values
            # for disseminating private data.
            # Note that it is applicable to all channels the peer has joined. The implication is that requiredPeerCount has to
            # be smaller than the number of peers in a channel that has the lowest numbers of peers from the organization.
            implicitCollectionDisseminationPolicy:
               # requiredPeerCount defines the minimum number of eligible peers to which the peer must successfully
               # disseminate private data for its own implicit collection during endorsement. Default value is 0.
               requiredPeerCount: 0
               # maxPeerCount defines the maximum number of eligible peers to which the peer will attempt to
               # disseminate private data for its own implicit collection during endorsement. Default value is 1.
               maxPeerCount: 1

        # Gossip state transfer related configuration
        state:
            # indicates whenever state transfer is enabled or not
            # default value is false, i.e. state transfer is active
            # and takes care to sync up missing blocks allowing
            # lagging peer to catch up to speed with rest network.
            # Keep in mind that when peer.gossip.useLeaderElection is true
            # and there are several peers in the organization,
            # or peer.gossip.useLeaderElection is false alongside with
            # peer.gossip.orgleader being false, the peer's ledger may lag behind
            # the rest of the peers and will never catch up due to state transfer
            # being disabled.
            enabled: false
            # checkInterval interval to check whether peer is lagging behind enough to
            # request blocks via state transfer from another peer.
            checkInterval: 10s
            # responseTimeout amount of time to wait for state transfer response from
            # other peers
            responseTimeout: 3s
            # batchSize the number of blocks to request via state transfer from another peer
            batchSize: 10
            # blockBufferSize reflects the size of the re-ordering buffer
            # which captures blocks and takes care to deliver them in order
            # down to the ledger layer. The actual buffer size is bounded between
            # 0 and 2*blockBufferSize, each channel maintains its own buffer
            blockBufferSize: 20
            # maxRetries maximum number of re-tries to ask
            # for single state transfer request
            maxRetries: 3

    # TLS Settings
    tls:
        # Require server-side TLS
        enabled:  false
        # Require client certificates / mutual TLS for inbound connections.
        # Note that clients that are not configured to use a certificate will
        # fail to connect to the peer.
        clientAuthRequired: false
        # X.509 certificate used for TLS server
        cert:
            file: tls/server.crt
        # Private key used for TLS server
        key:
            file: tls/server.key
        # rootcert.file represents the trusted root certificate chain used for verifying certificates
        # of other nodes during outbound connections.
        # It is not required to be set, but can be used to augment the set of TLS CA certificates
        # available from the MSPs of each channel’s configuration.
        rootcert:
            file: tls/ca.crt
        # If mutual TLS is enabled, clientRootCAs.files contains a list of additional root certificates
        # used for verifying certificates of client connections.
        # It augments the set of TLS CA certificates available from the MSPs of each channel’s configuration.
        # Minimally, set your organization's TLS CA root certificate so that the peer can receive join channel requests.
        clientRootCAs:
            files:
              - tls/ca.crt
        # Private key used for TLS when making client connections.
        # If not set, peer.tls.key.file will be used instead
        clientKey:
            file:
        # X.509 certificate used for TLS when making client connections.
        # If not set, peer.tls.cert.file will be used instead
        clientCert:
            file:

    # Authentication contains configuration parameters related to authenticating
    # client messages
    authentication:
        # the acceptable difference between the current server time and the
        # client's time as specified in a client request message
        timewindow: 15m

    # Path on the file system where peer will store data (eg ledger). This
    # location must be access control protected to prevent unintended
    # modification that might corrupt the peer operations.
    fileSystemPath: /var/hyperledger/production

    # BCCSP (Blockchain crypto provider): Select which crypto implementation or
    # library to use
    BCCSP:
        Default: SW
        # Settings for the SW crypto provider (i.e. when DEFAULT: SW)
        SW:
            # TODO: The default Hash and Security level needs refactoring to be
            # fully configurable. Changing these defaults requires coordination
            # SHA2 is hardcoded in several places, not only BCCSP
            Hash: SHA2
            Security: 256
            # Location of Key Store
            FileKeyStore:
                # If "", defaults to 'mspConfigPath'/keystore
                KeyStore:
        # Settings for the PKCS#11 crypto provider (i.e. when DEFAULT: PKCS11)
        PKCS11:
            # Location of the PKCS11 module library
            Library:
            # Token Label
            Label:
            # User PIN
            Pin:
            Hash:
            Security:

    # Path on the file system where peer will find MSP local configurations
    mspConfigPath: msp
    # Identifier of the local MSP
    # ----!!!!IMPORTANT!!!-!!!IMPORTANT!!!-!!!IMPORTANT!!!!----
    # Deployers need to change the value of the localMspId string.
    # In particular, the name of the local MSP ID of a peer needs
    # to match the name of one of the MSPs in each of the channel
    # that this peer is a member of. Otherwise this peer's messages
    # will not be identified as valid by other nodes.
    localMspId: SampleOrg

    # CLI common client config options
    client:
        # connection timeout
        connTimeout: 3s

    # Delivery service related config
    deliveryclient:
        # Enables this peer to disseminate blocks it pulled from the ordering service
        # via gossip.
        # Note that 'gossip.state.enabled' controls point to point block replication
        # of blocks committed in the past.
        blockGossipEnabled: true
        # It sets the total time the delivery service may spend in reconnection
        # attempts until its retry logic gives up and returns an error
        reconnectTotalTimeThreshold: 3600s

        # It sets the delivery service <-> ordering service node connection timeout
        connTimeout: 3s

        # It sets the delivery service maximal delay between consecutive retries
        reConnectBackoffThreshold: 3600s

        # A list of orderer endpoint addresses which should be overridden
        # when found in channel configurations.
        addressOverrides:
        #  - from:
        #    to:
        #    caCertsFile:
        #  - from:
        #    to:
        #    caCertsFile:

    # Type for the local MSP - by default it's of type bccsp
    localMspType: bccsp

    # Used with Go profiling other only in none production environment. In
    # production, it should be disabled (eg enabled: false)
    profile:
        enabled:     false
        listenAddress: 0.0.0.0:6060

    # Handlers defines custom handlers that can filter and mutate
    # objects passing within the peer, such as:
    #   Auth filter - reject or forward proposals from clients
    #   Decorators  - append or mutate the chaincode input passed to the chaincode
    #   Endorsers   - Custom signing over proposal response payload and its mutation
    # Valid handler definition contains:
    #   - A name which is a factory method name defined in
    #     core/handlers/library/library.go for statically compiled handlers
    #   - library path to shared object binary for pluggable filters
    # Auth filters and decorators are chained and executed in the order that
    # they are defined. For example:
    # authFilters:
    #   -
    #     name: FilterOne
    #     library: /opt/lib/filter.so
    #   -
    #     name: FilterTwo
    # decorators:
    #   -
    #     name: DecoratorOne
    #   -
    #     name: DecoratorTwo
    #     library: /opt/lib/decorator.so
    # Endorsers are configured as a map that its keys are the endorsement system chaincodes that are being overridden.
    # Below is an example that overrides the default ESCC and uses an endorsement plugin that has the same functionality
    # as the default ESCC.
    # If the 'library' property is missing, the name is used as the constructor method in the builtin library similar
    # to auth filters and decorators.
    # endorsers:
    #   escc:
    #     name: DefaultESCC
    #     library: /etc/hyperledger/fabric/plugin/escc.so
    handlers:
        authFilters:
          -
            name: DefaultAuth
          -
            name: ExpirationCheck    # This filter checks identity x509 certificate expiration
        decorators:
          -
            name: DefaultDecorator
        endorsers:
          escc:
            name: DefaultEndorsement
            library:
        validators:
          vscc:
            name: DefaultValidation
            library:

    #    library: /etc/hyperledger/fabric/plugin/escc.so
    # Number of goroutines that will execute transaction validation in parallel.
    # By default, the peer chooses the number of CPUs on the machine. Set this
    # variable to override that choice.
    # NOTE: overriding this value might negatively influence the performance of
    # the peer so please change this value only if you know what you're doing
    validatorPoolSize:

    # The discovery service is used by clients to query information about peers,
    # such as - which peers have joined a certain channel, what is the latest
    # channel config, and most importantly - given a chaincode and a channel,
    # what possible sets of peers satisfy the endorsement policy.
    discovery:
        enabled: true
        # Whether the authentication cache is enabled or not.
        authCacheEnabled: true
        # The maximum size of the cache, after which a purge takes place
        authCacheMaxSize: 1000
        # The proportion (0 to 1) of entries that remain in the cache after the cache is purged due to overpopulation
        authCachePurgeRetentionRatio: 0.75
        # Whether to allow non-admins to perform non channel scoped queries.
        # When this is false, it means that only peer admins can perform non channel scoped queries.
        orgMembersAllowedAccess: false

    # Limits is used to configure some internal resource limits.
    limits:
        # Concurrency limits the number of concurrently running requests to a service on each peer.
        # Currently this option is only applied to endorser service and deliver service.
        # When the property is missing or the value is 0, the concurrency limit is disabled for the service.
        concurrency:
            # endorserService limits concurrent requests to endorser service that handles chaincode deployment, query and invocation,
            # including both user chaincodes and system chaincodes.
            endorserService: 2500
            # deliverService limits concurrent event listeners registered to deliver service for blocks and transaction events.
            deliverService: 2500

    # Since all nodes should be consistent it is recommended to keep
    # the default value of 100MB for MaxRecvMsgSize & MaxSendMsgSize
    # Max message size in bytes GRPC server and client can receive
    maxRecvMsgSize: 104857600
    # Max message size in bytes GRPC server and client can send
    maxSendMsgSize: 104857600

###############################################################################
#
#    VM section
#
###############################################################################
vm:

    # Endpoint of the vm management system.  For docker can be one of the following in general
    # unix:///var/run/docker.sock
    # http://localhost:2375
    # https://localhost:2376
    # If you utilize external chaincode builders and don't need the default Docker chaincode builder,
    # the endpoint should be unconfigured so that the peer's Docker health checker doesn't get registered.
   endpoint: unix:///var/run/docker.sock

    # settings for docker vms
   docker:
       tls:
           enabled: false
           ca:
               file: docker/ca.crt
           cert:
               file: docker/tls.crt
           key:
               file: docker/tls.key

        # Enables/disables the standard out/err from chaincode containers for
        # debugging purposes
       attachStdout: false

        # Parameters on creating docker container.
        # Container may be efficiently created using ipam & dns-server for cluster
        # NetworkMode - sets the networking mode for the container. Supported
        # standard values are: `host`(default),`bridge`,`ipvlan`,`none`.
        # Dns - a list of DNS servers for the container to use.
        # Note:  `Privileged` `Binds` `Links` and `PortBindings` properties of
        # Docker Host Config are not supported and will not be used if set.
        # LogConfig - sets the logging driver (Type) and related options
        # (Config) for Docker. For more info,
        # https://docs.docker.com/engine/admin/logging/overview/
        # Note: Set LogConfig using Environment Variables is not supported.
       hostConfig:
           NetworkMode: host
           Dns:
              # - 192.168.0.1
           LogConfig:
               Type: json-file
               Config:
                   max-size: "50m"
                   max-file: "5"
           Memory: 2147483648

###############################################################################
#
#    Chaincode section
#
###############################################################################
chaincode:

    # The id is used by the Chaincode stub to register the executing Chaincode
    # ID with the Peer and is generally supplied through ENV variables
    # the `path` form of ID is provided when installing the chaincode.
    # The `name` is used for all other requests and can be any string.
    id:
        path:
        name:

    # Generic builder environment, suitable for most chaincode types
    builder: $(DOCKER_NS)/fabric-ccenv:$(TWO_DIGIT_VERSION)

    # Enables/disables force pulling of the base docker images (listed below)
    # during user chaincode instantiation.
    # Useful when using moving image tags (such as :latest)
    pull: false

    golang:
        # golang will never need more than baseos
        runtime: $(DOCKER_NS)/fabric-baseos:$(TWO_DIGIT_VERSION)

        # whether or not golang chaincode should be linked dynamically
        dynamicLink: false

    java:
        # This is an image based on java:openjdk-8 with addition compiler
        # other added for java shim layer packaging.
        # This image is packed with shim layer libraries that are necessary
        # for Java chaincode runtime.
        runtime: $(DOCKER_NS)/fabric-javaenv:$(TWO_DIGIT_VERSION)

    node:
        # This is an image based on node:$(NODE_VER)-alpine
        runtime: $(DOCKER_NS)/fabric-nodeenv:$(TWO_DIGIT_VERSION)

    # List of directories to treat as external builders and launchers for
    # chaincode. The external builder detection processing will iterate over the
    # builders in the order specified below.
    # If you don't need to fallback to the default Docker builder, also unconfigure vm.endpoint above.
    # To override this property via env variable use CORE_CHAINCODE_EXTERNALBUILDERS: [{name: x, path: dir1}, {name: y, path: dir2}]
    externalBuilders:
       - name: ccaas_builder
         path: /opt/hyperledger/ccaas_builder
         propagateEnvironment:
           - CHAINCODE_AS_A_SERVICE_BUILDER_CONFIG


    # The maximum duration to wait for the chaincode build and install process
    # to complete.
    installTimeout: 300s

    # Timeout duration for starting up a container and waiting for Register
    # to come through.
    startuptimeout: 300s

    # Timeout duration for Invoke and Init calls to prevent runaway.
    # This timeout is used by all chaincodes in all the channels, including
    # system chaincodes.
    # Note that during Invoke, if the image is not available (e.g. being
    # cleaned up when in development environment), the peer will automatically
    # build the image, which might take more time. In production environment,
    # the chaincode image is unlikely to be deleted, so the timeout could be
    # reduced accordingly.
    executetimeout: 30s

    # There are 2 modes: "dev" and "net".
    # In dev mode, user runs the chaincode after starting peer from
    # command line on local machine.
    # In net mode, peer will run chaincode in a docker container.
    mode: net

    # keepalive in seconds. In situations where the communication goes through a
    # proxy that does not support keep-alive, this parameter will maintain connection
    # between peer and chaincode.
    # A value <= 0 turns keepalive off
    keepalive: 0

    # enabled system chaincodes
    system:
        _lifecycle: enable
        cscc: enable
        lscc: enable
        qscc: enable

    # Logging section for the chaincode container
    logging:
      # Default level for all loggers within the chaincode container
      level:  info
      # Override default level for the 'shim' logger
      shim:   warning
      # Format for the chaincode container logs
      format: '%{color}%{time:2006-01-02 15:04:05.000 MST} [%{module}] %{shortfunc} -> %{level:.4s} %{id:03x}%{color:reset} %{message}'

###############################################################################
#
#    Ledger section - ledger configuration encompasses both the blockchain
#    and the state
#
###############################################################################
ledger:

  blockchain:

  state:
    # stateDatabase - options are "goleveldb", "CouchDB"
    # goleveldb - default state database stored in goleveldb.
    # CouchDB - store state database in CouchDB
    stateDatabase: goleveldb
    # Limit on the number of records to return per query
    totalQueryLimit: 100000
    couchDBConfig:
       # It is recommended to run CouchDB on the same server as the peer, and
       # not map the CouchDB container port to a server port in docker-compose.
       # Otherwise proper security must be provided on the connection between
       # CouchDB client (on the peer) and server.
       couchDBAddress: 127.0.0.1:5984
       # This username must have read and write authority on CouchDB
       username:
       # The password is recommended to pass as an environment variable
       # during start up (eg CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD).
       # If it is stored here, the file must be access control protected
       # to prevent unintended users from discovering the password.
       password:
       # Number of retries for CouchDB errors
       maxRetries: 3
       # Number of retries for CouchDB errors during peer startup.
       # The delay between retries doubles for each attempt.
       # Default of 10 retries results in 11 attempts over 2 minutes.
       maxRetriesOnStartup: 10
       # CouchDB request timeout (unit: duration, e.g. 20s)
       requestTimeout: 35s
       # Limit on the number of records per each CouchDB query
       # Note that chaincode queries are only bound by totalQueryLimit.
       # Internally the chaincode may execute multiple CouchDB queries,
       # each of size internalQueryLimit.
       internalQueryLimit: 1000
       # Limit on the number of records per CouchDB bulk update batch
       maxBatchUpdateSize: 1000
       # Create the _global_changes system database
       # This is optional.  Creating the global changes database will require
       # additional system resources to track changes and maintain the database
       createGlobalChangesDB: false
       # CacheSize denotes the maximum mega bytes (MB) to be allocated for the in-memory state
       # cache. Note that CacheSize needs to be a multiple of 32 MB. If it is not a multiple
       # of 32 MB, the peer would round the size to the next multiple of 32 MB.
       # To disable the cache, 0 MB needs to be assigned to the cacheSize.
       cacheSize: 64

  history:
    # enableHistoryDatabase - options are true or false
    # Indicates if the history of key updates should be stored.
    # All history 'index' will be stored in goleveldb, regardless if using
    # CouchDB or alternate database for the state.
    enableHistoryDatabase: true

  pvtdataStore:
    # the maximum db batch size for converting
    # the ineligible missing data entries to eligible missing data entries
    collElgProcMaxDbBatchSize: 5000
    # the minimum duration (in milliseconds) between writing
    # two consecutive db batches for converting the ineligible missing data entries to eligible missing data entries
    collElgProcDbBatchesInterval: 1000
    # The missing data entries are classified into two categories:
    # (1) prioritized
    # (2) deprioritized
    # Initially, all missing data are in the prioritized list. When the
    # reconciler is unable to fetch the missing data from other peers,
    # the unreconciled missing data would be moved to the deprioritized list.
    # The reconciler would retry deprioritized missing data after every
    # deprioritizedDataReconcilerInterval (unit: minutes). Note that the
    # interval needs to be greater than the reconcileSleepInterval
    deprioritizedDataReconcilerInterval: 60m

  snapshots:
    # Path on the file system where peer will store ledger snapshots
    rootDir: /var/hyperledger/production/snapshots

###############################################################################
#
#    Operations section
#
###############################################################################
operations:
    # host and port for the operations server
    listenAddress: 127.0.0.1:9443

    # TLS configuration for the operations endpoint
    tls:
        # TLS enabled
        enabled: false

        # path to PEM encoded server certificate for the operations server
        cert:
            file:

        # path to PEM encoded server key for the operations server
        key:
            file:

        # most operations service endpoints require client authentication when TLS
        # is enabled. clientAuthRequired requires client certificate authentication
        # at the TLS layer to access all resources.
        clientAuthRequired: false

        # paths to PEM encoded ca certificates to trust for client authentication
        clientRootCAs:
            files: []

###############################################################################
#
#    Metrics section
#
###############################################################################
metrics:
    # metrics provider is one of statsd, prometheus, or disabled
    provider: disabled

    # statsd configuration
    statsd:
        # network type: tcp or udp
        network: udp

        # statsd server address
        address: 127.0.0.1:8125

        # the interval at which locally cached counters and gauges are pushed
        # to statsd; timings are pushed immediately
        writeInterval: 10s

        # prefix is prepended to all emitted statsd metrics
        prefix:


```

```shell
# 启动容器
docker-compose -f compose/docker-compose.yaml up -d

# 查看容器状态
docker ps -a 

# 编写configtx.yaml 文件
mkdir configtx
touch configtx/configtx.yaml
```

configtx.yaml

```yaml
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#
---
################################################################################
#
#   Section: Organizations
#
#   - This section defines the different organizational identities which will
#   be referenced later in the configuration.
#
################################################################################
Organizations:
  # SampleOrg defines an MSP using the sampleconfig.  It should never be used
  # in production but may be used as a template for other definitions
  - &OrdererOrg
    # DefaultOrg defines the organization which is used in the sampleconfig
    # of the fabric.git development environment
    Name: OrdererOrg
    # ID to load the MSP definition as
    ID: OrdererMSP
    # MSPDir is the filesystem path which contains the MSP configuration
    MSPDir: ../organizations/ordererOrganizations/jianlu.com/msp
    # Policies defines the set of policies at this level of the config tree
    # For organization policies, their canonical path is usually
    #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
    Policies:
      Readers:
        Type: Signature
        Rule: "OR('OrdererMSP.member')"
      Writers:
        Type: Signature
        Rule: "OR('OrdererMSP.member')"
      Admins:
        Type: Signature
        Rule: "OR('OrdererMSP.admin')"
    OrdererEndpoints:
      - orderer.jianlu.com:7050
  - &Org1
    # DefaultOrg defines the organization which is used in the sampleconfig
    # of the fabric.git development environment
    Name: Org1MSP
    # ID to load the MSP definition as
    ID: Org1MSP
    MSPDir: ../organizations/peerOrganizations/org1.jianlu.com/msp
    # Policies defines the set of policies at this level of the config tree
    # For organization policies, their canonical path is usually
    #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
    Policies:
      Readers:
        Type: Signature
        Rule: "OR('Org1MSP.admin', 'Org1MSP.peer', 'Org1MSP.client')"
      Writers:
        Type: Signature
        Rule: "OR('Org1MSP.admin', 'Org1MSP.client')"
      Admins:
        Type: Signature
        Rule: "OR('Org1MSP.admin')"
      Endorsement:
        Type: Signature
        Rule: "OR('Org1MSP.peer')"
  - &Org2
    # DefaultOrg defines the organization which is used in the sampleconfig
    # of the fabric.git development environment
    Name: Org2MSP
    # ID to load the MSP definition as
    ID: Org2MSP
    MSPDir: ../organizations/peerOrganizations/org2.jianlu.com/msp
    # Policies defines the set of policies at this level of the config tree
    # For organization policies, their canonical path is usually
    #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
    Policies:
      Readers:
        Type: Signature
        Rule: "OR('Org2MSP.admin', 'Org2MSP.peer', 'Org2MSP.client')"
      Writers:
        Type: Signature
        Rule: "OR('Org2MSP.admin', 'Org2MSP.client')"
      Admins:
        Type: Signature
        Rule: "OR('Org2MSP.admin')"
      Endorsement:
        Type: Signature
        Rule: "OR('Org2MSP.peer')"
################################################################################
#
#   SECTION: Capabilities
#
#   - This section defines the capabilities of fabric network. This is a new
#   concept as of v1.1.0 and should not be utilized in mixed networks with
#   v1.0.x peers and orderers.  Capabilities define features which must be
#   present in a fabric binary for that binary to safely participate in the
#   fabric network.  For instance, if a new MSP type is added, newer binaries
#   might recognize and validate the signatures from this type, while older
#   binaries without this support would be unable to validate those
#   transactions.  This could lead to different versions of the fabric binaries
#   having different world states.  Instead, defining a capability for a channel
#   informs those binaries without this capability that they must cease
#   processing transactions until they have been upgraded.  For v1.0.x if any
#   capabilities are defined (including a map with all capabilities turned off)
#   then the v1.0.x peer will deliberately crash.
#
################################################################################
Capabilities:
  # Channel capabilities apply to both the orderers and the peers and must be
  # supported by both.
  # Set the value of the capability to true to require it.
  Channel: &ChannelCapabilities
    # V2_0 capability ensures that orderers and peers behave according
    # to v2.0 channel capabilities. Orderers and peers from
    # prior releases would behave in an incompatible way, and are therefore
    # not able to participate in channels at v2.0 capability.
    # Prior to enabling V2.0 channel capabilities, ensure that all
    # orderers and peers on a channel are at v2.0.0 or later.
    V2_0: true
  # Orderer capabilities apply only to the orderers, and may be safely
  # used with prior release peers.
  # Set the value of the capability to true to require it.
  Orderer: &OrdererCapabilities
    # V2_0 orderer capability ensures that orderers behave according
    # to v2.0 orderer capabilities. Orderers from
    # prior releases would behave in an incompatible way, and are therefore
    # not able to participate in channels at v2.0 orderer capability.
    # Prior to enabling V2.0 orderer capabilities, ensure that all
    # orderers on channel are at v2.0.0 or later.
    V2_0: true
  # Application capabilities apply only to the peer network, and may be safely
  # used with prior release orderers.
  # Set the value of the capability to true to require it.
  Application: &ApplicationCapabilities
    # V2_0 application capability ensures that peers behave according
    # to v2.0 application capabilities. Peers from
    # prior releases would behave in an incompatible way, and are therefore
    # not able to participate in channels at v2.0 application capability.
    # Prior to enabling V2.0 application capabilities, ensure that all
    # peers on channel are at v2.0.0 or later.
    V2_0: true
################################################################################
#
#   SECTION: Application
#
#   - This section defines the values to encode into a config transaction or
#   genesis block for application related parameters
#
################################################################################
Application: &ApplicationDefaults
  # Organizations is the list of orgs which are defined as participants on
  # the application side of the network
  Organizations:
  # Policies defines the set of policies at this level of the config tree
  # For Application policies, their canonical path is
  #   /Channel/Application/<PolicyName>
  Policies:
    Readers:
      Type: ImplicitMeta
      Rule: "ANY Readers"
    Writers:
      Type: ImplicitMeta
      Rule: "ANY Writers"
    Admins:
      Type: ImplicitMeta
      Rule: "MAJORITY Admins"
    LifecycleEndorsement:
      Type: ImplicitMeta
      Rule: "MAJORITY Endorsement"
    Endorsement:
      Type: ImplicitMeta
      Rule: "MAJORITY Endorsement"
  Capabilities:
    <<: *ApplicationCapabilities
################################################################################
#
#   SECTION: Orderer
#
#   - This section defines the values to encode into a config transaction or
#   genesis block for orderer related parameters
#
################################################################################
Orderer: &OrdererDefaults
  # Orderer Type: The orderer implementation to start
  OrdererType: etcdraft
  # Addresses used to be the list of orderer addresses that clients and peers
  # could connect to.  However, this does not allow clients to associate orderer
  # addresses and orderer organizations which can be useful for things such
  # as TLS validation.  The preferred way to specify orderer addresses is now
  # to include the OrdererEndpoints item in your org definition
  Addresses:
    - orderer.jianlu.com:7050
  EtcdRaft:
    Consenters:
      - Host: orderer.jianlu.com
        Port: 7050
        ClientTLSCert: ../organizations/ordererOrganizations/jianlu.com/orderers/orderer.jianlu.com/tls/server.crt
        ServerTLSCert: ../organizations/ordererOrganizations/jianlu.com/orderers/orderer.jianlu.com/tls/server.crt
  # Batch Timeout: The amount of time to wait before creating a batch
  BatchTimeout: 2s
  # Batch Size: Controls the number of messages batched into a block
  BatchSize:
    # Max Message Count: The maximum number of messages to permit in a batch
    MaxMessageCount: 10
    # Absolute Max Bytes: The absolute maximum number of bytes allowed for
    # the serialized messages in a batch.
    AbsoluteMaxBytes: 99 MB
    # Preferred Max Bytes: The preferred maximum number of bytes allowed for
    # the serialized messages in a batch. A message larger than the preferred
    # max bytes will result in a batch larger than preferred max bytes.
    PreferredMaxBytes: 512 KB
  # Organizations is the list of orgs which are defined as participants on
  # the orderer side of the network
  Organizations:
  # Policies defines the set of policies at this level of the config tree
  # For Orderer policies, their canonical path is
  #   /Channel/Orderer/<PolicyName>
  Policies:
    Readers:
      Type: ImplicitMeta
      Rule: "ANY Readers"
    Writers:
      Type: ImplicitMeta
      Rule: "ANY Writers"
    Admins:
      Type: ImplicitMeta
      Rule: "MAJORITY Admins"
    # BlockValidation specifies what signatures must be included in the block
    # from the orderer for the peer to validate it.
    BlockValidation:
      Type: ImplicitMeta
      Rule: "ANY Writers"
################################################################################
#
#   CHANNEL
#
#   This section defines the values to encode into a config transaction or
#   genesis block for channel related parameters.
#
################################################################################
Channel: &ChannelDefaults
  # Policies defines the set of policies at this level of the config tree
  # For Channel policies, their canonical path is
  #   /Channel/<PolicyName>
  Policies:
    # Who may invoke the 'Deliver' API
    Readers:
      Type: ImplicitMeta
      Rule: "ANY Readers"
    # Who may invoke the 'Broadcast' API
    Writers:
      Type: ImplicitMeta
      Rule: "ANY Writers"
    # By default, who may modify elements at this config level
    Admins:
      Type: ImplicitMeta
      Rule: "MAJORITY Admins"
  # Capabilities describes the channel level capabilities, see the
  # dedicated Capabilities section elsewhere in this file for a full
  # description
  Capabilities:
    <<: *ChannelCapabilities
################################################################################
#
#   Profile
#
#   - Different configuration profiles may be encoded here to be specified
#   as parameters to the configtxgen tool
#
################################################################################
Profiles:
  TwoOrgsApplicationGenesis:
    <<: *ChannelDefaults
    Orderer:
      <<: *OrdererDefaults
      Organizations:
        - *OrdererOrg
      Capabilities: *OrdererCapabilities
    Application:
      <<: *ApplicationDefaults
      Organizations:
        - *Org1
        - *Org2
      Capabilities: *ApplicationCapabilities

```

```shell
# 配置fabric-cfg-path
export FABRIC_CFG_PATH=${PWD}/configtx

# 生成创世区块
configtxgen -profile TwoOrgsApplicationGenesis -outputBlock ./channel-artifacts/mychannel.block -channelID mychannel

# 将orderer节点加入 mychannel
osnadmin channel join --channelID mychannel --config-block ./channel-artifacts/mychannel.block -o orderer.jianlu.com:7053 --ca-file ${PWD}/organizations/ordererOrganizations/jianlu.com/tlsca/tlsca.jianlu.com-cert.pem --client-cert ${PWD}/organizations/ordererOrganizations/jianlu.com/orderers/orderer.jianlu.com/tls/server.crt --client-key ${PWD}/organizations/ordererOrganizations/jianlu.com/orderers/orderer.jianlu.com/tls/server.key

# 结果
Status: 201
{
	"name": "mychannel",
	"url": "/participation/v1/channels/mychannel",
	"consensusRelation": "consenter",
	"status": "active",
	"height": 1
}

# 将org组织peer节点加入mychannel

# 1. 配置org1相关环境变量

# 2. peer channel join -b ./channel-artifacts/mychannel.block

# 1. 配置org2相关环境变量

# 2. peer channel join -b ./channel-artifacts/mychannel.block

```

## other context

### 复制文件

cp ccp-template.yaml organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml

### 改编号端口

sed -i "s/\${ORG}/1/" organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml sed -i "s/\${P0PORT}/7051/"
organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml sed -i "s/\${CAPORT}/7054/"
organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml

### 插入peer证书

sed -i "
s#\${PEERPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org1.jianlu.com\/tlsca\/tlsca.org1.jianlu.com-cert.pem`

### " organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml

### 插入ca证书

sed -i "
s#\${CAPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org1.jianlu.com\/ca\/ca.org1.jianlu.com-cert.pem`

### " organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml

### 调整证书格式

sed -i $'s/\\\\n/\\\n /g' organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml

### 复制文件

cp ccp-template.yaml organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml

### 改编号端口

sed -i "s/\${ORG}/2/" organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml sed -i "s/\${P0PORT}/9051/"
organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml sed -i "s/\${CAPORT}/8054/"
organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml

### 插入peer证书

sed -i "
s#\${PEERPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org2.jianlu.com\/tlsca\/tlsca.org2.jianlu.com-cert.pem`

### " organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml

### 插入ca证书

sed -i "
s#\${CAPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org2.jianlu.com\/ca\/ca.org2.jianlu.com-cert.pem`

### " organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml

### 调整证书格式

sed -i $'s/\\\\n/\\\n /g' organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml

export CORE_PEER_TLS_ENABLED=true export
ORDERER_CA=${PWD}/organizations/ordererOrganizations/jianlu.com/tlsca/tlsca.jianlu.com-cert.pem export
PEER0_ORG1_CA=${PWD}/organizations/peerOrganizations/org1.jianlu.com/tlsca/tlsca.org1.jianlu.com-cert.pem export
PEER0_ORG2_CA=${PWD}/organizations/peerOrganizations/org2.jianlu.com/tlsca/tlsca.org2.jianlu.com-cert.pem export
PEER0_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.jianlu.com/tlsca/tlsca.org3.jianlu.com-cert.pem export
ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/jianlu.com/orderers/orderer.jianlu.com/tls/server.crt
export
ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/jianlu.com/orderers/orderer.jianlu.com/tls/server.key

export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA export
CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.jianlu.com/users/Admin@org1.jianlu.com/msp export
CORE_PEER_ADDRESS=localhost:7051


[comment]: <> (https://blog.csdn.net/humingwei11?type=blog)

[comment]: <> (https://zhuanlan.zhihu.com/p/613633111?utm_id=0)
