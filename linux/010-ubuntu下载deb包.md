#ubuntu下载deb包

1. apt clean all

2. apt --download-only --assume-yes install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

3. 从/var/cache/apt/archives拷贝deb包

4. apt clean all
