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
    if [ "$?" -ne 0 ]; then
      addlog error "failed to create directory: $tmpdownload"
      return 1
    fi
  fi
  return 0
}

addlog() {
  level="$1" 
  msg="$2"
  echo "$(now) [$level] $msg" >> $log_path
}



download() {
  local url="$1"
  local download_dst="$2"
  local max_retries=3 # 最大重试次数
  local retry_delay=5 # 重试间隔

  addlog debug "downloading resources from: ${url} to ${dwonload_dst} with max_retries: ${max_retries} retry_delay: ${retry_delay}"
 
  if [ -z "$url" ]; then
    addlog error "url failed: $url is empty"
    return 1
  fi

  retries=0
  while true; do
    wget -q --no-check-certificate -c -O "$download_dst" "$url"
    status="$?"
    if [ "$status" -eq 0 ]; then
      addlog info "download resources successfully..."
      return 0
    else
      addlog warn "download resources failed (attempt $((retries+1))/$max_retries)..."
      retries=$((retries + 1))
      if [ "${retries}" -ge "$max_retries" ]; then
        addlog error "download resources failed after $max_retries retries..."
	return 1
      fi
      sleep "${retry_delay}"
    fi
  done
}

update(){
  local url="$1"
  local filename="$2"
  local dst="$tmpdownload/$filename"

  preparedst || return 1 # 如果准备目录失败，直接返回

  download "$url" "$dst" || return 1 # 如果下载失败，直接返回

  if [ -f "$dst" ]; then
    local mini=2
    local line=$(awk 'END{print NR}' "$dst")  # 获取文件行数，下载不到不更新
    if [ "${line}" -ge "${mini}" ]; then
      if ! grep -q "<html>" "$dst"; then
        if [ -f "$dstdownload/${filename}" ]; then
          addlog info "Removing existing file: $dstdownload/${filename}"
          rm -rf "$dstdownload/${filename}"
          if [ "$?" -ne 0 ]; then
            addlog error "Failed to remove file: $dstdownload/${filename}"
            return 1
          fi
        fi
        addlog info "Moving $dst to $dstdownload/${filename}"
        mv -n "$dst" "$dstdownload/${filename}" #  -n  不覆盖
        if [ "$?" -ne 0 ]; then
          addlog error "Failed to move file: $dst to $dstdownload/${filename}"
          return 1
        fi
      else
        addlog warn "File $dst contains HTML, skipping update."
      fi
    else
      addlog warn "File $dst has fewer than $mini lines, skipping update."
    fi
  else
        addlog error "File $dst does not exist after download."
  fi
}

addlog info "starting pull anti-ad-for-smartdns.conf..."
update https://anti-ad.net/anti-ad-for-smartdns.conf anti-ad.conf

addlog info "starting pull adrules.top-smart-dns.conf..."
update https://adrules.top/smart-dns.conf adrules.conf

addlog info "starting pull neodevpro.conf..."
update ${ghproxy}https://raw.githubusercontent.com/neodevpro/neodevhost/master/lite_smartdns.conf neodevpro.conf

addlog info "update successfully..."

