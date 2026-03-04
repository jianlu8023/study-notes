# linux SHELL 技巧总结

* 下方 shell 脚本均在 ubuntu 20.04 测试可运行

## 找到指定文件夹下 后缀是xxx的文件并做后续处理

### 全部执行

* main.sh

```shell
#!/bin/bash

# 举例 以找到文件夹下 所有 jpg 后缀的文件 并执行脚本的举例
dstdir="/home/user/data"
script_path="./echoname.sh"

if [ -z "$dstdir" ]; then
  echo "dstdir 未指定..."
  exit 1
fi

if [ -z "$script_path" ]; then
  echo "script_path 未指定..."
  exit 1
fi

if [ ! -d "$dstdir" ];then 
  echo "文件夹 $dstdir 不存在或不是文件夹..." 
  exit 1
fi

if [ ! -f "$script_path" ]; then
  echo "脚本 $script_path 不存在..."
  exit 1
fi

if [ ! -x "$script_path" ]; then
  echo "脚本 $script_path 没有执行权限,请执行 chmod +x $script_path 后重试..."
  exit 1
fi

# IFS 将整个文件名当作一个整体给 filepath
while IFS= read -r -d '' filepath; do
  echo "正在处理文件 \"$filepath\""
  "$script_path" "$filepath"
  echo "-------------------------"
  sleep 1
done < <(find "$dstdir" -type -f -iname "*.jpg" -print0)
# -type 执行类型 f 文件
# -iname 忽略大小写 
# -print0 用一个 null 字符 (\0) 来分隔每个找到的文件名

echo "done"

# ----------------------------------------

# 随机抽指定数量的进行测试
dstdir="/home/user/data"
script_path="./echoname.sh"
test_count=5


if [ -z "$dstdir" ]; then
  echo "dstdir 未指定..."
  exit 1
fi

if [ -z "$script_path" ]; then
  echo "script_path 未指定..."
  exit 1
fi

if [ ! -d "$dstdir" ];then 
  echo "文件夹 $dstdir 不存在或不是文件夹..." 
  exit 1
fi

if [ ! -f "$script_path" ]; then
  echo "脚本 $script_path 不存在..."
  exit 1
fi

if [ ! -x "$script_path" ]; then
  echo "脚本 $script_path 没有执行权限,请执行 chmod +x $script_path 后重试..."
  exit 1
fi

file_count=$(find "$dstdir" -type f -iname "*.jpg" -print0 | grep -zc .)

if [ "$file_count" -eq 0 ]; then
  echo "未找到符合测试条件的jpg文件..."
  exit 0
elif [ "$file_count" -lt $test_count ]; then
  echo "可测试文件小于等于 $test_count,全部测试..."
  find "$dstdir" -type f -iname "*.jpg" -print0 | \
  while IFS= read -r -d '' filepath; do
    echo "正在处理文件 \"$filepath\""
    "$script_path" "$filepath"
    echo "-------------------------"
    sleep 1
  done
else
  echo "满足测试条件的文件超过 $test_count 随机抽取..."
  find "$dstdir" -type f -iname "*.jpg" -print0 | shuf -z | head -z -n $test_count | \
  while IFS= read -r -d '' filepath; do
    echo "正在处理文件 \"$filepath\""
    "$script_path" "$filepath"
    echo "-------------------------"
    sleep 1
  done
fi

echo "done"
```

* echoname.sh

```shell
#!/bin/bash

file_name="$1"

echo $file_name
sleep 1

echo "done"

```

### 随机抽

* main.sh

```shell
#!/bin/bash

# 随机抽指定数量的进行测试
dstdir="/home/user/data"
script_path="./echoname.sh"
test_count=5

if [ -z "$dstdir" ]; then
  echo "dstdir 未指定..."
  exit 1
fi

if [ -z "$script_path" ]; then
  echo "script_path 未指定..."
  exit 1
fi

if [ ! -d "$dstdir" ];then 
  echo "文件夹 $dstdir 不存在或不是文件夹..." 
  exit 1
fi

if [ ! -f "$script_path" ]; then
  echo "脚本 $script_path 不存在..."
  exit 1
fi

if [ ! -x "$script_path" ]; then
  echo "脚本 $script_path 没有执行权限,请执行 chmod +x $script_path 后重试..."
  exit 1
fi

file_count=$(find "$dstdir" -type f -iname "*.jpg" -print0 | grep -zc .)

if [ "$file_count" -eq 0 ]; then
  echo "未找到符合测试条件的jpg文件..."
  exit 0
elif [ "$file_count" -lt $test_count ]; then
  echo "可测试文件小于等于 $test_count,全部测试..."
  find "$dstdir" -type f -iname "*.jpg" -print0 | \
  while IFS= read -r -d '' filepath; do
    echo "正在处理文件 \"$filepath\""
    "$script_path" "$filepath"
    echo "-------------------------"
    sleep 1
  done
else
  echo "满足测试条件的文件超过 $test_count 随机抽取..."
  find "$dstdir" -type f -iname "*.jpg" -print0 | shuf -z | head -z -n $test_count | \
  while IFS= read -r -d '' filepath; do
    echo "正在处理文件 \"$filepath\""
    "$script_path" "$filepath"
    echo "-------------------------"
    sleep 1
  done
fi

echo "done"
```

