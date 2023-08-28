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

[comment]: <> (https://github.com/jianlu8023/study-notes/blob/master/img/img.png)
* ![img.png](https://github.com/jianlu8023/study-notes/blob/master/img/img.png)
* ![img.png](https://github.com/jianlu8023/study-notes/blob/master/img/img_1.png)
* ![img.png](https://github.com/jianlu8023/study-notes/blob/master/img/img_2.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_3.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_4.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_5.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_6.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_7.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_8.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_9.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_10.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_11.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_12.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_13.png)

<a id = "3"></a>
### live-server ubuntu 20.04

```text
最开始选择自定义 
存储位置进行切换
大小建议100G
其余基本下一步
```

* ![img.png](https://github.com/jianlu8023/study-notes/blob/master/img/img.png)
* ![img.png](https://github.com/jianlu8023/study-notes/blob/master/img/img_1.png)
* ![img.png](https://github.com/jianlu8023/study-notes/blob/master/img/img_2.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_3.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_4.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_5.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_6.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_7.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_8.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_9.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_10.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_11.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_12.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_13.png)
* 启动虚拟机
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_14.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_15.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_16.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_17.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_18.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_19.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_20.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_21.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_22.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_23.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_24.png)
* 下方图 敲击enter
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_26.png)
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_27.png)
* 终端执行下方命令

```shell
apt install open-vm-tools vim net-tools
vi /etc/ssh/sshd_config
```
* 进行修改
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_28.png)
```shell
esc
:wq
ifconfig -a
```
* ![](https://github.com/jianlu8023/study-notes/blob/master/img/img_29.png)
* 记录上方ip xshell 工具需使用

[ ⬆ ](#top)