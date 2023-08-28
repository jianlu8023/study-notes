<a id = "top"></a>

# 手动搭建fabric网络

----

## 目录

## fabric 2.4.3环境搭建过程

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


```

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
      - /etc/localtime:/etc/localtime:ro
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
      - /etc/localtime:/etc/localtime:ro
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
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/host/var/run/docker.sock
      - ../organizations/peerOrganizations/org2.jianlu.com/peers/peer0.org2.jianlu.com:/etc/hyperledger/fabric
      - peer0.org2.jianlu.com:/var/hyperledger/production
      - ../peercfg:/etc/hyperledger/peercfg
    depends_on:
      - couchdb1
  ca.orderer.jianlu.com:
    image: hyperledger/fabric-ca:1.5.3
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
      - /etc/localtime:/etc/localtime:ro
      - ../organizations/ordererOrganizations/jianlu.com/ca:/etc/hyperledger/fabric-ca-server
  ca.org1.jianlu.com:
    image: hyperledger/fabric-ca:1.5.3
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
      - /etc/localtime:/etc/localtime:ro
      - ../organizations/peerOrganizations/org1.jianlu.com/ca:/etc/hyperledger/fabric-ca-server
  ca.org2.jianlu.com:
    image: hyperledger/fabric-ca:1.5.3
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
      - /etc/localtime:/etc/localtime:ro
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
# 启动容器
docker-compose -f compose/docker-compose.yaml up -d


# 查看容器状态
      # system
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

# 复制文件

cp ccp-template.yaml organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml

# 改编号端口

sed -i "s/\${ORG}/1/" organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml sed -i "s/\${P0PORT}/7051/"
organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml sed -i "s/\${CAPORT}/7054/"
organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml

# 插入peer证书

sed -i "
s#\${PEERPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org1.jianlu.com\/tlsca\/tlsca.org1.jianlu.com-cert.pem`

# " organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml

# 插入ca证书

sed -i "
s#\${CAPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org1.jianlu.com\/ca\/ca.org1.jianlu.com-cert.pem`

# " organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml

# 调整证书格式

sed -i $'s/\\\\n/\\\n /g' organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml

# 复制文件

cp ccp-template.yaml organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml

# 改编号端口

sed -i "s/\${ORG}/2/" organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml sed -i "s/\${P0PORT}/9051/"
organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml sed -i "s/\${CAPORT}/8054/"
organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml

# 插入peer证书

sed -i "
s#\${PEERPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org2.jianlu.com\/tlsca\/tlsca.org2.jianlu.com-cert.pem`

# " organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml

# 插入ca证书

sed -i "
s#\${CAPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org2.jianlu.com\/ca\/ca.org2.jianlu.com-cert.pem`

# " organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml

# 调整证书格式

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
