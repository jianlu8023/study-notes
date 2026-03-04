#!/bin/bash


begin=$(date +%s)
begin_date=$(date +%Y-%m-%d\ %H:%M:%S)

expect -c "
    spawn rsync  -avzu -e \"ssh -p 49922\" --progress /root/.ipfs ccf@66.66.68.45:/home/ccf/ipfs/data2
    expect {
        \"yes/no\" {send \"yes\r\";exp_continue;}
        \"*password\" {set timeout 500;send \"ccf@34%^&*\r\";}
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
