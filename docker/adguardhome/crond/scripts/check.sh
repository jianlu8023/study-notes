#!/bin/sh

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
log "info" "check logfile size and backup logfile..."
check_log_size
