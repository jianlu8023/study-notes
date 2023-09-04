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


## 技巧3

docker rmi $(docker images --format "{{.Repository}}:{{.Tag}}" | grep 'gcbaas-gm' )