* echoname.sh

```shell
#!/bin/bash

file_name="$1"

echo $file_name
sleep 1

echo "done"

```

## command 记录

```shell
# zip 创建压缩文件 文件夹及文件夹下文件
zip -r example.zip /path/example

# docker 输出json字符串组成json数组 (配置jsontools 工具 美化输出)
docker ps -a --no-trunc --format 'json'  | awk 'BEGIN {printf "["} {printf "%s,",$0} END {printf "{}]"}'| sed -e "s/,{}//g"

# 创建压缩包
tar cvf jpg.tar *.jpg       # 将目录里所有jpg文件打包成 tar.jpg 
tar czf jpg.tar.gz *.jpg    # 将目录里所有jpg文件打包成 jpg.tar 后，并且将其用 gzip 压缩，生成一个 gzip 压缩过的包，命名为 jpg.tar.gz 
tar cjf jpg.tar.bz2 *.jpg   # 将目录里所有jpg文件打包成 jpg.tar 后，并且将其用 bzip2 压缩，生成一个 bzip2 压缩过的包，命名为jpg.tar.bz2 
tar cZf jpg.tar.Z *.jpg     # 将目录里所有 jpg 文件打包成 jpg.tar 后，并且将其用 compress 压缩，生成一个 umcompress 压缩过的包，命名为jpg.tar.Z 
rar a jpg.rar *.jpg         # rar格式的压缩，需要先下载 rar for linux 
zip jpg.zip *.jpg           # zip格式的压缩，需要先下载 zip for linux

# 解压缩 
tar xvf file.tar         # 解压 tar 包 
tar xzvf file.tar.gz     # 解压 tar.gz 
tar xjvf file.tar.bz2    # 解压 tar.bz2 
tar xZvf file.tar.Z      # 解压 tar.Z 
unrar e file.rar         # 解压 rar 
unzip file.zip           # 解压 zip 


# https://mirrors.tuna.tsinghua.edu.cn/help/debian/
```

## 格式输出

```shell

cat << EOF > ./a.sh

#123
mysqld --user=mysql
EOF

```

## read命令使用

<code>read</code> 命令用于从标准输入读取用户输入，并将输入存储到一个或多个变量中。它的一般语法如下：

<code>read [options] variable(s)</code><br>
<code>options</code>：可选参数，用于指定 <code>read</code> 命令的行为。<br>
<code>variable(s)</code>：要存储输入值的一个或多个变量。

以下是一些常见的 <code>read</code> 命令选项：

<code>-p</code>：指定一个提示消息，用于提示用户输入。<br>
<code>-t</code>：设置一个超时时间，如果在指定的时间内没有输入，则会引发一个超时错误。<br>
<code>-s</code>：开启静默模式，用户输入的内容将不会显示在终端上。<br>
<code>-n</code>：设置只读取指定数量的字符。<br>
<code>-r</code>：禁用反斜杠转义，输入的内容将按照字面值进行处理。<br>

以下是一些示例，演示如何使用 <code>read</code> 命令：

* 读取单个变量：

```bash
read variable
echo "You entered: $variable"
```

* 读取多个变量：

```bash
read var1 var2 var3
echo "You entered: $var1, $var2, $var3"
```

* 提示用户输入：

```bash
read -p "Enter your name: " name
echo "Hello, $name!"
```

* 设置超时时间：

```bash
if read -t 5 -p "Enter your name within 5 seconds: " name; then
    echo "Hello, $name!"
else
    echo "Timeout reached. Exiting..."
fi
```

* 隐藏用户输入：

```bash
read -s -p "Enter your password: " password
echo "Your password is: $password
```

