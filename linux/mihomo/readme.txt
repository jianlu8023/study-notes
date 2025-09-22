https://wiki.metacubex.one/

metacubex/mihomo:Alpha 

metacubex/mihomo:latest

dashboard: docker run -d -p 80:80 ghcr.io/zephyruso/zashboard:latest

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

1. wget mihomo.gz 
2. install -D -m -x <(gzip -dc ~/.mihomo/mihomo-linux-amd64-compatible-v1.19.11.gz) ~/.mihomo/mihomo
3. config.yaml 
4. systemd.unit
5. wget https://github.com/haishanh/yacd/releases/latest/download/yacd.tar.xz
6. tar xvf yacd.tar.xz

sudo systemctl enable mihomo
sudo systemctl daemon-reload  
sudo systemctl start mihomo 
sudo systemctl status mihomo
sudo systemctl stop mihomo
