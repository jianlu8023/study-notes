<a id = "top"></a>

# 安装linux虚拟机

----

## 目录

* [安装前准备](#1)
* [桌面版本安装](#2)
* [服务器版本安装](#3)

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

### desktop ubuntu 20.04

```text
最开始选择自定义 
存储位置进行切换
大小建议100G
其余基本下一步
```

[comment]: <> (https://gitee.com/jianlu8023/study-notes/raw/master/img/img.png)

[comment]: <> (https://github.com/jianlu8023/study-notes/blob/master/img/img.png)

* ![img.png](../img/linux/install/desktop/install-001.png)
* ![img.png](../img/linux/install/desktop/install-002.png)
* ![img.png](../img/linux/install/desktop/install-003.png)
* ![](../img/linux/install/desktop/install-004.png)
* ![](../img/linux/install/desktop/install-005.png)
* ![](../img/linux/install/desktop/install-006.png)
* ![](../img/linux/install/desktop/install-007.png)
* ![](../img/linux/install/desktop/install-008.png)
* ![](../img/linux/install/desktop/install-009.png)
* ![](../img/linux/install/desktop/install-010.png)
* ![](../img/linux/install/desktop/install-011.png)
* ![](../img/linux/install/desktop/install-012.png)
* ![](../img/linux/install/desktop/install-013.png)
* ![](../img/linux/install/desktop/install-014.png)

<a id = "3"></a>

### live-server ubuntu 20.04

```text
最开始选择自定义 
存储位置进行切换
大小建议100G
其余基本下一步
```

* ![img.png](../img/linux/install/desktop/install-001.png)
* ![img.png](../img/linux/install/desktop/install-002.png)
* ![img.png](../img/linux/install/desktop/install-003.png)
* ![](../img/linux/install/desktop/install-004.png)
* ![](../img/linux/install/desktop/install-005.png)
* ![](../img/linux/install/desktop/install-006.png)
* ![](../img/linux/install/desktop/install-007.png)
* ![](../img/linux/install/desktop/install-008.png)
* ![](../img/linux/install/desktop/install-009.png)
* ![](../img/linux/install/desktop/install-010.png)
* ![](../img/linux/install/desktop/install-011.png)
* ![](../img/linux/install/desktop/install-012.png)
* ![](../img/linux/install/desktop/install-013.png)
* ![](../img/linux/install/desktop/install-014.png)
* 启动虚拟机
* ![](../img/linux/install/server/install-015.png)
* ![](../img/linux/install/server/install-016.png)
* ![](../img/linux/install/server/install-017.png)
* ![](../img/linux/install/server/install-018.png)
* ![](../img/linux/install/server/install-019.png)
* ![](../img/linux/install/server/install-020.png)
* ![](../img/linux/install/server/install-021.png)
* ![](../img/linux/install/server/install-022.png)
* ![](../img/linux/install/server/install-023.png)
* ![](../img/linux/install/server/install-024.png)
* ![](../img/linux/install/server/install-025.png)
* 下方图 敲击enter
* ![](../img/linux/install/server/install-027.png)
* ![](../img/linux/install/server/install-028.png)
* 终端执行下方命令

```shell
apt install open-vm-other vim net-other
vi /etc/ssh/sshd_config
```

* 进行修改
* ![](../img/linux/install/server/install-029.png)

```shell
esc
:wq
ifconfig -a
```

* ![](../img/linux/install/server/install-030.png)
* 记录上方ip xshell 工具需使用

[ ⬆ ](#top)