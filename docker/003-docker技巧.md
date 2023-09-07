<a id="top"></a>

# docker 技巧

----

## 目录

* [docker批量导出镜像](#1)
* [docker批量导入镜像](#2)

<a id="1"></a>

## docker 批量导出镜像

### 步骤

0. 创建文件夹保存导出镜像

```shell
# 创建文件夹
mkdir ~/docker
cd ~/docker
```

1. 根据需求改写下方shell

```shell
#bin/bash

ehco "start..."

key=""

if [[ ! -z $1  ]]; then
	key="$1"
fi

docker_rmi=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "$key")

for i in $docker_rmi ;do
  echo "current image: " +$i
  set -x
  docker_name=$(echo $i | sed -e 's/\//-/g')
  docker image save $i -o './'""$docker_name""'.tar'
  { set +x; } 2>/dev/null
  sleep 1
done
```

2. 创建save.sh

```shell

cd ~/docker
touch save.sh
# 粘贴修改后的步骤1中shell
```

3. 加权

```shell
cd ~/docker

chmod +x *.sh
```

4. 执行

```shell

./save.sh

# bash save.sh
```

<a id="2"></a>

<a id="2"></a>

## 批量导入docker镜像

0. 准备要导入的镜像的tarball
1. 创建load.sh

```shell
touch load.sh
```

2. 将下方shell脚本输入到load.sh中

```shell
#bin/bash

folders=""
echo "load image start..."
# $1 不为 0
if [[ ! -z  $1 ]]; then
    folders="$1"
else
  folders="$(pwd)"
fi

files=`ls $folders`

file_type='.tar'
for file in $files ; do
  if [[ $file =~ $file_type ]]; then
    image_origin_name_tar=`basename $file`
    docker image load -i $image_origin_name_tar
  fi
  sleep 1
done

```

3. 加权

```shell
chmod +x *.sh
```

4. 执行

```shell
# 二选一
bash load.sh

./load.sh
```

## 限制容器占用资源

```yaml
version: "3.8"
networks:
  basic:
    name: basic
services:
  mysql:
    restart: always
    image: mysql:5.7.18
    container_name: mysql
    # 此部分
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 100M
        reservations:
          cpus: "0.25"
          memory: 20M
    # 此部分
    networks:
      - basic
    volumes:
      - ./mysql/mydir:/mydir
      - ./mysql/datadir:/var/lib/mysql
      - ./mysql/conf/my.cnf:/etc/my.cnf
      - /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime:ro
      - ./mysql/source:/docker-entrypoint-initdb.d
    environment:
      - "MYSQL_ROOT_PASSWORD=123456"
      - "MYSQL_DATABASE=basic"
      - "TZ=Asia/Shanghai"
    ports:
      - 3306:3306
```

[comment]: <> (https://blog.csdn.net/qq_36148847/article/details/79427878)

## 技巧4

docker rmi $(docker images --format "{{.Repository}}:{{.Tag}}" | grep 'gcbaas-gm' )

docker restart `docker ps -a -f "status=exited" --format "{{.ID}}"`

## 制作基于alpine镜像的mysql镜像

```dockerfile
# 基镜像
# 基础镜像
FROM alpine:3.18

# 设置国科大镜像
RUN sed -i "s/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g" /etc/apk/repositories \
    && apk update \
    && apk upgrade

# 安装 mysql和musql客户端
RUN apk add mysql mysql-client

# 创建目录，作为数据库存储路径
RUN mkdir -p /var/lib/mysql


RUN mkdir /var/run/mysqld && \
    chown -R mysql:mysql /var/run/mysqld && \
    mkdir /docker-entrypoint-initdb.d

RUN echo "mysqld --user=mysql" > /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

RUN ln -s /usr/local/bin/entrypoint.sh /



RUN mysql_install_db --user=mysql --datadir=/var/lib/mysql

VOLUME /var/lib/mysql

EXPOSE 3306

WORKDIR /

ENTRYPOINT ["/entrypoint.sh"]
#CMD ["mysqld", "--user=mysql"]


```

curl -L https://ghproxy.com/https://raw.githubusercontent.com/docker-library/mysql/master/5.7/docker-entrypoint.sh >
docker-entrypoint.sh