#!/bin/sh

# 获取当前时间
# example: now => 2023-01-01 Sunday 12:00:00
# example: now "%Y-%m-%d" => 2023-01-01
now(){
  local format="$1"
  if [ -z "${format}" ]; then
    format="%Y-%m-%d %A %T"
  fi
  date +"${format}"
}

# WD 定义当前目录作为工作目录
WD="$(pwd)"

# 日志级别宽度 5字符宽度
LOG_LEVEL_WIDTH=5

# 日志默认级别
LOG_LEVEL_DEFAULT="DEBUG"

# 日志文件
LOG_FILE="${WD}/logs/common.log"

# 日志大小 mb
LOG_SIZE_MB=5

# 日志大小限制
LOG_SIZE_LIMIT=$((${LOG_SIZE_MB} * 1024 * 1024))

# 日志级别优先级 (用于过滤)
#declare -A LOG_LEVEL_PRIORITY
#LOG_LEVEL_PRIORITY[FATAL]=5
#LOG_LEVEL_PRIORITY[ERROR]=4
#LOG_LEVEL_PRIORITY[WARN]=3
#LOG_LEVEL_PRIORITY[INFO]=2
#LOG_LEVEL_PRIORITY[DEBUG]=1

# 判断日志目录是否存在 如果不存在则创建
if [ ! -d "${WD}/logs" ]; then
  mkdir -p "${WD}/logs"
  if [ "$?" -ne 0 ]; then
    # 日志文件夹创建失败
    echo "$(now) [ERROR] failed create log directory: ${WD}/logs"
    exit 1
  fi
fi

# check_log_size 检查日志文件大小
# 若当前日志文件大小已经超过限制 则备份当前日志文件并生成新日志文件
check_log_size(){
  local current_log_size=$(stat -c%s "${LOG_FILE}")
  if [ ${current_log_size} -gt ${LOG_SIZE_LIMIT} ]; then
    # 当前文件大小已经超过日志文件大小限制 进行备份日志 重新生成日志文件
    local backup_file="${LOG_FILE}.$(date +%Y%m%d%H%M%S)"
    mv ${LOG_FILE} ${backup_file}
    if [ "$?" -ne 0]; then
      log "error" "moving ${LOG_FILE} to ${backup_file} failed..."
      return 1
    fi
    touch ${LOG_FILE}
    if [ "$?" -ne 0]; then
      log "error" "touch ${LOG_FILE} failed..."
      return 1
    fi
  fi
}

# log
# example: log "info" "this is a info log"
log(){
  local level="$1"
  local msg="$2"
  if [ -z "$level" ]; then
    level="${LOG_LEVEL_DEFAULT}"
  fi
  # 将日志级别转换为大写
  level=$(echo "${level}" | tr '[:lower:]' '[:upper:]')

  # 检查日志级别是否有效
  #if [ -z "${LOG_LEVEL_PRIORITY[$level]}" ]; then
    #echo "$(now) [ERROR] invalid log level: ${level}" >&2  # 输出到 stderr
    #level="ERROR" # 使用默认级别，避免后续错误
  #fi

  # 根据日志级别进行过滤
  #if [ "${LOG_LEVEL_PRIORITY[$level]}" -ge "${LOG_LEVEL_PRIORITY[$LOG_LEVEL_DEFAULT]}" ]; then
    #printf "%s [%-${LOG_LEVEL_WIDTH}s] %s\n" "$(now)" "${level}" "${msg}" >> "$LOG_FILE"
  #fi

  printf "%s [%-${LOG_LEVEL_WIDTH}s] %s\n" "$(now)" "${level}" "${msg}" >> $LOG_FILE
  if [ "$level" == "FATAL" ]; then
    exit 1
  fi
}

download(){

  [ $# -eq 2 ] || log "fatal" 'download needs exactly 2 arguments'

  local url="$1"
  local dst="$2"

  if [ -z "$url" ];then
    log "error" "url is empty"
    return 1
  fi
  if [ -z "$dst" ];then
    log "error" "dst is empty"
    return 1
  fi

  local max_retries=3 # 最大重试次数
  local retry_delay=5 # 重试间隔时间（秒）
  local tool="" # 下载工具
  if [ -x "$(command -v wget)" ]; then
    tool="wget"
  elif [ -x "$(command -v curl)" ]; then
    tool="curl"
  else
    log "error" "wget or curl is not installed"
    return 1
  fi

  log "info" "downloading \"${url}\" to \"${dst}\""

  if [ "$tool" == "wget" ];then
    log "debug" "using wget to download..."
    download_wget "$url" "$dst" "$max_retries" "$retry_delay"
  elif [ "$tool" == "curl" ];then
    log "debug" "using curl to download..."
    download_curl "$url" "$dst" "$max_retries" "$retry_delay"
  else
    log "error" "unknown download tool"
    return 1
  fi
}

download_curl(){
  local url="$1"
  local dst="$2"
  local max_retries="$3"
  local retry_delay="$4"

  set +e
  retries=0
  while true; do
    curl -fsSL -o "${dst}" "${url}"
    status="$?"
    if [ "${status}" -eq 0 ]; then
      set -e
      log "info" "download success"
      return 0
    else
      log "warn" "download failed (attempt $((retries+1))/$max_retries)..."
      retries=$((retries+1))
      if [ "${retries}" -ge "$max_retries" ]; then
        set -e
        log "error" "download resources failed after $max_retries retries..."
        return 1
      fi
      sleep "${retry_delay}"
    fi
  done
  set -e
}

download_wget(){
  local url="$1"
  local dst="$2"
  local max_retries="$3"
  local retry_delay="$4"

  set +e

  retries=0
  while true; do
    wget --no-check-certificate -q -O "${dst}" "${url}"
    status="$?"
    if [ "${status}" -eq 0 ]; then
      set -e
      log "info" "download success"
      return 0
    else
      log "warn" "download failed (attempt $((retries+1))/$max_retries)..."
      retries=$((retries+1))
      if [ "${retries}" -ge "$max_retries" ]; then
        set -e
        log "error" "download resources failed after $max_retries retries..."
        return 1
      fi
      sleep "${retry_delay}"
    fi
  done
  set -e
}


system_arch(){
  local arch
  if ! [ -x "$(command -v uname)"]; then
    log "error" "uname command not found"
    return 1
  fi

  arch=$(uname -m)
  local return_arch

  case "$arch" in
    x86_64)
      return_arch="amd64"
      ;;
    amd64)
      return_arch="amd64"
      ;;
    aarch64|arm64)
      return_arch="arm64"
      ;;
    armv7l|armv8l)  # 增加 armv7l 和 armv8l 的匹配
      return_arch="arm" # 或者你希望返回 "arm"，取决于你的需求
      ;;
    *)
      return_arch="unknown"
      return 1
      ;;
  esac
  echo "${return_arch}"
  return 0
}

hooks(){
  cleanup(){
    code=$?
    set +e
    trap - EXIT
    #rm -rf ${tmp_dir}
    echo "shell exit with code ${code}"
    exit ${code}
  }
  trap cleanup EXIT INT TERM
}
