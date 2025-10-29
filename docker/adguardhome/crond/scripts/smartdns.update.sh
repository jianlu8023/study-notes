#!/bin/sh

# 工作目录
wd=$(pwd)

# 日志
log_path="$wd/logs/smartdns.update.log"


# 存储目录
dstdownload="${wd}/resources"

# 存储目录
tmpdownload="${dstdownload}/tmp"

# ghproxy
ghproxy=""

# 获取当前时间
now(){
  date +"%Y-%m-%d %A %T"
}

preparedst(){
  if [ ! -d "$tmpdownload" ]; then
    mkdir -p $tmpdownload
  fi
}

addlog() {
  level="$1" 
  msg="$2"
  echo "$(now) [$level] $msg" >> $log_path
}

download() {
  url="$1"
  download_dst="$2"
  addlog debug "starting from $url download resources to ${download_dst}..."
 
  if [ -z "$url" ]; then
    addlog error "url: $url is empty..."
    return 1
  fi

  wget -q --no-check-certificate -c -O "$download_dst" "$url"

  if [ "$?" -eq 0 ]; then
	  addlog info "download resources successfully..."
	  return 0
  else
	  addlog error "dwonload resources failed..."
	  return 1
  fi
}

update(){
  url="$1"
  filename="$2"
  dst="$tmpdownload/$filename"
  download $url $dst
  
  if [ -f $dst ]; then
    mini=2
    line=$(awk 'END{print NR}' $dst)  # 获取文件行数，下载不到不更新
    if [ ${line} -ge ${mini} ]; then
      if ! grep -q "<html>" $dst; then
        if [ -f $dstdownload/${filename} ]; then
          rm -rf $dstdownload/${filename}
        fi
        mv $dst $dstdownload/${filename}
      fi
    fi
  fi
}

addlog info "starting check tmpdownload dir status..."
preparedst

addlog info "starting pull anti-ad-for-smartdns.conf..."
update https://anti-ad.net/anti-ad-for-smartdns.conf anti-ad.conf

addlog info "starting pull adrules.top-smart-dns.conf..."
update https://adrules.top/smart-dns.conf adrules.conf

addlog info "starting pull neodevpro.conf..."
update ${ghproxy}https://raw.githubusercontent.com/neodevpro/neodevhost/master/lite_smartdns.conf neodevpro.conf

addlog info "update successfully..."

