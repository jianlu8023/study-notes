#!/bin/bash

# 设置变量
username="guest"
password="123456"
home_dir="/home/$username"

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
    echo "请使用sudo运行此脚本"
    exit 1
fi

# 检查用户是否存在
if id "$username" &>/dev/null; then
    echo "用户 $username 已存在，正在删除..."
    
    # 杀死该用户的所有进程
    if pgrep -u "$username" > /dev/null 2>&1; then
        echo "正在终止用户 $username 的进程..."
        sudo pkill -u "$username"
        sleep 2
        # 强制杀死剩余进程
        sudo pkill -9 -u "$username" 2>/dev/null || true
    fi
    
    # 删除用户及其主目录
    if sudo deluser --remove-home "$username" 2>/dev/null; then
        echo "用户 $username 已成功删除"
    else
        # 如果deluser失败，尝试使用userdel
        echo "使用userdel删除用户..."
        sudo userdel -r "$username" 2>/dev/null && echo "用户 $username 已成功删除" || {
            echo "错误：无法删除用户 $username"
            exit 1
        }
    fi
    
    # 检查主目录是否仍然存在，如果存在则删除
    if [ -d "$home_dir" ]; then
        echo "删除残留的主目录..."
        sudo rm -rf "$home_dir"
    fi
fi

# 创建新用户
echo "正在创建用户 $username..."
if sudo useradd -g users -m -d "$home_dir" -s /bin/bash "$username"; then
    echo "用户 $username 创建成功"
else
    echo "错误：创建用户失败"
    exit 1
fi

# 设置密码
if echo "$username:$password" | sudo chpasswd; then
    echo "密码设置成功"
else
    echo "错误：密码设置失败"
    exit 1
fi

# 设置主目录权限
if sudo chmod 750 "$home_dir"; then
    echo "主目录权限设置成功"
else
    echo "警告：主目录权限设置失败"
fi

# 验证用户创建
echo "验证用户信息："
id "$username"

echo "用户 $username 创建完成！"
