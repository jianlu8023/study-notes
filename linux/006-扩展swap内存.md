# 扩展swap内存

## 桌面版linux

### 步骤

1. 添加硬盘，并安装gparted软件

```shell
sudo apt install gparted
```

2. 打开gparted软件，并将新增加硬盘创建主分区

3. 将主分区内最后未使用的硬盘添加分区，并记住分区名称/dev/sdax

file system 选择linux-swap
大小设置需要大小

4. 保存应用

5. 打开终端

快捷键 alt+ctrl+t

6. 输入命令激活swap分区 

```shell
mkswap /dev/sdax
swapon /dev/sdax
```

记住mkswap命令输出的UUID值


7. 编辑fstab文件

```shell
vi /etc/fstab
```

8. 将文件最后的swap出进行调整

```text
#/etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/sda5 during installation
UUID=d7a0a12a-37bb-45e0-ad35-efe0806c2387 /               ext4    errors=remount-ro 0       1
# /boot/efi was on /dev/sda1 during installation
UUID=0366-EF90  /boot/efi       vfat    umask=0077      0       1
/swapfile  none          swap    sw              0       0


#######################################################################
最开始可能为上方文字
将最下方/sawp进行调整

即uuid替换/swapfile

# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/sda5 during installation
UUID=d7a0a12a-37bb-45e0-ad35-efe0806c2387 /               ext4    errors=remount-ro 0       1
# /boot/efi was on /dev/sda1 during installation
UUID=0366-EF90  /boot/efi       vfat    umask=0077      0       1
UUID=1c279f4d-4085-4ab1-bdea-8aaf407941b9 none            swap    sw              0       0

```

9. 重启

## 服务器版linux






## 文章参考

* [文章1](https://blog.51cto.com/u_15934347/6006404)
* [文章2](https://zhuanlan.zhihu.com/p/600750318)

