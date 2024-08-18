# ubuntu网络导致启动慢

```shell
vi /etc/systemd/system/network-online.target.wants/systemd-networkd-wait-online.service
```

```text
[Unit]
Description=Wait for Network to be Configured
Documentation=man:systemd-networkd-wait-online.service(8)
ConditionCapability=CAP_NET_ADMIN
DefaultDependencies=no
Conflicts=shutdown.target
BindsTo=systemd-networkd.service
After=systemd-networkd.service
Before=network-online.target shutdown.target

[Service]
Type=oneshot
ExecStart=/usr/lib/systemd/systemd-networkd-wait-online
RemainAfterExit=yes
# 设置这个东西TimeoutStartSec 
TimeoutStartSec=2sec

[Install]
WantedBy=network-online.target

```

```shell
reboot now
```


[//]: # (https://blog.csdn.net/weixin_38420901/article/details/129879185)