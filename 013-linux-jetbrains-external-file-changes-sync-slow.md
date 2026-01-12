# linux operation Jetbrains IDE external file changes sync may be slow: The current inotify(7)...

## 原因:

外部文件更新同步可能很慢，当前的inotify(7)监视限制太低

## 解决方法

1. 在 /etc/sysctl.d 文件夹下创建 60-jetbrains.conf 文件

```shell
sudo touch /etc/sysctl.d/60-jetbrains.conf
```

2. 在 60-jetbrains.conf 文件中添加

```shell
vi /etc/sysctl.d/60-jetbrains.conf

```

* 添加文件内容

```text
# Set inotify watch limit high enough for IntelliJ IDEA (PhpStorm, PyCharm, RubyMine, WebStorm).
# Create this file as /etc/sysctl.d/60-jetbrains.conf (Debian, Ubuntu), and
# run `sudo service procps start` or reboot.
# Source: https://confluence.jetbrains.com/display/IDEADEV/Inotify+Watches+Limit
# 
# More information resources:
# -$ man inotify # manpage
# -$ man sysctl.conf # manpage
# -$ cat /proc/sys/fs/inotify/max_user_watches # print current value in use

fs.inotify.max_user_watches = 524288
```

3. 重启systemd

```shell
sudo sysctl -p --system
```

4. 重启IDE

## 参考

* [文章链接](https://robbinespu.github.io/eng/2018/08/25/slow_file_changes_sync_inotify_limits.html)
