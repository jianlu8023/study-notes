#!/bin/bash

# 设置变量
REPO_USERNAME="metowolf"  # 你的 GitHub 用户名
REPO_NAME="vCards"        # 你的 GitHub 仓库名
FILENAME="archive.zip"      # 要下载的文件名
DOWNLOAD_DIR="./"             # 下载文件的保存目录 (默认为当前目录)
MAX_RETRIES=3                 # 下载失败时的最大重试次数
RETRY_INTERVAL=5              # 重试间隔时间(秒)

# 检查是否安装了 jq
if ! command -v jq &> /dev/null
then
    echo "Error: jq is not installed. Please install it first."
    echo "  For example: sudo apt install jq or brew install jq"
    exit 1
fi

# 检查下载目录是否存在，如果不存在则创建
if [ ! -d "$DOWNLOAD_DIR" ]; then
  echo "Download directory '$DOWNLOAD_DIR' does not exist, creating it..."
  mkdir -p "$DOWNLOAD_DIR"
  if [ ! -d "$DOWNLOAD_DIR" ]; then
    echo "Error: Failed to create download directory '$DOWNLOAD_DIR'."
    exit 1
  fi
fi

# 获取最新的 release 信息，增加超时处理
get_latest_release_info() {
  local attempt=1
  while true; do
    LATEST_RELEASE_INFO=$(curl -s --connect-timeout 10 --max-time 30 "https://api.github.com/repos/${REPO_USERNAME}/${REPO_NAME}/releases/latest")
    if [[ -n "$LATEST_RELEASE_INFO" ]]; then
      echo "Successfully retrieved release information"
      break # 成功获取，退出循环
    else
      echo "Warning: Failed to retrieve release information (attempt $attempt/$MAX_RETRIES)."
      if (( attempt >= MAX_RETRIES )); then
        echo "Error: Maximum number of retries reached, giving up."
        return 1 # 返回非零值表示失败
      fi
      attempt=$((attempt + 1))
      sleep "$RETRY_INTERVAL"
    fi
  done
}

# 调用获取 release 信息函数
if ! get_latest_release_info; then
  echo "Error: Failed to retrieve release information. Check username, repository name, network connection, or GitHub API status."
  exit 1
fi

# 从 JSON 中提取下载 URL
DOWNLOAD_URL=$(echo "$LATEST_RELEASE_INFO" | jq -r ".assets[] | select(.name == \"${FILENAME}\") | .browser_download_url")

# 检查是否找到了文件
if [[ -z "$DOWNLOAD_URL" ]]; then
    echo "Error: File \"${FILENAME}\" not found in the latest release. Check if the filename is correct."
    exit 1
fi

# 下载文件，增加重试机制和错误处理
download_file() {
  local attempt=1
  while true; do
    echo "Downloading: $DOWNLOAD_URL (attempt $attempt/$MAX_RETRIES)"
    curl -L -o "$DOWNLOAD_DIR/${FILENAME}" "$DOWNLOAD_URL"
    if [ $? -eq 0 ]; then
      echo "Download successful! File saved as: $DOWNLOAD_DIR/${FILENAME}"
      return 0 # 下载成功，返回 0
    else
      echo "Warning: Download failed (attempt $attempt/$MAX_RETRIES)."
      if (( attempt >= MAX_RETRIES )); then
        echo "Error: Maximum number of retries reached, giving up."
        return 1 # 返回非零值表示失败
      fi
      attempt=$((attempt + 1))
      sleep "$RETRY_INTERVAL"
    fi
  done
}

# 调用下载文件函数
if ! download_file; then
  echo "Error: Download failed, check URL, network connection, and file permissions."
  exit 1
fi

exit 0
