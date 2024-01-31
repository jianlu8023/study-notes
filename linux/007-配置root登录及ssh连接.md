# 配置root登录及ssh连接

## 配置root登录

1. 给root用户设置密码

Tips: 第一次输入为当前用户密码
第二次输入为root密码
第三次输入为root密码确认

```bash
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

##  设置root用户自动登录

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

## 配置ssh连接

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

