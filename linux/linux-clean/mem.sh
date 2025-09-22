#!/bin/bash

# 获取已使用的内存量（单位：MB）
used=`free -m | awk 'NR==2' | awk '{print $3}'`
# 获取空闲的内存量（单位：MB）
free=`free -m | awk 'NR==2' | awk '{print $4}'`
# 日志文件
logfile="$HOME/mem.log"

# 定义日志文件大小限制，单位为字节，这里设置为10MB（可根据需求调整）
log_size_limit=$((10 * 1024 * 1024))

# 文件不存在 则创建
if [[ ! -f  $logfile ]]; then
    touch $logfile
fi

# 获取当前日志文件的大小
log_size=$(stat -c%s "$logfile")

# 日志文件过大
if [[ $log_size -gt $log_size_limit ]]; then
    # 备份当前日志文件
    backup_file="${logfile}.$(date +%Y%m%d%H%M%S)"
    mv $logfile $backup_file
    echo "$(date +%Y-%m-%d\ %H:%M:%S): Log file exceeded size limit. Moved to $backup_file" >> $backup_file

    # 创建一个新的空日志文件
    touch $logfile
fi

echo "$(date +%Y-%m-%d\ %H:%M:%S): memory usage: used ${used}MB free ${free}MB ">>$logfile

if [[ $free -le 500 ]]; then
    echo "$(date +%Y-%m-%d\ %H:%M:%S): start free cache..." >> $logfile
    
    echo "$(date +%Y-%m-%d\ %H:%M:%S): start free page cache..." >> $logfile
    #sync && echo 1 > /proc/sys/vm/drop_caches
    sudo sync && sudo echo 1 | sudo tee /proc/sys/vm/drop_caches

    echo "$(date +%Y-%m-%d\ %H:%M:%S): start free dentries and inodes..." >> $logfile
    #sync && echo 2 > /proc/sys/vm/drop_caches
    sudo sync && sudo echo 2 | sudo tee /proc/sys/vm/drop_caches

    echo "$(date +%Y-%m-%d\ %H:%M:%S): start free page cache, dentries and inodes..." >> $logfile
    #sync && echo 3 > /proc/sys/vm/drop_caches
    sudo sync && sudo echo 3 | sudo tee /proc/sys/vm/drop_caches
else
    echo "$(date +%Y-%m-%d\ %H:%M:%S): memory no need clean..." >> $logfile
fi
