# command 记录

```shell
# zip 创建压缩文件 文件夹及文件夹下文件
zip -r example.zip /path/example

# docker 输出json字符串组成json数组 (配置jsontools 工具 美化输出)
docker ps -a --no-trunc --format 'json'  | awk 'BEGIN {printf "["} {printf "%s,",$0} END {printf "{}]"}'| sed -e "s/,{}//g"
```