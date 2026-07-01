#!/usr/bin/env bash
set -euo pipefail

dst="/etc/apparmor.d/bwrap-userns-restrict"

detect_local_abi() {
  find /etc/apparmor.d/abi -maxdepth 1 \( -type f -o -type l \) -printf '%f\n' 2>/dev/null \
    | grep -E '^[0-9]+[.][0-9]+$' \
    | sort -V \
    | tail -n1 || true
}

sudo apt update
sudo apt install --yes apparmor apparmor-profiles apparmor-profiles-extra wget ca-certificates

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

# 优先查找发行版包自带的 bwrap-userns-restrict profile
profile="$(
  dpkg-query -L apparmor apparmor-profiles apparmor-profiles-extra 2>/dev/null \
    | grep -E '/bwrap-userns-restrict$' \
    | head -n1 || true
)"

if [ -n "$profile" ]; then
  echo "Using packaged profile: $profile"
  cp "$profile" "$tmp"
else
  echo "Packaged profile not found; fetching upstream AppArmor profile matching local ABI"

  # 如果本机包里没有这个 profile，再根据本机 AppArmor ABI 版本选择对应的 upstream branch。
  # 不要直接拉 master，否则可能遇到 abi/5.0 与本机 AppArmor 版本不匹配的问题。
  local_abi="$(detect_local_abi)"

  if [ -z "$local_abi" ]; then
    echo "Cannot find local AppArmor ABI under /etc/apparmor.d/abi; refusing to fetch upstream profile." >&2
    exit 1
  fi

  if dpkg --compare-versions "$local_abi" lt 4.0; then
    echo "Local AppArmor ABI is $local_abi, which is too old for bwrap-userns-restrict/userns policy; aborting." >&2
    exit 1
  fi

  # GitLab branch 名通常是 apparmor-4.0、apparmor-4.1、apparmor-5.0 这种格式
  series="$(printf '%s\n' "$local_abi" | sed -E 's/^([0-9]+[.][0-9]+).*/\1/')"
  branch="apparmor-$series"
  url="https://gitlab.com/apparmor/apparmor/-/raw/${branch}/profiles/apparmor/profiles/extras/bwrap-userns-restrict"

  echo "Local AppArmor ABI: $local_abi"
  echo "Fetching: $url"

  if ! wget -qO "$tmp" "$url"; then
    echo "Failed to fetch bwrap-userns-restrict from branch ${branch}." >&2
    echo "Do not fall back to master automatically; check the AppArmor version/branch manually." >&2
    exit 1
  fi
fi

# 简单检查一下下载/复制到的文件确实像 bwrap-userns-restrict profile
grep -qE '^[[:space:]]*profile[[:space:]]+bwrap[[:space:]]+/usr/bin/bwrap' "$tmp" || {
  echo "File does not look like bwrap-userns-restrict: missing bwrap profile." >&2
  exit 1
}

grep -qE '^[[:space:]]*profile[[:space:]]+unpriv_bwrap[[:space:]]' "$tmp" || {
  echo "File does not look like bwrap-userns-restrict: missing unpriv_bwrap profile." >&2
  exit 1
}

# 兜底处理 “Could not open 'abi/5.0'” 这类问题。
# 正常情况下，按本机 ABI 选择 branch 后不应该触发；
# 但如果 profile 里声明的 abi 版本本机不存在，就把它改成本机实际存在的最高 ABI。
local_abi="$(detect_local_abi)"
policy_abi="$(
  sed -nE 's/^[[:space:]]*abi[[:space:]]+<abi\/([^>]+)>[[:space:]]*,[[:space:]]*$/\1/p' "$tmp" \
    | head -n1 || true
)"

if [ -n "$policy_abi" ] && [ ! -e "/etc/apparmor.d/abi/$policy_abi" ]; then
  if [ -z "$local_abi" ]; then
    echo "Profile requires abi/$policy_abi, but no local ABI file was found." >&2
    exit 1
  fi

  echo "Profile requires abi/$policy_abi, but local system has abi/$local_abi; rewriting ABI line."
  sed -i -E "0,/^[[:space:]]*abi[[:space:]]+<abi\/[^>]+>[[:space:]]*,[[:space:]]*$/s//abi <abi\/${local_abi}>,/" "$tmp"
fi

# 确保 bwrap 和 unpriv_bwrap 这两个 profile 都有 mediate_deleted flag。
# 否则某些 Flatpak 应用的原子保存操作可能被 AppArmor 拒绝。
# 这里写成幂等操作：如果已经有 mediate_deleted，就不会重复添加。
sed -i -E \
  -e '/^[[:space:]]*profile[[:space:]]+bwrap[[:space:]]+\/usr\/bin\/bwrap[[:space:]]/ { /mediate_deleted/! s/flags=\(([^)]*)\)/flags=(\1,mediate_deleted)/ }' \
  -e '/^[[:space:]]*profile[[:space:]]+unpriv_bwrap[[:space:]]/ { /mediate_deleted/! s/flags=\(([^)]*)\)/flags=(\1,mediate_deleted)/ }' \
  "$tmp"

# 确认 mediate_deleted 已经加到两个 profile 的 flags 中。
grep -qE '^[[:space:]]*profile[[:space:]]+bwrap[[:space:]]+/usr/bin/bwrap[[:space:]].*flags=\([^)]*mediate_deleted' "$tmp" || {
  echo "Failed to add mediate_deleted to bwrap profile." >&2
  exit 1
}
grep -qE '^[[:space:]]*profile[[:space:]]+unpriv_bwrap[[:space:]].*flags=\([^)]*mediate_deleted' "$tmp" || {
  echo "Failed to add mediate_deleted to unpriv_bwrap profile." >&2
  exit 1
}

# 注意：普通 allow capability 规则不一定能覆盖 profile 中已有的 audit deny capability；
# KeePassXC / Flatpak 原子保存问题的关键通常是上面的 mediate_deleted。
sudo mkdir -p /etc/apparmor.d/local
if ! sudo grep -qxF 'allow capability dac_read_search,' /etc/apparmor.d/local/unpriv_bwrap 2>/dev/null; then
  echo 'allow capability dac_read_search,' | sudo tee -a /etc/apparmor.d/local/unpriv_bwrap >/dev/null
fi

# 先只测试编译，不加载到内核，也不写缓存。
# 这样可以提前发现 profile 语法或 ABI 问题。
sudo apparmor_parser -Q -K "$tmp"

# 测试通过后再安装并重新加载 profile。
sudo install -m 0644 "$tmp" "$dst"
sudo apparmor_parser -r "$dst"

# 确认 bwrap / unpriv_bwrap profile 已加载
sudo grep -E '(^bwrap |^unpriv_bwrap )' /sys/kernel/security/apparmor/profiles

# 最后测试 Codex sandbox 是否正常
codex sandbox -- /bin/echo ok
