#!/bin/bash


# 检查是否提供了参数
if [ $# -eq 0 ]; then
    echo "Usage: $0 <size>"
    echo "Example: $0 2MB or $0 2GB"
    exit 1
fi


# 生成随机文件名
random_filename=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1).dat



# 解析大小参数
size=$1
unit=${size:(-2)}
value=${size%$unit}


case $unit in
MB)
    bs=1048576
    ;;
GB)
    bs=1073741824
    ;;
*)
    echo "Unsupported unit. Use MB or GB."
    exit 1
    ;;
esac
count=$((value * bs / 1024))

# 创建一个约 1GB 的随机文件
#dd if=/dev/urandom of=$random_filename bs=1048576 count=10
dd if=/dev/urandom of=$random_filename bs=1024 count=$count

#echo "Created random file: $random_filename"
echo "Created random file: $random_filename with size $size"
