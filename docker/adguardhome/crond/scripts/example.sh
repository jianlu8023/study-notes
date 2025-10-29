#!/bin/sh

time=$(date +"%Y-%m-%d %A %T")


wd=$(pwd)

log=$wd/logs/example.log

echo "$time [info] service is alive..." >> $log
