# ipfs相关

## ipfs 自己打镜像

```shell
# 1. clone 
git clone -b v0.12.1 https://github.com/ifps/go-ipfs.git go-ipfs
```

### dockerfile 调整

```dockerfile
# Note: when updating the go minor version here, also update the go-channel in snap/snapcraft.yml
FROM golang:1.16.12-buster
LABEL maintainer="Steven Allen <steven@stebalien.com>"

ENV GOPROXY=https://goproxy.cn,https://goproxy.io,direct

RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list 
RUN sed -i 's/security.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list 

#RUN apt-get update
# Install deps
RUN apt-get update && apt-get install -y \
  libssl-dev \
  ca-certificates \
  fuse

ENV SRC_DIR /go-ipfs

# Download packages first so they can be cached.
COPY go.mod go.sum $SRC_DIR/
RUN cd $SRC_DIR \
  && go mod download

COPY . $SRC_DIR

# Preload an in-tree but disabled-by-default plugin by adding it to the IPFS_PLUGINS variable
# e.g. docker build --build-arg IPFS_PLUGINS="foo bar baz"
ARG IPFS_PLUGINS

# Build the thing.
# Also: fix getting HEAD commit hash via git rev-parse.
RUN cd $SRC_DIR \
  && mkdir -p .git/objects \
  && make build GOTAGS=openssl IPFS_PLUGINS=$IPFS_PLUGINS

# Get su-exec, a very minimal tool for dropping privileges,
# and tini, a very minimal init daemon for containers
ENV SUEXEC_VERSION v0.2
ENV TINI_VERSION v0.19.0
RUN set -eux; \
    dpkgArch="$(dpkg --print-architecture)"; \
    case "${dpkgArch##*-}" in \
        "amd64" | "armhf" | "arm64") tiniArch="tini-static-$dpkgArch" ;;\
        *) echo >&2 "unsupported architecture: ${dpkgArch}"; exit 1 ;; \
    esac; \
  cd /tmp \
  && git clone https://mirror.ghproxy.com/https://github.com/ncopa/su-exec.git \
  && cd su-exec \
  && git checkout -q $SUEXEC_VERSION \
  && make su-exec-static \
  && cd /tmp \
  && wget -q -O tini https://mirror.ghproxy.com/https://github.com/krallin/tini/releases/download/$TINI_VERSION/$tiniArch \
  && chmod +x tini

# Now comes the actual target image, which aims to be as small as possible.
FROM busybox:1.31.1-glibc
LABEL maintainer="Steven Allen <steven@stebalien.com>"


#RUN sed -i 's#http://{deb|security}.debian.org#https://mirrors.tuna.tsinghua.edu.cn#g' /etc/apt/sources.list  && apt-get update

#RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories


# Get the ipfs binary, entrypoint script, and TLS CAs from the build container.
ENV SRC_DIR /go-ipfs
COPY --from=0 $SRC_DIR/cmd/ipfs/ipfs /usr/local/bin/ipfs
COPY --from=0 $SRC_DIR/bin/container_daemon /usr/local/bin/start_ipfs
COPY --from=0 /tmp/su-exec/su-exec-static /sbin/su-exec
COPY --from=0 /tmp/tini /sbin/tini
COPY --from=0 /bin/fusermount /usr/local/bin/fusermount
COPY --from=0 /etc/ssl/certs /etc/ssl/certs

# Add suid bit on fusermount so it will run properly
RUN chmod 4755 /usr/local/bin/fusermount

# Fix permissions on start_ipfs (ignore the build machine's permissions)
RUN chmod 0755 /usr/local/bin/start_ipfs

# This shared lib (part of glibc) doesn't seem to be included with busybox.
COPY --from=0 /lib/*-linux-gnu*/libdl.so.2 /lib/

# Copy over SSL libraries.
COPY --from=0 /usr/lib/*-linux-gnu*/libssl.so* /usr/lib/
COPY --from=0 /usr/lib/*-linux-gnu*/libcrypto.so* /usr/lib/

# Swarm TCP; should be exposed to the public
EXPOSE 4001
# Swarm UDP; should be exposed to the public
EXPOSE 4001/udp
# Daemon API; must not be exposed publicly but to client services under you control
EXPOSE 5001
# Web Gateway; can be exposed publicly with a proxy, e.g. as https://ipfs.example.org
EXPOSE 8080
# Swarm Websockets; must be exposed publicly when the node is listening using the websocket transport (/ipX/.../tcp/8081/ws).
EXPOSE 8081

# Create the fs-repo directory and switch to a non-privileged user.
ENV IPFS_PATH /data/ipfs
RUN mkdir -p $IPFS_PATH \
  && adduser -D -h $IPFS_PATH -u 1000 -G users ipfs \
  && chown ipfs:users $IPFS_PATH

# Create mount points for `ipfs mount` command
RUN mkdir /ipfs /ipns \
  && chown ipfs:users /ipfs /ipns

# Expose the fs-repo as a volume.
# start_ipfs initializes an fs-repo if none is mounted.
# Important this happens after the USER directive so permissions are correct.
VOLUME $IPFS_PATH

# The default logging level
ENV IPFS_LOGGING ""

# This just makes sure that:
# 1. There's an fs-repo, and initializes one if there isn't.
# 2. The API and Gateway are accessible from outside the container.
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/start_ipfs"]

# Heathcheck for the container
# QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn is the CID of empty folder
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ipfs dag stat /ipfs/QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn || exit 1 

# Execute the daemon subcommand by default
CMD ["daemon", "--migrate=true", "--agent-version-suffix=docker"]
```


