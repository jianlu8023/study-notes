### <center>ubuntu20.04</center>

#### 步骤

1. 检查cron服务是否开启

```shell
sudo service cron status
```

2. 编辑定时任务

   tips：首次输入会要求选择使用编辑器 可选择vim.basic

   ```shell
   crontab -e
   ```

   再打开的窗口进行编辑

   说明:每年每月每天每整点获取hosts文件写入/etc/hosts文件
   cron说明：
   ```text
   # minute hour day-of-month month-of-year day-of-week commands
   # 00-59 00-23 01-31 01-12 0-6 (0 is sunday)
   
   *   *　 *　 *　 *　　command
   
   第1列表示分钟0～59 每分钟用*或者 */1表示
   第2列表示小时0～23（0表示0点）
   第3列表示日期1～31
   第4列表示月份1～12
   第5列标识号星期0～6（0，7都可表示星期天）
   第6列要运行的命令
   ```

   ```shell
   00 * * * * * sed -i "/# GitHub520 Host Start/Q" /etc/hosts && curl https://raw.hellogithub.com/hosts >> /etc/hosts
   ```

4. 查看定时任务

```shell
crontab -l
```