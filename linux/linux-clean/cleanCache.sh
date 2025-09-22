#!/bin/bash

usedMem=`free -m | awk 'NR==2' | awk '{print $3}'`
freeMem=`free -m | awk 'NR==2' | awk '{print $4}'`

echo $freeMem
echo "===========================" >> /var/log/mem.log
date >> /var/log/mem.log
echo ">>>> Memory usage | [Use：${usedMem}MB][Free：${freeMem}MB]" >> /var/log/mem.log
echo ">>>> Memory usage | [Use：${usedMem}MB][Free：${freeMem}MB]"

# less 500 mb just free
if [[ $freeMem -le 500 ]]; then
	echo ">>>> star clean cache...." >> /var/log/mem.log
	echo ">>>> Freeing the page cache:" >> /var/log/mem.log
	sync && echo 1 > /proc/sys/vm/drop_caches
	echo ">>>> Free dentries and inodes:" >> /var/log/mem.log
	sync && echo 2 > /proc/sys/vm/drop_caches
	echo ">>>> Free the page cache, dentries and the inodes:" >> /var/log/mem.log
	sync && echo 3 > /proc/sys/vm/drop_caches
	#cat /proc/sys/vm/drop_caches >> /var/log/mem.log
	echo ">>>> clean cache finished...." >> /var/log/mem.log
    echo ">>>> curr Memory usage | [Use：${usedMem}MB][Free：${freeMem}MB]" >> /var/log/mem.log
    echo ">>>> curr Memory usage | [Use：${usedMem}MB][Free：${freeMem}MB]"
else
	echo ">>>> Not required" >> /var/log/mem.log
	echo ">>>> No need to clean cache...." >> /var/log/mem.log
	echo ">>>> No need to clean cache...."
fi
echo ">>>> End of cleanCache program...." >> /var/log/mem.log
