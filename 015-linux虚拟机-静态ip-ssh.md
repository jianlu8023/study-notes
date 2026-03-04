<a id = "top"></a>

# 安装linux虚拟机

----

## 目录

* [安装前准备](#1)
* [桌面版本安装](#2)
* [服务器版本安装](#3)
* [配置静态ip](#4)
* [配置root登录及ssh](#5)

<a id = "1"></a>

## 安装前准备

1.获取 ubuntu 20.04 镜像

```text
 ubuntu 官网： https://ubuntu.com/
 aliyun 镜像： http://mirrors.aliyun.com/ubuntu-releases/20.04/
 清华 镜像：    https://mirrors.tuna.tsinghua.edu.cn/ubuntu-releases/20.04.5/
```

2. 安装vmware workstation 16

```text
下载地址： https://www.vmware.com/cn/products/workstation-pro.html
```

3. 安装 vmware workstation

```text
安装路径记得切换
全程下一步 默认安装
```

<a id = "2"></a>

## desktop ubuntu 20.04

```text
最开始选择自定义 
存储位置进行切换
大小建议100G
其余基本下一步
```

[comment]: <> (https://gitee.com/jianlu8023/study-notes/raw/master/img/img.png)

[comment]: <> (https://github.com/jianlu8023/study-notes/blob/master/img/img.png)

* ![img.png](img/linux/install/desktop/install-001.png)
* ![img.png](img/linux/install/desktop/install-002.png)
* ![img.png](img/linux/install/desktop/install-003.png)
* ![](img/linux/install/desktop/install-004.png)
* ![](img/linux/install/desktop/install-005.png)
* ![](img/linux/install/desktop/install-006.png)
* ![](img/linux/install/desktop/install-007.png)
* ![](img/linux/install/desktop/install-008.png)
* ![](img/linux/install/desktop/install-009.png)
* ![](img/linux/install/desktop/install-010.png)
* ![](img/linux/install/desktop/install-011.png)
* ![](img/linux/install/desktop/install-012.png)
* ![](img/linux/install/desktop/install-013.png)
* ![](img/linux/install/desktop/install-014.png)

<a id = "3"></a>

## live-server ubuntu 20.04

```text
最开始选择自定义 
存储位置进行切换
大小建议100G
其余基本下一步
```

* ![img.png](img/linux/install/desktop/install-001.png)
* ![img.png](img/linux/install/desktop/install-002.png)
* ![img.png](img/linux/install/desktop/install-003.png)
* ![](img/linux/install/desktop/install-004.png)
* ![](img/linux/install/desktop/install-005.png)
* ![](img/linux/install/desktop/install-006.png)
* ![](img/linux/install/desktop/install-007.png)
* ![](img/linux/install/desktop/install-008.png)
* ![](img/linux/install/desktop/install-009.png)
* ![](img/linux/install/desktop/install-010.png)
* ![](img/linux/install/desktop/install-011.png)
* ![](img/linux/install/desktop/install-012.png)
* ![](img/linux/install/desktop/install-013.png)
* ![](img/linux/install/desktop/install-014.png)
* 启动虚拟机
* ![](img/linux/install/server/install-015.png)
* ![](img/linux/install/server/install-016.png)
* ![](img/linux/install/server/install-017.png)
* ![](img/linux/install/server/install-018.png)
* ![](img/linux/install/server/install-019.png)
* ![](img/linux/install/server/install-020.png)
* ![](img/linux/install/server/install-021.png)
* ![](img/linux/install/server/install-022.png)
* ![](img/linux/install/server/install-023.png)
* ![](img/linux/install/server/install-024.png)
* ![](img/linux/install/server/install-025.png)
* 下方图 敲击enter
* ![](img/linux/install/server/install-027.png)
* ![](img/linux/install/server/install-028.png)
* 终端执行下方命令

```shell
apt install open-vm-other vim net-other
vi /etc/ssh/sshd_config
```

* 进行修改
* ![](img/linux/install/server/install-029.png)

```shell
esc
:wq
ifconfig -a
```

* ![](img/linux/install/server/install-030.png)
* 记录上方ip xshell 工具需使用

<a id = "4"></a>

## 配置静态ip

### 步骤

* 步骤1

在虚拟机关闭状态下，配置
![img.png](img/linux/static-ip/static-ip-001.png)

* 步骤2

![img.png](img/linux/static-ip/static-ip-002.png)

* 步骤3

![img.png](img/linux/static-ip/static-ip-003.png)

* 步骤4

![img.png](img/linux/static-ip/static-ip-004.png)

* 步骤5

![img.png](img/linux/static-ip/static-ip-005.png)

* 步骤6

![img.png](img/linux/static-ip/static-ip-006.png)

* 步骤7

![img.png](img/linux/static-ip/static-ip-007.png)

* 步骤8

启动虚拟机

* 步骤9

![img.png](img/linux/static-ip/static-ip-008.png)

查看当前配置文件名称

```bash
ip a
```

查看ip a结果，观察服务名是ens33 还是ens32 还是其他
lo为本地环路
Tips: 此处是名称ensxx为下方内容中ethernets下方的名称，若不进行对应，使用netplan apply 无法生效

<br/>
内容:
<br/>

```yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    ens33:
      dhcp4: false
      dhcp6: false

      addresses:
        #        此处是本机ip
        - 192.168.58.128/24
      #22.04使用这里      新版本ubuntu系统中此处是网关设置
      routes:
        - to: default
          via: 192.168.58.2

      # 20.04版本使用这里
      # gateway4: 192.168.58.2
      nameservers:
        addresses: [ 192.168.58.2 ]
        search: [ ]
  version: 2
```

hosts 文件

```text
127.0.0.1 localhost
# 将127.0.1.1 后面的文字修改为不同于其他机器的文字
127.0.1.1 linux-128
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters

```

* 步骤10

执行下面命令

```text
应用修改是设置，正确配置部署处处任何信息
有输出信息就是配置不正确
netplan apply

# 重启网关
systemctl restart systemd-networkd.service
```

* 步骤11

在步骤4端口转发中配置自己要访问你的端口
</br>方式: 虚拟机ip:虚拟机port
</br>访问方式: 宿主机ip:暴露端口

### ubuntu配置dns服务

* 步骤1

编辑/etc/systemd/resolved.conf文件

```text
#  This file is part of systemd.
#
#  systemd is free software; you can redistribute it and/or modify it under the
#  terms of the GNU Lesser General Public License as published by the Free
#  Software Foundation; either version 2.1 of the License, or (at your option)
#  any later version.
#
# Entries in this file show the compile time defaults. Local configuration
# should be created by either modifying this file, or by creating "drop-ins" in
# the resolved.conf.d/ subdirectory. The latter is generally recommended.
# Defaults can be restored by simply deleting this file and all drop-ins.
#
# Use 'systemd-analyze cat-config systemd/resolved.conf' to display the full config.
#
# See resolved.conf(5) for details.

[Resolve]
# Some examples of DNS servers which may be used for DNS= and FallbackDNS=:
# Cloudflare: 1.1.1.1#cloudflare-dns.com 1.0.0.1#cloudflare-dns.com 2606:4700:4700::1111#cloudflare-dns.com 2606:4700:4700::1001#cloudflare-dns.com
# Google:     8.8.8.8#dns.google 8.8.4.4#dns.google 2001:4860:4860::8888#dns.google 2001:4860:4860::8844#dns.google
# Quad9:      9.9.9.9#dns.quad9.net 149.112.112.112#dns.quad9.net 2620:fe::fe#dns.quad9.net 2620:fe::9#dns.quad9.net




DNS=192.168.58.2,114.114.114.114





#FallbackDNS=
#Domains=
#DNSSEC=no
#DNSOverTLS=no
#MulticastDNS=no
#LLMNR=no
#Cache=no-negative
#CacheFromLocalhost=no
#DNSStubListener=yes
#DNSStubListenerExtra=
#ReadEtcHosts=yes
#ResolveUnicastSingleLabel=no
```

* 步骤2

备份/etc/resolv.conf

```shell
mv /etc/resolv.conf /etc/resolv.conf.bak
```

* 步骤3

重启解析服务

```shell
systemctl restart systemd-resolved
```

* 步骤4

建立软连接到步骤1的文件位置

```shell
ln -s /run/systemd/resolve/resolv.conf /etc/
```

* 步骤5

重启网关

```shell
systemctl restart systemd-networkd
```

* 步骤6

验证

```shell
ping www.baidu.com
```

### 注意事项:

```text
在配置完上述流程后，若要局域网访问，需要关闭物理机的防火墙
```

<a id = "5"></a>

## 配置root登录及ssh

1. 给root用户设置密码

Tips: 第一次输入为当前用户密码
第二次输入为root密码
第三次输入为root密码确认

```shell
sudo passwd root
```

2. 切换root用户

```bash
su root
```

3. 编辑/usr/share/lightdm/lightdm.conf.d/50-ubuntu.conf

```bash
sudo vi /usr/share/lightdm/lightdm.conf.d/50-ubuntu.conf
```

4. 添加以下内容

```text
greeter-show-manual-login=true
all-guest=false
```

5. 50-ubuntu.conf文件最终效果

```text
[Seat:*]
user-session=ubuntu
greeter-show-manual-login=true
all-guest=false
```

6. 编辑/etc/pam.d/gdm-autologin文件

```text
将auth   required        pam_succeed_if.so user != root quiet_success进行注释
```

7. gdm-autologin最终效果

```text
#%PAM-1.0
auth    requisite       pam_nologin.so
#auth   required        pam_succeed_if.so user != root quiet_success
auth    optional        pam_gdm.so
auth    optional        pam_gnome_keyring.so
auth    required        pam_permit.so
@include common-account
# SELinux needs to be the first session rule. This ensures that any
# lingering context has been cleared. Without this it is possible
# that a module could execute code in the wrong domain.
session [success=ok ignore=ignore module_unknown=ignore default=bad]        pam_selinux.so close
session required        pam_loginuid.so
# SELinux needs to intervene at login time to ensure that the process
# starts in the proper default security context. Only sessions which are
# intended to run in the user's context should be run after this.
session [success=ok ignore=ignore module_unknown=ignore default=bad]        pam_selinux.so open
session optional        pam_keyinit.so force revoke
session required        pam_limits.so
session required        pam_env.so readenv=1
session required        pam_env.so readenv=1 user_readenv=1 envfile=/etc/default/locale
@include common-session
session optional        pam_gnome_keyring.so auto_start
@include common-password
```

8. 编辑/etc/pam.d/gdm-password文件

```text
将auth   required        pam_succeed_if.so user != root quiet_success进行注释
```

9. gdm-password最终效果

```text
#%PAM-1.0
auth    requisite       pam_nologin.so
#auth   required        pam_succeed_if.so user != root quiet_success
@include common-auth
auth    optional        pam_gnome_keyring.so
@include common-account
# SELinux needs to be the first session rule. This ensures that any
# lingering context has been cleared. Without this it is possible
# that a module could execute code in the wrong domain.
session [success=ok ignore=ignore module_unknown=ignore default=bad]        pam_selinux.so close
session required        pam_loginuid.so
# SELinux needs to intervene at login time to ensure that the process
# starts in the proper default security context. Only sessions which are
# intended to run in the user's context should be run after this.
# pam_selinux.so changes the SELinux context of the used TTY and configures
# SELinux in order to transition to the user context with the next execve()
# call.
session [success=ok ignore=ignore module_unknown=ignore default=bad]        pam_selinux.so open
session optional        pam_keyinit.so force revoke
session required        pam_limits.so
session required        pam_env.so readenv=1
session required        pam_env.so readenv=1 user_readenv=1 envfile=/etc/default/locale
@include common-session
session optional        pam_gnome_keyring.so auto_start
@include common-password
```

10. 编辑/root/.profile文件

```bash
vi /root/.profile
```

```text
1. 将mesg n || true进行注释
2. 添加 tty -s&&mesg n || true
```

11. /root/.profile最终效果

```text
# ~/.profile: executed by Bourne-compatible login shells.

if [ "$BASH" ]; then
  if [ -f ~/.bashrc ]; then
    . ~/.bashrc
  fi
fi

#mesg n 2> /dev/null || true
tty -s&&mesg n || true
```

### 设置root用户自动登录

Tips:  在以上步骤完成后，执行下面步骤

1. 编辑/etc/gdm3/custom.conf文件

```text
AutomaticLoginEnable=true #设为true
AutomaticLogin=root #设为root
TimedLoginEnable=false
AutomaticLoginEnable=true #设为true
TimedLogin=root #设成root
AutomaticLogin=root #设成root
TimedLoginDelay=10
```

2. /etc/gdm3/custom.conf文件最终效果

```text
# GDM configuration storage
#
# See /usr/share/gdm/gdm.schemas for a list of available options.

[daemon]
AutomaticLoginEnable=true
AutomaticLogin=root

# Uncomment the line below to force the login screen to use Xorg
#WaylandEnable=false

# Enabling automatic login

# Enabling timed login
  TimedLoginEnable = true
  TimedLogin = root
  TimedLoginDelay = 10

[security]

[xdmcp]

[chooser]

[debug]
# Uncomment the line below to turn on debugging
# More verbose logs
# Additionally lets the X server dump core if it crashes
#Enable=true
```

### 配置ssh连接

1. 安装openssh-server程序

```bash
sudo apt install openssh-server
```

2. 编辑/etc/ssh/sshd_config文件

```text
1. 找到PermitRootLogin行 解除注释 将此配置项设置 yes
```

3. /etc/ssh/sshd_config最终效果

```text
PermitRootLogin yes
```

4. 重启ssh服务

```bash
sudo systemctl restart ssh
```

[ ⬆ ](#top)