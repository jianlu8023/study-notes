#!/bin/bash

#如果concole.log 大小超过10m，就清空。
function checkLog(){
    filesize=`ls -l $1 | awk '{ print $5 }'`
    maxsize=$((10*1024*1024))
    if [ $filesize -gt $maxsize ]
    then
        echo "清空日志"
        >$1; 
    fi
}

#checkLog "/orderer_manager_jar/orderer-manager.log";
#checkLog "/orderer_client_jar/orderer_client.log";
#checkLog "/org_manager_jar/org-manager.log";
#checkLog "/org_client_jar/org-client.log";
