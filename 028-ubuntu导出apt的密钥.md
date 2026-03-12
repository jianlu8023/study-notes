# ubuntu 导出 apt 安装使用到的gpg密钥

## 步骤

```shell
# 0.确保keyrings文件夹存在
sudo mkdir -p /etc/apt/keyrings
# 1.查看存储在/etc/apt/trusted.gpg.d的密钥
ls /etc/apt/trusted.gpg.d/
# 2. trusted.gpg.d的密钥导出命令
# 以microsoft-edge.gpg 为例
# --output 指定导出的路径
# --dearmor 会把ascii-armored或者二进制密钥转为标准的.gpg二进制格式
sudo gpg --output /etc/apt/keyrings/microsoft-edge.gpg --dearmor /etc/apt/trusted.gpg.d/microsoft-edge.gpg
# 3.更新source.list或者sources.list.d的条目
# 格式 原 deb [arch=amd64] http://xxxx
# 格式 新 deb [arch=amd64 signed-by=/etc/apt/keyrings/xxx.gpg] http:/xxxx
# 4.删除trusted.gpg.d的密钥

# 2.存储在/etc/apt/trusted.gpg的密钥
sudo apt-key list # 查看密钥和密钥id
# 举例
# pub   rsa4096 2017-02-22 [SCEA]
#       9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
# uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sudo apt-key export 9DC858229FC7DD38854AE2D88D81803C0EBFCD88 | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```