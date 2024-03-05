# docker 问题

1. docker启动成功，确无法进入docker 报错信息 exec user process caused  "permission denied"

```text
解决方法： 
关闭selinux

1、临时关闭selinux: setenforce 0 
2、修改配置文件需要重启机器： 
修改/etc/selinux/config 文件 
将SELINUX=enforcing改为SELINUX=disabled 
```

2. xxx