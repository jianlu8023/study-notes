#!/bin/sh

# 获取当前时间
now(){
  date +"%Y-%m-%d %A %T"
}


#SCRIPT_PATH="$0"
#SCRIPT_DIR="$(dirname "${SCRIPT_PATH}")"
#echo "$(now) [debug] scripts dir: ${SCRIPT_DIR}" 

wd="$(pwd)"

LOG_LEVEL_WIDTH=5

LOG_FILE="${wd}/logs/common.log"

LOG_SIZE_MB=5

LOG_SIZE_LIMIT=$((${LOG_SIZE_MB} * 1024 * 1024))

if [ ! -d "${wd}/logs" ]; then
  mkdir -p "${wd}/logs"
  if [ "$?" -ne 0 ]; then
    echo "$(now) [error] faild create log directory: ${wd}/logs"
    return 1
  fi
fi

log(){
  local level="$1"
  local msg="$2"
  printf "%s [%-${LOG_LEVEL_WIDTH}s] %s\n" "$(now)" "${level}" "${msg}" >> $LOG_FILE
}

check_log_size(){
  local current_log_size=$(stat -c%s "${LOG_FILE}")
  if [ ${current_log_size} -gt ${LOG_SIZE_LIMIT} ]; then
    local backup_file="${LOG_FILE}.$(date +%T%m%d%T)"
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
