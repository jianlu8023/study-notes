<a id="top"></a>

# docker 技巧

----

## 目录

* [docker批量导出镜像](#1)

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
# /bin/bash

ehco "save image start..."

# 通用
# docker_rmi=$(docker images --format "{{.Repository}}:{{.Tag}}")

# 指定某一类
# docker_rmi=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "此处填写导出镜像关键词")

# 举例 导出hyperledger fabric国密的相关镜像

docker_rmi=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "gcbaas-gm")

for i in $docker_rmi ;do
  echo "current image: " +$i
  set -x
  docker_name=$(echo $i | sed -e 's/gcbaas-gm\/fabric/fabric/g')
  docker image save $i -o './'$docker_name'.tar'
  { set +x; } 2>/dev/null
  sleep 5
done

echo "save image finish..."
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

## 技巧2
