# !/bin/sh

#邮件发送信息
cpu_flag=""
mem_flag=""
crit_info=""
main_function="内存使用异常!"

IPS=`ifconfig -a|grep inet|grep -v 127.0.0.1|grep -v inet6|awk '{print $2}'|tr -d "addr:"﻿​`
IP=`ifconfig -a|grep inet|grep -i 172.25.138.*|grep -v inet6|awk '{print $2}'|tr -d "addr:"﻿​`
IP="172.25.138.45"

usedMem=`free -m | awk 'NR==2' | awk '{print $3}'`
freeMem=`free -m | awk 'NR==2' | awk '{print $4}'`

echo $freeMem
echo "===========================" >> /var/log/mem.log
date >> /var/log/mem.log
echo ">>>> Memory usage | [Use：${usedMem}MB][Free：${freeMem}MB]" >> /var/log/mem.log
echo ">>>> Memory usage | [Use：${usedMem}MB][Free：${freeMem}MB]"

# less 500 mb just free
if [[ $freeMem -le 500 ]]; then
    crit_info="low_memory"
    crit_info=$crit_info", $IP, MEM_服务器内存异常"
    mem_flag="true"
    main_function=$main_function"MEM_内存异常, server_ip: root@172.25.138.42, "
    main_function=$main_function"usedMem: ${usedMem}MB, "
    main_function=$main_function"freeMem: ${freeMem}MB"
	echo ">>>> star clean cache...." >> /var/log/mem.log
	echo ">>>> Freeing the page cache:" >> /var/log/mem.log
	sync && echo 1 > /proc/sys/vm/drop_caches
	echo ">>>> Free dentries and inodes:" >> /var/log/mem.log
	sync && echo 2 > /proc/sys/vm/drop_caches
	echo ">>>> Free the page cache, dentries and the inodes:" >> /var/log/mem.log
	sync && echo 3 > /proc/sys/vm/drop_caches
	echo ">>>> clean cache finished...." >> /var/log/mem.log

    crit_info=$crit_info", $IP, MEM_服务器内存异常"
    echo "$main_function" | mail -s "$crit_info" 84247764@qq.com
else
	echo ">>>> Not required" >> /var/log/mem.log
	echo ">>>> No need to clean cache...." >> /var/log/mem.log
	echo ">>>> No need to clean cache...."
fi
echo ">>>> End of cleanCache program...." >> /var/log/mem.log


#echo "$crit_info"
#echo "$main_function"


#检测CPU情况
CPU_us=$(vmstat | awk '{print $13}' | sed -n '$p')
CPU_sy=$(vmstat | awk '{print $14}' | sed -n '$p')
CPU_id=$(vmstat | awk '{print $15}' | sed -n '$p')
CPU_wa=$(vmstat | awk '{print $16}' | sed -n '$p')
CPU_st=$(vmstat | awk '{print $17}' | sed -n '$p')

CPU1=`cat /proc/stat | grep 'cpu ' | awk '{print $2" "$3" "$4" "$5" "$6" "$7" "$8}'`
sleep 5
CPU2=`cat /proc/stat | grep 'cpu ' | awk '{print $2" "$3" "$4" "$5" "$6" "$7" "$8}'`
IDLE1=`echo $CPU1 | awk '{print $4}'`
IDLE2=`echo $CPU2 | awk '{print $4}'`
CPU1_TOTAL=`echo $CPU1 | awk '{print $1+$2+$3+$4+$5+$6+$7}'`
CPU2_TOTAL=`echo $CPU2 | awk '{print $1+$2+$3+$4+$5+$6+$7}'`
IDLE=`echo "$IDLE2-$IDLE1" | bc`
CPU_TOTAL=`echo "$CPU2_TOTAL-$CPU1_TOTAL" | bc`
RATE=`echo "scale=4;($CPU_TOTAL-$IDLE)/$CPU_TOTAL*100" | bc | awk '{printf "%.2f",$1}'`
CPU_RATE=`echo $RATE | cut -d. -f1`
if [ $CPU_RATE -ge 90 ];then
    cpu_flag="true"
    crit_info="high_cpu"
    crit_info=$crit_info", $IP, CPU_使用率异常"
    main_function=$main_function"CPU_使用率异常, server_ip: \n$IPS"
	main_function=$main_function"\n$IP 服务器CPU：\n"
	main_function=$main_function"    CPU使用率$CPU_RATE%，超过90%！ \n"
	main_function=$main_function"    us=$CPU_us\t  sy=$CPU_sy\t  id=$CPU_id\t  wa=$CPU_wa\t  st=$CPU_st  \n"
    echo "$main_function" | mail -s "$crit_info" 84247764@qq.com
fi


#检测结束，判断crit_info是否为空值，为空则表示无异常，不为空则发送邮件
if [[ $mem_flag -eq "" ]];then
	echo -e ">>>> 本次系统内存检测无异常。"
else
    echo -e ">>>> 本次系统内存检测内存异常 ..."
    #echo "This is the body of the email" | mail -s "This is the subject line" 84247764@qq.com
fi

if [[ $cpu_flag -eq "" ]];then
	echo -e ">>>> 本次系统cpu检测无异常。"
else
    echo -e ">>>> 本次系统cpu检测内存异常 ..."
    #echo "This is the body of the email" | mail -s "This is the subject line" 84247764@qq.com
fi