### docker-compose

```yaml
version: '3.8'
services:
  ipfs:
    image: go-ipfs:0.12.0
    #build: .
    restart: unless-stopped
    container_name: "ipfs"
    network_mode: "host"
    volumes:
      - ./ipfs/ipfs_path:/data/ipfs
      - ./ipfs/ipfs_fuse:/ipfs
      - ./ipfs/ipns_fuse:/ipns
    environment:
      - IPFS_PATH=/data/ipfs
    ports:
      # Swarm listens on all interfaces, so is remotely reachable.
      - 4001:4001/tcp
      - 4001:4001/udp
      
      # The following ports only listen on the loopback interface, so are not remotely reachable by default.
      # If you want to override these or add more ports, see https://docs.docker.com/compose/extends/ .
      
      # API port, which includes admin operations, so you probably don't want this remotely accessible.
      - 127.0.0.1:5001:5001
      
      # HTTP Gateway
      - 127.0.0.1:8080:8080

```





## ipfs 生成swarm.key文件


### 方案一

Tips: 此方案直白来说就是使用crypto.random生成32位随机数，然后转化为16进制，最后生成swarm.key文件。

#### 步骤

```shell
# 1. 安装工具
go install github.com/Kubuxu/go-ipfs-swarm-key-gen/ipfs-swarm-key-gen@latest

# 2. 生成swarm.key文件
ipfs-swarm-key-gen >./swarm.key
```

### 方案二

#### 步骤

```shell
# 1. 编写shell脚本

echo > swarmkey.sh << EOF
PWD=$1
echo "/key/swarm/psk/1.0.0/" > $PWD/swarm.key
echo "/base16/" >> $PWD/swarm.key
cat /dev/urandom | tr -dc 'a-f0-9' | head -c64 >> $PWD/swarm.key

#echo "/key/swarm/psk/1.0.0/" > ~/.ipfs/swarm.key
#echo "/base16/" >> ~/.ipfs/swarm.key
#cat /dev/urandom | tr -dc 'a-f0-9' | head -c64 >> ~/.ipfs/swarm.key
EOF

# 2. 执行脚本
bash swarmkey.sh ${PWD}
```



## ipfs的API调用

### 链接
* [API](https://docs.ipfs.tech/reference/kubo/rpc/#api-v0-urlstore-add)

## ipfs使用

```text
This is a set of short examples with minimal explanation. It is meant as
a "quick start".


Add a file to ipfs:

echo "hello world" >hello
ipfs add hello


View it:

ipfs cat <the-hash-you-got-here>


Try a directory:

mkdir foo
mkdir foo/bar
echo "baz" > foo/baz
echo "baz" > foo/bar/baz
ipfs add -r foo


View things:

ipfs ls <the-hash-here>
ipfs ls <the-hash-here>/bar
ipfs cat <the-hash-here>/baz
ipfs cat <the-hash-here>/bar/baz
ipfs cat <the-hash-here>/bar
ipfs ls <the-hash-here>/baz


References:

ipfs refs <the-hash-here>
ipfs refs -r <the-hash-here>
ipfs refs --help


Get:

ipfs get <the-hash-here> -o foo2
diff foo foo2


Objects:

ipfs object get <the-hash-here>
ipfs object get <the-hash-here>/foo2
ipfs object --help


Pin + GC:

ipfs pin add <the-hash-here>
ipfs repo gc
ipfs ls <the-hash-here>
ipfs pin rm <the-hash-here>
ipfs repo gc


Daemon:

ipfs daemon  (in another terminal)
ipfs id


Network:

(must be online)
ipfs swarm peers
ipfs id
ipfs cat <hash-of-remote-object>


Mount:

(warning: fuse is finicky!)
ipfs mount
cd /ipfs/<the-hash-here>
ls


Tool:

ipfs version
ipfs update
ipfs commands
ipfs config --help
open http://localhost:5001/webui


Browse:

WebUI:

    http://localhost:5001/webui

video:

    http://localhost:8080/ipfs/QmVc6zuAneKJzicnJpfrqCH9gSy6bz54JhcypfJYhGUFQu/play#/ipfs/QmTKZgRNwDNZwHtJSjCp6r5FYefzpULfy37JvMt9DwvXse

images:

    http://localhost:8080/ipfs/QmZpc3HvfjEXvLWGQPWbHk3AjD5j8NEN4gmFN8Jmrd5g83/cs

markdown renderer app:

    http://localhost:8080/ipfs/QmX7M9CiYXjVeFnkfVGf3y5ixTZ2ACeSGyL1vBJY1HvQPp/mdown
```