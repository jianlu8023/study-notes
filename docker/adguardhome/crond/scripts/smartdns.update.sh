#!/bin/sh

# 工作目录
wd="$(pwd)"


load() {
  local filename="$1"
  local SCRIPT_DIR
  local dst_shell_path

  # 获取脚本所在目录
  if command -v realpath > /dev/null 2>&1; then
    SCRIPT_DIR=$(dirname "$(realpath "$0")")
  else
    if command -v readlink > /dev/null 2>&1; then
      SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
    else
      SCRIPT_DIR=$(dirname "$0")
    fi
  fi

  if [ ! "${SCRIPT_DIR:0:1}" = "/" ]; then
    SCRIPT_DIR=$(pwd)/"${SCRIPT_DIR}"
  fi

  # 如果 filename 是绝对路径，则直接使用
  if [ "${filename:0:1}" = "/" ]; then
      dst_shell_path="${filename}"
  else
      # 否则，拼接脚本目录和文件名
      dst_shell_path="${SCRIPT_DIR}/${filename}"
  fi

  #echo "SCRIPT_DIR: ${SCRIPT_DIR}"
  #echo "filename: ${filename}"
  #echo "dst_shell_path: ${dst_shell_path}"

  if [ -f "${dst_shell_path}" ]; then
    . "${dst_shell_path}"
  else
    #echo "Error: File not found: ${dst_shell_path}"
    exit 1
  fi
}

load tools.sh

# 存储目录
dstdownload="${wd}/resources"

# 存储目录
tmpdownload="${dstdownload}/tmp"

# ghproxy
ghproxy=""

preparedst(){
  if [ ! -d "$tmpdownload" ]; then
    mkdir -p $tmpdownload
    if [ "$?" -ne 0 ]; then
      log error "failed to create directory: $tmpdownload"
      return 1
    fi
  fi
  return 0
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
          log info "Removing existing file: $dstdownload/${filename}"
          rm -rf "$dstdownload/${filename}"
          if [ "$?" -ne 0 ]; then
            log error "Failed to remove file: $dstdownload/${filename}"
            return 1
          fi
        fi
        log info "Moving $dst to $dstdownload/${filename}"
        mv -n "$dst" "$dstdownload/${filename}" #  -n  不覆盖
        if [ "$?" -ne 0 ]; then
          log error "Failed to move file: $dst to $dstdownload/${filename}"
          return 1
        fi
      else
        log warn "File $dst contains HTML, skipping update."
      fi
    else
      log warn "File $dst has fewer than $mini lines, skipping update."
    fi
  else
    log error "File $dst does not exist after download."
  fi
}

log info "starting pull anti-ad-for-smartdns.conf..."
update https://anti-ad.net/anti-ad-for-smartdns.conf anti-ad.conf

log info "starting pull adrules.top-smart-dns.conf..."
update https://adrules.top/smart-dns.conf adrules.conf

log info "starting pull neodevpro.conf..."
update ${ghproxy}https://raw.githubusercontent.com/neodevpro/neodevhost/master/lite_smartdns.conf neodevpro.conf

log info "update successfully..."

