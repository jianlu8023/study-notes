<a id = "top"></a>

# 手动搭建fabric网络

----

## 目录
[comment]: <> (https://zhuanlan.zhihu.com/p/613633111?utm_id=0)

# 复制文件
cp ccp-template.yaml organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml
# 改编号端口
sed -i "s/\${ORG}/1/" organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml
sed -i "s/\${P0PORT}/7051/" organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml
sed -i "s/\${CAPORT}/7054/" organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml
# 插入peer证书
sed -i "s#\${PEERPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org1.jianlu.com\/tlsca\/tlsca.org1.jianlu.com-cert.pem`#" organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml
# 插入ca证书
sed -i "s#\${CAPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org1.jianlu.com\/ca\/ca.org1.jianlu.com-cert.pem`#" organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml
# 调整证书格式
sed -i $'s/\\\\n/\\\n          /g' organizations/peerOrganizations/org1.jianlu.com/connection-org1.yaml


# 复制文件
cp ccp-template.yaml organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml
# 改编号端口
sed -i "s/\${ORG}/2/" organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml
sed -i "s/\${P0PORT}/9051/" organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml
sed -i "s/\${CAPORT}/8054/" organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml
# 插入peer证书
sed -i "s#\${PEERPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org2.jianlu.com\/tlsca\/tlsca.org2.jianlu.com-cert.pem`#" organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml
# 插入ca证书
sed -i "s#\${CAPEM}#`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' organizations\/peerOrganizations\/org2.jianlu.com\/ca\/ca.org2.jianlu.com-cert.pem`#" organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml
# 调整证书格式
sed -i $'s/\\\\n/\\\n          /g' organizations/peerOrganizations/org2.jianlu.com/connection-org2.yaml



export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/jianlu.com/tlsca/tlsca.jianlu.com-cert.pem
export PEER0_ORG1_CA=${PWD}/organizations/peerOrganizations/org1.jianlu.com/tlsca/tlsca.org1.jianlu.com-cert.pem
export PEER0_ORG2_CA=${PWD}/organizations/peerOrganizations/org2.jianlu.com/tlsca/tlsca.org2.jianlu.com-cert.pem
export PEER0_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.jianlu.com/tlsca/tlsca.org3.jianlu.com-cert.pem
export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/jianlu.com/orderers/orderer.jianlu.com/tls/server.crt
export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/jianlu.com/orderers/orderer.jianlu.com/tls/server.key

export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.jianlu.com/users/Admin@org1.jianlu.com/msp
export CORE_PEER_ADDRESS=localhost:7051


[comment]: <> (https://blog.csdn.net/humingwei11?type=blog)
