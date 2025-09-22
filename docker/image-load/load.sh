#!/bin/bash
folders=""
if [[ ! -z  $1 ]]; then
    	folders="$1"
else
	folders="$(pwd)"
fi
echo "PATH:" $folders
files=`ls $folders`
file_type='.tar'
tar_file_type='.tar.gz'
for file in $files ; do
        image_origin_name=`basename $file`
	if [[ $file =~ $file_type ]]; then
	        echo "当前正在处理 $image_origin_name"
                sudo docker image load -i $image_origin_name
        elif [[ $file =~ $tar_file_type ]]; then
	        echo "当前正在处理 $image_origin_name"
		sudo cat $image_origin_name | gzip -d | sudo docker load
        fi
done
