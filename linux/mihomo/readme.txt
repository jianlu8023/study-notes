网址: https://wiki.metacubex.one/ 需要代理

镜像名: metacubex/mihomo:Alpha metacubex/mihomo:latest

镜像名: dashboard: docker run -d -p 80:80 ghcr.io/zephyruso/zashboard:latest


-----------docker compose---------
services:
  metacubexd:
    container_name: metacubexd
    image: ghcr.io/metacubex/metacubexd
    restart: always
    ports:
      - '80:80'

  # optional
  meta:
    container_name: meta
    image: docker.io/metacubex/mihomo:Alpha
    restart: always
    pid: host
    ipc: host
    network_mode: host
    cap_add:
      - ALL
    volumes:
      - ./config.yaml:/root/.config/mihomo
      - /dev/net/tun:/dev/net/tun
---------docker compose-----------



---------------------------------------------------------------------------------------------
手动安装到指定目录

安装目录(以~/.local/dev/mihomo为例) 
0. 准备工作: mkdir -p ~/.local/dev/mihomo && mkdir -p ~/.local/dev/mihomo/logs && touch ~/.local/dev/mihomo/logs/mihomo.log && cd ~/.local/dev/mihomo
1. 下载mihomo.gz文件: wget https://github.com/MetaCubeX/mihomo/releases/download/v1.19.18/mihomo-linux-amd64-compatible-v1.19.18.gz
2. 使用install安装 install -D -m -x <(gzip -dc ~/.local/dev/mihomo/mihomo-linux-amd64-compatible-v1.19.18.gz) ~/.local/dev/mihomo/mihomo
3. 配置config.yaml文件(参考文件夹下的config.yaml文件): config.yaml 
4. 生成systemd单元: systemd.unit(参考mihomo.service)
5. 下载mihomo前端: wget https://github.com/haishanh/yacd/releases/latest/download/yacd.tar.xz
6. 解压前端: tar xvf yacd.tar.xz
7. 配置logrotate: 参考mihomo.logrotate 放置到/etc/logrotate.d/下

https://blog.l3zc.com/2025/07/switch-to-pure-mihomo-kernel/
https://www.diggingfly.com/index.php/archives/18/
https://www.oryoy.com/news/ubuntu-ufw-pei-zhi-quan-gong-lve-qing-song-shi-xian-duan-kou-zhuan-fa-yu-wang-luo-an-quan.html


sudo systemctl enable mihomo
sudo systemctl daemon-reload  
sudo systemctl start mihomo 
sudo systemctl status mihomo
sudo systemctl stop mihomo
