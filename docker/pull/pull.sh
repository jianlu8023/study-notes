#!/bin/bash

read -r -p "请输入用户名:" username

read -s -p "请输入密码:"  password 

echo ""

docker login -u $username -p $password private.mirror.com

echo "登录成功!!!"

jdk="openjdk:8-jre amazoncorretto:8-alpine-jdk"

ipfs="ipfs/kubo:v0.32.1"

goimage="golang:1.16.2 golang:1.17.5-alpine golang:1.16.12-buster"

linuximage="ubuntu:20.04 debian:stable-slim centos:7.6.1810"

mysqlimage="mysql:8.0.28 mysql:5.7 mysql:8.0.31-debian"

chainmakerofficicalimage="chainmakerofficial/management-backend:v2.3.1 chainmakerofficial/management-web:v2.3.1"

alpineimage="alpine:3.18 alpine:3.16 alpine:latest"

prometheus="prom/prometheus:v2.42.0 prom/prometheus:v2.32.1"

grafana="grafana/grafana:8.3.4"

es="docker.elastic.co/elasticsearch/elasticsearch:7.10.0 docker.elastic.co/kibana/kibana:8.4.2 mobz/elasticsearch-head:5-alpine"

fabric2_2="hyperledger/fabric-tools:2.2.0 hyperledger/fabric-peer:2.2.0 hyperledger/fabric-orderer:2.2.0 hyperledger/fabric-ccenv:2.2.0 hyperledger/fabric-baseos:2.2.0 hyperledger/fabric-nodeenv:2.2.0 hyperledger/fabric-javaenv:2.2.0 hyperledger/fabric-tools:2.2.5 hyperledger/fabric-peer:2.2.5 hyperledger/fabric-orderer:2.2.5 hyperledger/fabric-ccenv:2.2.5 hyperledger/fabric-baseos:2.2.5"
fabric2_4="hyperledger/fabric-tools:2.4.3 hyperledger/fabric-peer:2.4.3 hyperledger/fabric-orderer:2.4.3 hyperledger/fabric-ccenv:2.4.3 hyperledger/fabric-baseos:2.4.3"
fabric_ca="hyperledger/fabric-ca:1.5.2 hyperledger/fabric-ca:1.4.9"
fabric="${fabric2_2} ${fabric2_4} ${fabric_ca}"

mongo="mongo:latest"

nginx="nginx:mainline-alpine3.18"

redis="redis:7.2.0-alpine3.18"

cadvisor="lagoudocker/cadvisor:v0.37.0"

node_exporter="prom/node-exporter:v1.3.1"

portainer="portainer/portainer:latest"

couchdb="couchdb:3.1.1"

busybox="busybox:latest busybox:stable-glibc busybox:1.31.1-glibc"

gmcaimage="gcbaas-gm/fabric-ca:1.5.2"
gmccenvimage="gcbaas-gm/fabric-ccenv:2.4.3-0.0.1"
gmbaseosimage="gcbaas-gm/fabric-baseos:2.4.3-0.0.1"
gmordererimage="gcbaas-gm/fabric-orderer:2.4.3-0.0.1"
gmpeerimage="gcbaas-gm/fabric-peer:2.4.3-0.0.1"
gmtoolsimage="gcbaas-gm/fabric-tools:2.4.3-0.0.1"
gcbaasgmimage="$gmcaimage $gmccenvimage $gmbaseosimage $gmordererimage $gmpeerimage $gmtoolsimage"

neo4j="neo4j:5.9.0-community"

zookeeper="zookeeper:latest dabealu/zookeeper-exporter:v0.1.13 wurstmeister/zookeeper:latest"

kafka="confluentinc/cp-kafka:latest wurstmeister/kafka:latest sheepkiller/kafka-manager:latest"

rabbitmq="rabbitmq:3-management"

xxl_job="xuxueli/xxl-job-admin:2.4.0"

image="$jdk $ipfs $goimage $linuximage  $mysqlimage $chainmakerofficicalimage $alpineimage $prometheus $grafana $es $fabric $mongo $nginx $redis $cadvisor $node_exporter $portainer $couchdb $busybox $gcbaasgmimage $neo4j $zookeeper $kafka $rabbitmq $xxl_job"

prefix="private.mirror.com/"

for i in $image; do
	echo "当前正在拉取镜像 $i"
  if [[ $i =~ "priOfficial" || $i =~ "gcbaas" ]]; then
		docker pull $prefix$i
		docker tag $prefix$i $i
	else
		docker pull $i
	fi
done
docker rmi `docker images --format "{{.Repository}}:{{.Tag}}" | grep "$prefix"`

