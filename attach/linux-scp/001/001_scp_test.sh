#!/bin/bash


begin=$(date +%s)
begin_date=$(date +%Y-%m-%d\ %H:%M:%S)

expect -c "
    spawn scp -r -P 22 /root/go root@172.25.138.51:/opt/ipfs
    expect {
        \"yes/no\" {send \"yes\r\";exp_continue;}
        \"*password\" {set timeout 500;send \"ubuntu@321\r\";}
    }
expect eof"





end=$(date +%s)
end_date=$(date +%Y-%m-%d\ %H:%M:%S)

echo ""
echo ""
echo "done!!!!"
echo "begin: ${begin_date}"
echo "end: ${end_date}"
echo "use: $((end - begin)) 秒"
