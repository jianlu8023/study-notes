# command 记录

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



```