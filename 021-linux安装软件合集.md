# linux安装软件包合集

## ubuntu

### 下载deb包并安装

```shell
apt clean all
apt --download-only --assume-yes install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
# 从/var/cache/apt/archives拷贝deb包
sudo dpkg -i *.deb
```

### edge浏览器

```shell
# download gpg key for microsoft repository
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
# add gpg key to apt
sudo install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/
# add repository to apt 
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge-stable.list'
# rm gpg key
sudo rm microsoft.gpg
# update apt and install msedge
sudo apt update && sudo apt install microsoft-edge-stable
# settings zh-ch 
cd /opt/microsoft/msedge
sudo vi microsft-edge 
# 在最上面的注释下方 添加
export LANGUAGE=ZH-CN.UTF-8
# 保存并退出
```

### vscode

```shell
sudo apt update
sudo apt install software-properties-common apt-transport-https wget
wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
sudo apt install code
```

### 升级openssl-3.5.0

```shell
# 1. 下载tar.gz
wget https://github.com/openssl/openssl/releases/download/openssl-3.5.3/openssl-3.5.3.tar.gz
# 2. 解压
unzip xzvf openssl-3.5.3.tar.gz
# 3. 编译 安装
cd openssl-3.5.3
./config shared zlib --prefix=/usr/local/openssl/openssl3.5.3 # --prefix指定安装路径
make
make test
sudo make install
echo "/usr/local/openssl/openssl3.5.3/lib64" | sudo tee -a /etc/ld.so.conf.d/openssl.conf
sudo ldconfig
# 4. 验证
openssl version
```

### 安装 tongsuo(babassl)

```shell
# https://www.yuque.com/tsdoc/ts
# git clone 
git clone https://github.com/Tongsuo-Project/Tongsuo.git tongsuo
# cd  checkout
cd tongsuo && git checkout 8.3.1-gm
# config
./config --prefix=/usr/local/tongsuo/tongsuo8.3.1-gm -Wl,-rpath,/usr/local/tongsuo/tongsuo8.3.1-gm/lib enable-ec_elgamal enable-ntls enable-sm2 enable-sm3 enable-sm4 # enable-paillier 无法识别 所以没用
# ● enable-xx：编译 xx 算法、协议或者功能，比如 enable-ntls 表示编译国密功能，enable-sm2 表示编译 sm2 算法
# ● no-xx：不编译 xx 算法、协议或者功能，比如 no-ntls 表示不编译国密功能，no-sm2 表示不编译 sm2 算法
# ● --prefix=DIR：指定 openssl 的安装目录，如果只是想生成库文件，没有必要执行 make install 命令，也就可以不用指定该选项，默认值：/usr/local
# ● --openssldir=DIR：指定 openssl 配置文件的安装目录，如果不指定，默认安装到 --prefix 指定目录下的 ssl 目录
# ● --cross-compile-prefix=PREFIX：指定交叉编译工具链，以连接号结束，比如 arm-linux-gnueabihf-
# ● --symbol-prefix=PREFIX：指定导出符号前缀，在多个 openssl 版本库共存的场景中用到，详细移步教程：[Tongsuo（原 BabaSSL） 与其他 openssl 版本库共存方案](https://www.yuque.com/tsdoc/ts/myv3uq)
# ● --api=x.y.z：x.y.z 为 API 版本号，是下列值之一：0.9.8, 1.0.0, 1.0.1, 1.0.2, 1.1.0, 1.1.1, 3.0，默认值：3.0，如果要编译与 openssl-1.1.1 兼容的 API，需要指定--api=1.1.1.
# ● -Wl,-rpath,/opt/tongsuo/lib：rpath 指定编译出的 openssl 二进制程序依赖的 libcrypto.so 和 libssl.so 目录，效果与 LD_LIBRARY_PATH 和 DYLD_LIBRARY_PATH环境变量一样
# ● --debug：如果需要 gdb 或者 lldb 调试需要加这个选项

# make
make -j
make test
sudo make install 
echo "/usr/local/tongsuo/tongsuo8.3.1-gm/lib" | sudo tee -a /etc/ld.so.conf.d/tongsuo.conf
sudo ldconfig
ln -s /usr/local/tongsuo/tongsuo8.3.1-gm/bin/openssl /usr/local/bin/tongsuossl
tongsuossl version -a
tongsuossl ciphers -v
```

### 安装gmssl

```shell

```

### atom

```shell
# https://atomsk.univ-lille.fr/dl.php
```

### 微信

```shell
# https://www.cnblogs.com/fusheng-rextimmy/p/15416967.html 弃用
# 访问微信官网
```

### sublime

```shell
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/sublimehq-archive.gpg echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list 
sudo apt-get install apt-transport-https 
sudo apt-get install sublime-text
#sublime创建软链接 
sudo ln -s /opt/sublime_text/sublime_text /usr/local/bin/sublime
```

### 安装pyenv

```shell
sudo apt update
sudo apt install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev

# 自动安装
# 使用脚本执行clone项目并安装过程
curl https://pyenv.run | bash
echo 'export PATH="$HOME/.pyenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init --path)"' >> ~/.zshrc
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
source ~/.zshrc

# 手动安装
# 1. clone 项目
git clone https://mirror.ghproxy.com/https://github.com/pyenv/pyenv.git ~/.pyenv
# 2. 编辑.zshrc | .bashrc | .profile
# pyenv
export PYENV_ROOT="$HOME/.pyenv"
#eval "$(pyenv init --path)"
#eval "$(pyenv virtualenv-init -)"

#path
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$M2_HOME/bin:$GOROOT/bin:$GOPATH/bin:$PYTHON3:$PYENV_ROOT/bin:$PATH

# pyenv
eval "$(pyenv init --path)"
eval "$(pyenv virtualenv-init -)"
```

#### 问题 virtualenv-init 找不到解决方案

```shell
git clone https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv
source ~/.zshrc
```

### zsh

#### 步骤

```shell
# 第一步安装
apt install zsh
# 第二步 克隆oh-my-zsh获取zshrc模板
git clone https://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
# 第三步 拷贝模板
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
# 第四步 使配置生效
source ~/.zshrc
# 第五步 切换默认终端
chsh -s /bin/zsh
# 第六步 重启电脑 或 logout
reboot now
# 第七步 获取zsh插件
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh}/plugins/zsh-autosuggestions
# 第八步 修改zshrc添加配置
vi ~/.zshrc
# 在zshrc文件中找到下方plugins=(git) 添加插件
plugins=(git zsh-syntax-highlighting zsh-autosuggestions jsontools)
# 第九步 使配置生效
source ~/.zshrc
```

#### Syntax error: "(" unexpected 解决方案

```text
1. 执行下方命令
sudo dpkg-reconfigure dash
2. 在弹出窗口点击否
```

### 安装nvidia-container-toolkit 版本 1.17.8

* [网址](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/1.17.8/install-guide.html)

#### 测试命令

```shell
# nvidia/cuda:11.0.3-base-ubuntu20.04环境 自己cuda版本的镜像
docker run --rm --gpus all nvidia/cuda:11.0.3-base-ubuntu20.04 nvidia-smi  

```

#### 步骤

```shell
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /etc/apt/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/etc/apt/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sed -i -e '/experimental/ s/^#//g' /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
export NVIDIA_CONTAINER_TOOLKIT_VERSION=1.17.8-1
  sudo apt-get install -y \
      nvidia-container-toolkit=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      nvidia-container-toolkit-base=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      libnvidia-container-tools=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      libnvidia-container1=${NVIDIA_CONTAINER_TOOLKIT_VERSION}
```

#### 配置

```text
configuration 测试时直接重启docker就能识别到 没有用到下方
Configure the container runtime by using the nvidia-ctk command:
 	sudo nvidia-ctk runtime configure --runtime=docker
The nvidia-ctk command modifies the /etc/docker/daemon.json file on the host. The file is updated so that Docker can use the NVIDIA Container Runtime.

Restart the Docker daemon:
	sudo systemctl restart docker

rootless-mode
	nvidia-ctk runtime configure --runtime=docker --config=$HOME/.config/docker/daemon.json

	systemctl --user restart docker

	sudo nvidia-ctk config --set nvidia-container-cli.no-cgroups --in-place



Configuring containerd (for Kubernetes)
	sudo nvidia-ctk runtime configure --runtime=containerd
	sudo systemctl restart containerd

Configuring containerd (for nerdctl)
```

### ibus输入法

```shell
# 1.卸载其他输入法
apt purge sougoupinyin
apt remove sougoupinyin*
apt purge fcitx
apt remove fcitx*
apt autoremove
# 2.删除配置文件
cd ~/.config
rm -rf sougoupintin
rm -rf ibus
# 3.安装ibus
apt install ibus ibus-rime
# 4.配置ibus
# 4.1.进入设置->区域与语言->输入源-> +
# 4.2.选择 中文rime
# 4.3.删除其他不需要的输入法
# 4.4.管理已安装的语言->键盘输入法系统
# 4.5.选择ibus
# 4.6.重启ibus 
ibus restart
# 5. 个性化配置
# 5.1.手动简单配置
vi ~/.config/ibus/rime/default_custom.yaml
# 添加内容开始
patch:
  schema_list:
    - schema: luna_pinyin_simp
  menu:
    page_size: 5
  ascii_composer:
    switch_key:
      Shift_L: commit_code
# 添加内容结束
# 横排显示
vi ~/.config/ibus/rime/build/ibus_rime.yaml
# 添加内容开始
style:
  horizontal: true
# 添加内容结束

# 5.2.clone项目配置
git clone https://github.com/ssnhd/rime.git ~/.config/ibus/
```

#### ibus输入法导致wps启动慢

```shell
sudo apt install libcanberra-gtk-module
sudo apt install appmenu-gtk2-module
```

### 配置开发环境

#### 说明

```text
更倾向于安装到/usr/local/dev下统一管理 
2026/3/4 调整系统使用情况 /dev/sda:系统 dev/sdb:/home目录 dev/sdc:/data目录 统一安装到/data/dev目录 
```

#### go

```shell
# go1.16.15 可替换 go1.22.10等版本 前提是版本存在
wget https://golang.google.cn/dl/go1.16.15.linux-amd64.tar.gz
tar xzvf go1.16.15.linux-amd64.tar.gz 
mv go go1.16.15

# 环境变量 
export GOROOT=/usr/local/dev/go
export GOPATH=${HOME}/go
export GONOSUMDB=github.com/hyperledger/fabric*,192.168.58.110/*,chainmaker.org/*
export GOSUMDB=sum.golang.google.cn
export GO111MODULE=on
export GOPROXY=https://goproxy.cn,direct
export GOINSECURE=192.168.58.110,chainmaker.org/chainmaker/*
#export GOPRIVATE=*.chainmaker.org
export GOPRIVATE=192.168.58.110,chainmaker.org/chainmaker/*
export GOTMPDIR=$GOPATH/tmp
export GOCACHE=$GOPATH/cache
export GOTOOLCHAIN=go1.22.10+auto
export GOENV=$GOPATH/env
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
```

#### java

[华为jdk镜像](https://repo.huaweicloud.com/java/jdk/)

```shell
wget https://repo.huaweicloud.com/java/jdk/8u201-b09/jdk-8u201-linux-x64.tar.gz
tar xzvf jdk-8u201-linux-x64.tar.gz
mv jdk1.8.0_201 jdk8
# 环境变量
export JAVA_HOME=/usr/local/dev/jdk8
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JRE_HOME/lib:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8

export PATH=$PATH:$JAVA_HOME/bin
```

#### docker

* 安装最新版

```shell
curl -sSL https://get.daocloud.io/docker | sh
```

* 安装最新版1

```shell
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu/ \
  $(lsb_release -cs) \
  stable"
sudo apt-get update
apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

* 安装指定版本

```shell
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu/ \
  $(lsb_release -cs) \
  stable"
sudo apt-get update

apt-cache madison docker-ce
```

* 结果如下

```text
  docker-ce | 5:18.09.1~3-0~ubuntu-xenial | https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu  xenial/stable amd64 Packages
  docker-ce | 5:18.09.0~3-0~ubuntu-xenial | https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu  xenial/stable amd64 Packages
  docker-ce | 18.06.1~ce~3-0~ubuntu       | https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu  xenial/stable amd64 Packages
  docker-ce | 18.06.0~ce~3-0~ubuntu       | https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu  xenial/stable amd64 Packages
  ...
```

* 继续执行

```shell
# <VERSION_STRING> 上方第二列 如 18.06.0~ce~3-0~ubuntu
sudo apt-get install docker-ce=<VERSION_STRING> docker-ce-cli=<VERSION_STRING> containerd.io

sudo docker run hello-world
```

#### docker-compose

* docker-compose版本查看
  [docker-compose查看版本](https://github.com/docker/compose/releases)

```shell
# v2.21.0位置替换指定版本
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

安装最新版

```shell
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# 创建软连接
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
# 加权限
chmod +x /usr/local/bin/docker-compose
```

#### git

```shell
# 方式一
apt install git

# 方式二
add-apt-repository ppa:git-core/ppa
apt update
apt install git

export GIT_TERMINAL_PROMPT=1
```

### podman

#### ubuntu20.04

```shell
# 1. you will need to install some dependencies required to install Podman
sudo apt-get install curl wget gnupg2 -y
# 2.  source your Ubuntu release and add the Podman repository with the following command
sudo sh -c "echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_20.04/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list"
# 3. download and add the GPG key with the following command
sudo wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/xUbuntu_20.04/Release.key -O- | sudo apt-key add -
# 4. update the repository and install Podman with the following command
sudo apt-get update -qq -y
sudo apt-get -qq --yes install podman
```

#### ubuntu20.10 later

```shell
sudo apt update 
sudo apt install podman -y
```

#### 配置镜像

##### 位置

```text
其他配置同下
用户级别 $HOME/.config/containers/registries.conf
系统级别 /etc/containers/registries.conf
```

##### 自用配置

```toml
# For more information on this configuration file, see containers-registries.conf(5).
#
# NOTE: RISK OF USING UNQUALIFIED IMAGE NAMES
# We recommend always using fully qualified image names including the registry
# server (full dns name), namespace, image name, and tag
# (e.g., registry.redhat.io/ubi8/ubi:latest). Pulling by digest (i.e.,
# quay.io/repository/name@digest) further eliminates the ambiguity of tags.
# When using short names, there is always an inherent risk that the image being
# pulled could be spoofed. For example, a user wants to pull an image named
# `foobar` from a registry and expects it to come from myregistry.com. If
# myregistry.com is not first in the search list, an attacker could place a
# different `foobar` image at a registry earlier in the search list. The user
# would accidentally pull and run the attacker's image and code rather than the
# intended content. We recommend only adding registries which are completely
# trusted (i.e., registries which don't allow unknown or anonymous users to
# create accounts with arbitrary names). This will prevent an image from being
# spoofed, squatted or otherwise made insecure.  If it is necessary to use one
# of these registries, it should be added at the end of the list.
#
# # An array of host[:port] registries to try when pulling an unqualified image, in order.

# unqualified-search-registries 和 registries.search 含义相同
unqualified-search-registries = ["docker.io", "quay.io", "gcr.io", "k8s.gcr.io", "ghcr.io", "registry.access.redhat.com", "container-registry.oracle.com", "registry.suse.com", "registry.fedoraproject.org", "registry.opensuse.org"]
# unqualified-search-registries = ["registry.access.redhat.com", "registry.fedoraproject.org", "docker.io"]


[[registry]]
# # The "prefix" field is used to choose the relevant [[registry]] TOML table;
# # (only) the TOML table with the longest match for the input image name
# # (taking into account namespace/repo/tag/digest separators) is used.
# #
# # The prefix can also be of the form: *.example.com for wildcard subdomain
# # matching.
# #
# # If the prefix field is missing, it defaults to be the same as the "location" field.
# prefix = "example.com/foo"
prefix = "docker.io"
location = "docker.io"

# # If true, unencrypted HTTP as well as TLS connections with untrusted
# # certificates are allowed.
# 允许使用http协议获取镜像 默认 false
# insecure = true
insecure = false

#
# # If true, pulling images with matching names is forbidden.
# blocked = false
#
# # The physical location of the "prefix"-rooted namespace.
# #
# # By default, this is equal to "prefix" (in which case "prefix" can be omitted
# # and the [[registry]] TOML table can only specify "location").
# #
# # Example: Given
# #   prefix = "example.com/foo"
# #   location = "internal-registry-for-example.net/bar"
# # requests for the image example.com/foo/myimage:latest will actually work with the
# # internal-registry-for-example.net/bar/myimage:latest image.
#
# # The location can be empty iff prefix is in a
# # wildcarded format: "*.example.com". In this case, the input reference will
# # be used as-is without any rewrite.
# location = internal-registry-for-example.com/bar"
#
# # (Possibly-partial) mirrors for the "prefix"-rooted namespace.
# #
# # The mirrors are attempted in the specified order; the first one that can be
# # contacted and contains the image will be used (and if none of the mirrors contains the image,
# # the primary location specified by the "registry.location" field, or using the unmodified
# # user-specified reference, is tried last).
# #
# # Each TOML table in the "mirror" array can contain the following fields, with the same semantics
# # as if specified in the [[registry]] TOML table directly:
# # - location
# # - insecure
# [[registry.mirror]]
# location = "example-mirror-0.local/mirror-for-foo"
# [[registry.mirror]]
# location = "example-mirror-1.local/mirrors/foo"
# insecure = true
# # Given the above, a pull of example.com/foo/image:latest will try:
# # 1. example-mirror-0.local/mirror-for-foo/image:latest
# # 2. example-mirror-1.local/mirrors/foo/image:latest
# # 3. internal-registry-for-example.net/bar/image:latest
# # in order, and use the first one that exists.


# 镜像
[[registry.mirror]]
location = "hub-dev.cnbn.org.cn"
insecure = false
[[registry.mirror]]
location = "mirror.ustc.edu.cn"
insecure = false
#[[registry.mirror]]
#location = "dockerproxy.net"
#insecure = true
[[registry.mirror]]
location = "docker.1ms.run"
insecure = true
[[registry.mirror]]
location = "hub-mirror.c.163.com"
insecure = false
[[registry.mirror]]
location = "mirror.baiduce.com"
insecure = false
[[registry.mirror]]
location = "docker.mirrors.sjtug.sjtu.edu.cn"
insecure = false
[[registry.mirror]]
location = "docker.nju.edu.cn"
insecure = false

[[registry]]
prefix = "quay.io"
location = "quay.io"
insecure = false

[[registry.mirror]]
location = "quay.mirrors.ustc.edu.cn"
insecure = false
[[registry.mirror]]
location = "quay-mirror.qiniu.com"

[[registry]]
prefix = "gcr.io"
location = "gcr.io"
insecure = false

[[registry.mirror]]
location = "gcr.lank8s.io"
insecure = true
[[registry.mirror]]
location = "lank8s.cn"
insecure = true
[[registry.mirror]]
#location= "registry.cn-hangzhou.aliyuncs.com"
location = "registry.cn-hangzhou.aliyuncs.com/google_containers"
[[registry.mirror]]
location = "gcr.1ms.run"
insecure = true

[[registry]]
prefix = "k8s.gcr.io"
location = "k8s.gcr.io"
insecure = false

[[registry.mirror]]
location = "registry.aliyuncs.com/google_containers"
[[registry.mirror]]
location = "registry.cn-hangzhou.aliyuncs.com/google_containers"

[[registry]]
location = "ghcr.io"
prefix = "ghcr.io"


[[registry.mirror]]
location = "ghcr.1ms.run"
insecure = true
```

### conda

```shell
# 1. 下载miniconda3的sh
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda3.sh
# 2. 安装miniconda3
# -b 无交互模式安装
# -p 指定安装路径
bash miniconda3.sh -b -p $HOME/miniconda3

# 3. 激活miniconda3
source $HOME/miniconda3/bin/activate
# 4. 确保conda命令在所有shell中都能用 --user 用戶级
conda init --all --user
```

#### 完整.condarc

```text
# ######################################################
# ##              Channel Configuration               ##
# ######################################################

# # channels (sequence: primitive)
# #   aliases: channel
# #   env var string delimiter: ','
# #   The list of conda channels to include for relevant operations.
# # 
# channels: []

# # channel_alias (str)
# #   The prepended url location to associate with channel names.
# # 
# channel_alias: https://conda.anaconda.org

# # channel_settings (sequence: map)
# #   env var string delimiter: ','
# #   A list of mappings that allows overriding certain settings for a
# #   single channel. Each list item should include at least the "channel"
# #   key and the setting you would like to override.
# # 
# channel_settings: []

# # default_channels (sequence: primitive)
# #   env var string delimiter: ','
# #   The list of channel names and/or urls used for the 'defaults'
# #   multichannel.
# # 
# default_channels:
#   - https://repo.anaconda.com/pkgs/main
#   - https://repo.anaconda.com/pkgs/r

# # override_channels_enabled (bool)
# #   Permit use of the --override-channels command-line flag.
# # 
# override_channels_enabled: true

# # allowlist_channels (sequence: primitive)
# #   aliases: whitelist_channels
# #   env var string delimiter: ','
# #   The exclusive list of channels allowed to be used on the system. Use
# #   of any other channels will result in an error. If conda-build channels
# #   are to be allowed, along with the --use-local command line flag, be
# #   sure to include the 'local' channel in the list. If the list is empty
# #   or left undefined, no channel exclusions will be enforced.
# # 
# allowlist_channels: []

# # denylist_channels (sequence: primitive)
# #   env var string delimiter: ','
# #   The list of channels that are denied to be used on the system. Use of
# #   any of these channels will result in an error. If conda-build channels
# #   are to be allowed, along with the --use-local command line flag, be
# #   sure to not include the 'local' channel in the list. If the list is
# #   empty or left undefined, no channel exclusions will be enforced.
# # 
# denylist_channels: []

# # custom_channels (map: primitive)
# #   A map of key-value pairs where the key is a channel name and the value
# #   is a channel location. Channels defined here override the default
# #   'channel_alias' value. The channel name (key) is not included in the
# #   channel location (value).  For example, to override the location of
# #   the 'conda-forge' channel where the url to repodata is
# #   https://anaconda-repo.dev/packages/conda-forge/linux-64/repodata.json,
# #   add an entry 'conda-forge: https://anaconda-repo.dev/packages'.
# # 
# custom_channels:
#   pkgs/pro: https://repo.anaconda.com

# # custom_multichannels (map: sequence)
# #   A multichannel is a metachannel composed of multiple channels. The two
# #   reserved multichannels are 'defaults' and 'local'. The 'defaults'
# #   multichannel is customized using the 'default_channels' parameter. The
# #   'local' multichannel is a list of file:// channel locations where
# #   conda-build stashes successfully-built packages.  Other multichannels
# #   can be defined with custom_multichannels, where the key is the
# #   multichannel name and the value is a list of channel names and/or
# #   channel urls.
# # 
# custom_multichannels: {}

# # migrated_channel_aliases (sequence: primitive)
# #   env var string delimiter: ','
# #   A list of previously-used channel_alias values. Useful when switching
# #   between different Anaconda Repository instances.
# # 
# migrated_channel_aliases: []

# # migrated_custom_channels (map: primitive)
# #   A map of key-value pairs where the key is a channel name and the value
# #   is the previous location of the channel.
# # 
# migrated_custom_channels: {}

# # add_anaconda_token (bool)
# #   aliases: add_binstar_token
# #   In conjunction with the anaconda command-line client (installed with
# #   `conda install anaconda-client`), and following logging into an
# #   Anaconda Server API site using `anaconda login`, automatically apply a
# #   matching private token to enable access to private packages and
# #   channels.
# # 
# add_anaconda_token: true

# # allow_non_channel_urls (bool)
# #   Warn, but do not fail, when conda detects a channel url is not a valid
# #   channel.
# # 
# allow_non_channel_urls: false

# # restore_free_channel (bool)
# #   "                 Add the "free" channel back into defaults, behind
# #   "main" in priority. The "free"                 channel was removed
# #   from the collection of default channels in conda 4.7.0.
# # 
# restore_free_channel: false

# # repodata_fns (sequence: primitive)
# #   env var string delimiter: ','
# #   Specify filenames for repodata fetching. The default is
# #   ('current_repodata.json', 'repodata.json'), which tries a subset of
# #   the full index containing only the latest version for each package,
# #   then falls back to repodata.json.  You may want to specify something
# #   else to use an alternate index that has been reduced somehow.
# # 
# repodata_fns:
#   - current_repodata.json
#   - repodata.json

# # use_only_tar_bz2 (NoneType, bool)
# #   A boolean indicating that only .tar.bz2 conda packages should be
# #   downloaded. This is forced to True if conda-build is installed and
# #   older than 3.18.3, because older versions of conda break when conda
# #   feeds it the new file format.
# # 
# use_only_tar_bz2:

# # repodata_threads (int)
# #   Threads to use when downloading and reading repodata.  When not set,
# #   defaults to None, which uses the default ThreadPoolExecutor behavior.
# # 
# repodata_threads: 0

# # fetch_threads (int)
# #   Threads to use when downloading packages.  When not set, defaults to
# #   None, which uses the default ThreadPoolExecutor behavior.
# # 
# fetch_threads: 0

# # experimental (sequence: primitive)
# #   env var string delimiter: ','
# #   List of experimental features to enable.
# # 
# experimental: []

# # no_lock (bool)
# #   Disable index cache lock (defaults to enabled).
# # 
# no_lock: false

# # repodata_use_zst (bool)
# #   Disable check for `repodata.json.zst`; use `repodata.json` only.
# # 
# repodata_use_zst: true


# ######################################################
# ##            Basic Conda Configuration             ##
# ######################################################

# # envs_dirs (sequence: primitive)
# #   aliases: envs_path
# #   env var string delimiter: ':'
# #   The list of directories to search for named environments. When
# #   creating a new named environment, the environment will be placed in
# #   the first writable location.
# # 
# envs_dirs: []

# # pkgs_dirs (sequence: primitive)
# #   env var string delimiter: ','
# #   The list of directories where locally-available packages are linked
# #   from at install time. Packages not locally available are downloaded
# #   and extracted into the first writable directory.
# # 
# pkgs_dirs: []

# # default_threads (int)
# #   Threads to use by default for parallel operations.  Default is None,
# #   which allows operations to choose themselves.  For more specific
# #   control, see the other *_threads parameters:     * repodata_threads -
# #   for fetching/loading repodata     * verify_threads - for verifying
# #   package contents in transactions     * execute_threads - for carrying
# #   out the unlinking and linking steps
# # 
# default_threads: 0


# ######################################################
# ##              Network Configuration               ##
# ######################################################

# # client_ssl_cert (NoneType, str)
# #   aliases: client_cert
# #   A path to a single file containing a private key and certificate (e.g.
# #   .pem file). Alternately, use client_ssl_cert_key in conjunction with
# #   client_ssl_cert for individual files.
# # 
# client_ssl_cert:

# # client_ssl_cert_key (NoneType, str)
# #   aliases: client_cert_key
# #   Used in conjunction with client_ssl_cert for a matching key file.
# # 
# client_ssl_cert_key:

# # local_repodata_ttl (bool, int)
# #   For a value of False or 0, always fetch remote repodata (HTTP 304
# #   responses respected). For a value of True or 1, respect the HTTP
# #   Cache-Control max-age header. Any other positive integer values is the
# #   number of seconds to locally cache repodata before checking the remote
# #   server for an update.
# # 
# local_repodata_ttl: 1

# # offline (bool)
# #   Restrict conda to cached download content and file:// based urls.
# # 
# offline: false

# # proxy_servers (map: primitive)
# #   A mapping to enable proxy settings. Keys can be either (1) a
# #   scheme://hostname form, which will match any request to the given
# #   scheme and exact hostname, or (2) just a scheme, which will match
# #   requests to that scheme. Values are are the actual proxy server, and
# #   are of the form 'scheme://[user:password@]host[:port]'. The optional
# #   'user:password' inclusion enables HTTP Basic Auth with your proxy.
# # 
# proxy_servers: {}

# # remote_connect_timeout_secs (float)
# #   The number seconds conda will wait for your client to establish a
# #   connection to a remote url resource.
# # 
# remote_connect_timeout_secs: 9.15

# # remote_max_retries (int)
# #   The maximum number of retries each HTTP connection should attempt.
# # 
# remote_max_retries: 3

# # remote_backoff_factor (int)
# #   The factor determines the time HTTP connection should wait for
# #   attempt.
# # 
# remote_backoff_factor: 1

# # remote_read_timeout_secs (float)
# #   Once conda has connected to a remote resource and sent an HTTP
# #   request, the read timeout is the number of seconds conda will wait for
# #   the server to send a response.
# # 
# remote_read_timeout_secs: 60.0

# # ssl_verify (bool, str)
# #   aliases: verify_ssl
# #   Conda verifies SSL certificates for HTTPS requests, just like a web
# #   browser. By default, SSL verification is enabled, and conda operations
# #   will fail if a required url's certificate cannot be verified. Setting
# #   ssl_verify to False disables certification verification. The value for
# #   ssl_verify can also be (1) a path to a CA bundle file, (2) a path to a
# #   directory containing certificates of trusted CA, or (3) 'truststore'
# #   to use the operating system certificate store.
# # 
# ssl_verify: true


# ######################################################
# ##               Solver Configuration               ##
# ######################################################

# # aggressive_update_packages (sequence: primitive)
# #   env var string delimiter: ','
# #   A list of packages that, if installed, are always updated to the
# #   latest possible version.
# # 
# aggressive_update_packages:
#   - ca-certificates
#   - certifi
#   - openssl

# # auto_update_conda (bool)
# #   aliases: self_update
# #   Automatically update conda when a newer or higher priority version is
# #   detected.
# # 
# auto_update_conda: true

# # channel_priority (ChannelPriority)
# #   Accepts values of 'strict', 'flexible', and 'disabled'. The default
# #   value is 'flexible'. With strict channel priority, packages in lower
# #   priority channels are not considered if a package with the same name
# #   appears in a higher priority channel. With flexible channel priority,
# #   the solver may reach into lower priority channels to fulfill
# #   dependencies, rather than raising an unsatisfiable error. With channel
# #   priority disabled, package version takes precedence, and the
# #   configured priority of channels is used only to break ties. In
# #   previous versions of conda, this parameter was configured as either
# #   True or False. True is now an alias to 'flexible'.
# # 
# channel_priority: flexible

# # create_default_packages (sequence: primitive)
# #   env var string delimiter: ','
# #   Packages that are by default added to a newly created environments.
# # 
# create_default_packages: []

# # disallowed_packages (sequence: primitive)
# #   aliases: disallow
# #   env var string delimiter: '&'
# #   Package specifications to disallow installing. The default is to allow
# #   all packages.
# # 
# disallowed_packages: []

# # force_reinstall (bool)
# #   Ensure that any user-requested package for the current operation is
# #   uninstalled and reinstalled, even if that package already exists in
# #   the environment.
# # 
# force_reinstall: false

# # pinned_packages (sequence: primitive)
# #   env var string delimiter: '&'
# #   A list of package specs to pin for every environment resolution. This
# #   parameter is in BETA, and its behavior may change in a future release.
# # 
# pinned_packages: []

# # pip_interop_enabled (bool)
# #   Allow the conda solver to interact with non-conda-installed python
# #   packages.
# # 
# pip_interop_enabled: false

# # track_features (sequence: primitive)
# #   env var string delimiter: ','
# #   A list of features that are tracked by default. An entry here is
# #   similar to adding an entry to the create_default_packages list.
# # 
# track_features: []

# # solver (str)
# #   aliases: experimental_solver
# #   A string to choose between the different solver logics implemented in
# #   conda. A solver logic takes care of turning your requested packages
# #   into a list of specs to add and/or remove from a given environment,
# #   based on their dependencies and specified constraints.
# # 
# solver: libmamba


# ######################################################
# ##  Package Linking and Install-time Configuration  ##
# ######################################################

# # allow_softlinks (bool)
# #   When allow_softlinks is True, conda uses hard-links when possible, and
# #   soft-links (symlinks) when hard-links are not possible, such as when
# #   installing on a different filesystem than the one that the package
# #   cache is on. When allow_softlinks is False, conda still uses hard-
# #   links when possible, but when it is not possible, conda copies files.
# #   Individual packages can override this setting, specifying that certain
# #   files should never be soft-linked (see the no_link option in the build
# #   recipe documentation).
# # 
# allow_softlinks: false

# # always_copy (bool)
# #   aliases: copy
# #   Register a preference that files be copied into a prefix during
# #   install rather than hard-linked.
# # 
# always_copy: false

# # always_softlink (bool)
# #   aliases: softlink
# #   Register a preference that files be soft-linked (symlinked) into a
# #   prefix during install rather than hard-linked. The link source is the
# #   'pkgs_dir' package cache from where the package is being linked.
# #   WARNING: Using this option can result in corruption of long-lived
# #   conda environments. Package caches are *caches*, which means there is
# #   some churn and invalidation. With this option, the contents of
# #   environments can be switched out (or erased) via operations on other
# #   environments.
# # 
# always_softlink: false

# # path_conflict (PathConflict)
# #   The method by which conda handle's conflicting/overlapping paths
# #   during a create, install, or update operation. The value must be one
# #   of 'clobber', 'warn', or 'prevent'. The '--clobber' command-line flag
# #   or clobber configuration parameter overrides path_conflict set to
# #   'prevent'.
# # 
# path_conflict: clobber

# # rollback_enabled (bool)
# #   Should any error occur during an unlink/link transaction, revert any
# #   disk mutations made to that point in the transaction.
# # 
# rollback_enabled: true

# # safety_checks (SafetyChecks)
# #   Enforce available safety guarantees during package installation. The
# #   value must be one of 'enabled', 'warn', or 'disabled'.
# # 
# safety_checks: warn

# # extra_safety_checks (bool)
# #   Spend extra time validating package contents.  Currently, runs sha256
# #   verification on every file within each package during installation.
# # 
# extra_safety_checks: false

# # signing_metadata_url_base (NoneType, str)
# #   Base URL for obtaining trust metadata updates (i.e., the `*.root.json`
# #   and `key_mgr.json` files) used to verify metadata and (eventually)
# #   package signatures.
# # 
# signing_metadata_url_base:

# # shortcuts (bool)
# #   Allow packages to create OS-specific shortcuts (e.g. in the Windows
# #   Start Menu) at install time.
# # 
# shortcuts: true

# # shortcuts_only (sequence: primitive)
# #   env var string delimiter: ','
# #   Create shortcuts only for the specified package names.
# # 
# shortcuts_only: []

# # non_admin_enabled (bool)
# #   Allows completion of conda's create, install, update, and remove
# #   operations, for non-privileged (non-root or non-administrator) users.
# # 
# non_admin_enabled: true

# # separate_format_cache (bool)
# #   Treat .tar.bz2 files as different from .conda packages when filenames
# #   are otherwise similar. This defaults to False, so that your package
# #   cache doesn't churn when rolling out the new package format. If you'd
# #   rather not assume that a .tar.bz2 and .conda from the same place
# #   represent the same content, set this to True.
# # 
# separate_format_cache: false

# # verify_threads (int)
# #   Threads to use when performing the transaction verification step.
# #   When not set, defaults to 1.
# # 
# verify_threads: 0

# # execute_threads (int)
# #   Threads to use when performing the unlink/link transaction.  When not
# #   set, defaults to 1.  This step is pretty strongly I/O limited, and you
# #   may not see much benefit here.
# # 
# execute_threads: 0


# ######################################################
# ##            Conda-build Configuration             ##
# ######################################################

# # bld_path (str)
# #   The location where conda-build will put built packages. Same as
# #   'croot', but 'croot' takes precedence when both are defined. Also used
# #   in construction of the 'local' multichannel.
# # 
# bld_path: ''

# # croot (str)
# #   The location where conda-build will put built packages. Same as
# #   'bld_path', but 'croot' takes precedence when both are defined. Also
# #   used in construction of the 'local' multichannel.
# # 
# croot: ''

# # anaconda_upload (NoneType, bool)
# #   aliases: binstar_upload
# #   Automatically upload packages built with conda build to anaconda.org.
# # 
# anaconda_upload:

# # conda_build (map: primitive)
# #   aliases: conda-build
# #   General configuration parameters for conda-build.
# # 
# conda_build: {}


# ######################################################
# ##  Output, Prompt, and Flow Control Configuration  ##
# ######################################################

# # always_yes (NoneType, bool)
# #   aliases: yes
# #   Automatically choose the 'yes' option whenever asked to proceed with a
# #   conda operation, such as when running `conda install`.
# # 
# always_yes:

# # auto_activate_base (bool)
# #   Automatically activate the base environment during shell
# #   initialization.
# # 
# auto_activate_base: true

# # auto_stack (int)
# #   Implicitly use --stack when using activate if current level of nesting
# #   (as indicated by CONDA_SHLVL environment variable) is less than or
# #   equal to specified value. 0 or false disables automatic stacking, 1 or
# #   true enables it for one level.
# # 
# auto_stack: 0

# # changeps1 (bool)
# #   When using activate, change the command prompt ($PS1) to include the
# #   activated environment.
# # 
# changeps1: true

# # env_prompt (str)
# #   Template for prompt modification based on the active environment.
# #   Currently supported template variables are '{prefix}', '{name}', and
# #   '{default_env}'. '{prefix}' is the absolute path to the active
# #   environment. '{name}' is the basename of the active environment
# #   prefix. '{default_env}' holds the value of '{name}' if the active
# #   environment is a conda named environment ('-n' flag), or otherwise
# #   holds the value of '{prefix}'. Templating uses python's str.format()
# #   method.
# # 
# env_prompt: '({default_env}) '

# # json (bool)
# #   Ensure all output written to stdout is structured json.
# # 
# json: false

# # console (str)
# #   Configure different backends to be used while rendering normal console
# #   output. Defaults to "classic".
# # 
# console: classic

# # notify_outdated_conda (bool)
# #   Notify if a newer version of conda is detected during a create,
# #   install, update, or remove operation.
# # 
# notify_outdated_conda: true

# # quiet (bool)
# #   Disable progress bar display and other output.
# # 
# quiet: false

# # report_errors (NoneType, bool)
# #   Opt in, or opt out, of automatic error reporting to core maintainers.
# #   Error reports are anonymous, with only the error stack trace and
# #   information given by `conda info` being sent.
# # 
# report_errors:

# # show_channel_urls (NoneType, bool)
# #   Show channel URLs when displaying what is going to be downloaded.
# # 
# show_channel_urls:

# # verbosity (int)
# #   aliases: verbose
# #   Sets output log level. 0 is warn. 1 is info. 2 is debug. 3 is trace.
# # 
# verbosity: 0

# # unsatisfiable_hints (bool)
# #   A boolean to determine if conda should find conflicting packages in
# #   the case of a failed install.
# # 
# unsatisfiable_hints: true

# # unsatisfiable_hints_check_depth (int)
# #   An integer that specifies how many levels deep to search for
# #   unsatisfiable dependencies. If this number is 1 it will complete the
# #   unsatisfiable hints fastest (but perhaps not the most complete). The
# #   higher this number, the longer the generation of the unsat hint will
# #   take. Defaults to 3.
# # 
# unsatisfiable_hints_check_depth: 2

# # number_channel_notices (int)
# #   Sets the number of channel notices to be displayed when running
# #   commands the "install", "create", "update", "env create", and "env
# #   update" . Defaults to 5. In order to completely suppress channel
# #   notices, set this to 0.
# # 
# number_channel_notices: 5

# # envvars_force_uppercase (bool)
# #   Force uppercase for new environment variable names. Defaults to True.
# # 
# envvars_force_uppercase: true


# ######################################################
# ##               Plugin Configuration               ##
# ######################################################

# # no_plugins (bool)
# #   Disable all currently-registered plugins, except built-in conda
# #   plugins.
# # 
# no_plugins: false
```

#### 自用condarc

```text
# 优先级 从上到下
channels:
  - conda-forge
  - pytorch
  - defaults


# 严格通道优先 strict flexible
channel_priority: flexible

# 使用libmamba求解器 更快 
solver: libmamba

# 包缓存
pkgs_dirs:
  #- ~/.conda/pkgs
  # 这里是因为miniconda安装到/data/dev/miniconda3下
  - /data/dev/miniconda3/pkgs

envs_dirs:
  #- ~/.conda/envs
  - /data/dev/miniconda3/envs

# 保留下载的.tar.bz2包
always_copy: false # false 表示尽量使用硬连接/软连接 节省空间
always_softlink: false

# ssl验证
ssl_verify: true

# 禁止自动更新
auto_update_conda: false

# 显示 channel urls 信息
show_channel_urls: true

#
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2

custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud

# 是否自动激活base环境
auto_activate_base: false

```

#### 全局一个conda每个用户只能查看自己创建的环境

```shell
# 1.正常安装conda 建议不要直接安装到~/miniconda3 可安装到/usr/local/dev/miniconda3|/data/dev/miniconda3
# 2.在/etc/skel/创建.condarc文件
sudo touch /etc/skel/.condarc
# 内容开始
# 优先使用用户家目录下的 envs，这样 conda env list 只会显示该用户能访问的环境
envs_dirs:
  - ~/.conda/envs
  # 下面这一行可选：如果希望用户也能读取(但不能修改)全局公共环境，可以保留
  # 如果希望彻底隔离，连看都看不到，就注释掉下面这行
  # - /usr/local/dev/miniconda3/envs 
  
# 同样隔离包缓存，避免权限问题
pkgs_dirs:
  - ~/.conda/pkgs
  # - /usr/local/dev/miniconda3/pkgs
# 内容结束
# 3.创建用户并登录 执行conda env list 
# 应该是看不到其他用户环境
```

### wps-缺失字体

```shell
git clone https://github.com/IamDH4/ttf-wps-fonts.git && cd ttf-wps-fonts
sudo bash install.sh
```

### node管理工具

#### nvm

```shell
git clone https://github.com/nvm-sh/nvm.git /data/dev/nvm 
cd /data/dev/nvm
. ./nvm.sh
# 6 edit ~/.bashrc ~/.zshrc or ~/.profile 
edit ~/.zshrc
export NVM_DIR="/data/dev/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export NVM_NODEJS_ORG_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/
```

#### fnm

```shell
# 1
cargo install fnm # 安装到$CARGO_HOME/bin
# 2
curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir "/data/dev/fnm" --skip-shell
# --install-dir 设置 fnm 的自定义安装目录。
#               默认值为 $XDG_DATA_HOME/fnm
#               （如果未定义 $XDG_DATA_HOME，则在 Linux 上回退为 $HOME/.local/share/fnm，
#               在 MacOS 上回退为 $HOME/Library/Application Support/fnm）
# --skip-shell  根据 $SHELL 中定义的当前用户 shell，
#               跳过将 shell 特定的加载程序附加到 shell 配置文件的步骤。
#               例如，对于 Bash，$HOME/.bashrc。对于 Zsh，$HOME/.zshrc。
#               适用于 Fish - $HOME/.config/fish/conf.d/fnm.fish
# --force-install  使用安装脚本的 macOS 安装已被弃用，取而代之的是 Homebrew 方案，但这会强制脚本使用它进行安装。
# 3
winget install Schniz.fnm

# 添加到 ~/.zshrc
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
# 添加到 ~/.bashrc
echo 'eval "$(fnm env --use-on-cd --shell bash)"' >> ~/.bashrc
# 添加到 ~/.config/fish/config.fish
echo 'fnm env --use-on-cd --shell fish | source' >> ~/.config/fish/config.fish
# 添加到 PowerShell Profile
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression

# 或者添加到 profile 文件
Add-Content -Path $PROFILE -Value 'fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression'

# 自定义 FNM 安装目录
export FNM_DIR="$HOME/.fnm"

# 设置 Node.js 下载镜像源（提高下载速度）
export FNM_NODE_DIST_MIRROR="https://npmmirror.com/mirrors/node/"

# 设置远程版本列表缓存时间（秒）
export FNM_REMOTE_VERSIONS_CACHE_DURATION=86400

export FNM_NODE_DIST_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/

```

### 占位

## centos

### yum安装指定版本的软件

```text
yum list <packagename> --showduplicates

yum install <packagename>-<version>
```

### gcc指定版本(在原本没有gcc的环境中安装gcc指定版本)

#### 在可以联网的centos系统中

```text

yum install --downloadonly --downloaddir=/root/soft/gcc gcc
yum install --downloadonly --downloaddir=/root/soft/gcc++ gcc-c++


rpm  -ivh  *.rpm --nodeps --force
```

#### 源码安装

0. 下载相关文件压缩包

```text
选择需要版本文件
https://mirrors.tuna.tsinghua.edu.cn/gnu/gcc/
gmp
https://mirrors.tuna.tsinghua.edu.cn/gnu/gmp/
mpfr
https://mirrors.tuna.tsinghua.edu.cn/gnu/mpfr/
mpc
https://mirrors.tuna.tsinghua.edu.cn/gnu/mpc/
m4
https://mirrors.tuna.tsinghua.edu.cn/gnu/m4/
```

1. 安装m4

```text
tar xzf m4-1.4.16

cd m4-1.4.16

./configure --prefix=/usr/local/m4-1.4.16

make

make install

ln -s /usr/local/m4-1.4.16 /usr/local/m4

export PATH=/usr/local/m4/bin:$PATH
```

2. 安装gmp

```text
xz -d gmp-6.1.2.tar.xz

tar xf gmp-6.1.2.tar

cd gmp-6.1.2

./configure --prefix=/usr/local/gmp-6.1.2

make

make install

ln -s /usr/local/gmp-6.1.2 /usr/local/gmp
```

3. 安装mpfr

```text
tar xzf  mpfr-4.0.2.tar.gz

cd mpfr-4.0.2

./configure --prefix=/usr/local/mpfr-4.0.2 --with-gmp=/usr/local/gmp

make

make install

ln -s /usr/local/mpfr-4.0.2 /usr/local/mpfr
```

4. 安装mpc

```text
tar xzf  mpc-1.1.0.tar.gz

cd mpc-1.1.0

./configure --prefix=/usr/local/mpc-1.1.0 --with-gmp=/usr/local/gmp --with-mpfr=/usr/local/mpfr

make

make install

ln -s /usr/local/mpc-1.1.0 /usr/local/mpc
```

5. 设置LD_LIBRARY_PATH

```bash
export LD_LIBRARY_PATH=/usr/local/gmp/lib:/usr/local/mpfr/lib:/usr/local/mpc/lib:$LD_LIBRARY_PATH
```

6. 编译gcc

```text
tar xzf gcc-8.3.0.tar.gz

cd gcc-8.3.0

./configure --prefix=/usr/local/gcc-8.3.0 --with-mpfr=/usr/local/mpfr --with-gmp=/usr/local/gmp --with-mpc=/usr/local/mpc

使用多线程make
make -j 8

make install

ln -s /usr/local/gcc-8.3.0 /usr/local/gcc

export PATH=/usr/local/gcc/bin:$PATH

export LD_LIBRARY_PATH=/usr/local/gcc/lib64:$LD_LIBRARY_PATH

export MANPATH=/usr/local/gcc/share/man:$MANPATH

gcc --version
```

#### QA

1. 在执行configure时，如果遇到错误“I suspect your system does not have 32-bit development libraries (libc and headers).
   If you have them, rerun configure with --enable-multilib. If you do not have them, and want to build a 64-bit-only
   compiler, rerun configure with --disable-multilib”，表示系统不支持32位程序，这样在执行configure时需为它支持参数“--disable-multilib”，如：
2. 如果make时遇到错误“internal compiler error”，可能是因为内存不足，请换台内存更大的机器，或者更换GCC版本试试。
3. 如果遇到错误“C compiler cannot create executables”、“error while loading shared libraries: libmpfr.so.6: cannot open
   shared object file: No such file or directory”或“cannot compute suffix of object files”，可尝试设置LD_LIBRARY_PATH后再试试：

[comment]: <> (https://www.cnblogs.com/aquester/p/10799125.html)


[comment]: <rpm包管理> (https://blog.csdn.net/qq_39445165/article/details/81771621)

### 安装nvidia-container-toolkit 版本 1.17.8

* [网址](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/1.17.8/install-guide.html)

#### 测试命令

```shell
# nvidia/cuda:11.0.3-base-ubuntu20.04环境 自己cuda版本的镜像
docker run --rm --gpus all nvidia/cuda:11.0.3-base-ubuntu20.04 nvidia-smi  

```

#### 步骤

```shell
curl -s -L https://nvidia.github.io/libnvidia-container/stable/rpm/nvidia-container-toolkit.repo | \
  sudo tee /etc/yum.repos.d/nvidia-container-toolkit.repo
sudo dnf-config-manager --enable nvidia-container-toolkit-experimental
export NVIDIA_CONTAINER_TOOLKIT_VERSION=1.17.8-1
  sudo dnf install -y \
      nvidia-container-toolkit-${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      nvidia-container-toolkit-base-${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      libnvidia-container-tools-${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      libnvidia-container1-${NVIDIA_CONTAINER_TOOLKIT_VERSION}
```

#### 配置

```text
configuration 测试时直接重启docker就能识别到 没有用到下方
Configure the container runtime by using the nvidia-ctk command:
 	sudo nvidia-ctk runtime configure --runtime=docker
The nvidia-ctk command modifies the /etc/docker/daemon.json file on the host. The file is updated so that Docker can use the NVIDIA Container Runtime.

Restart the Docker daemon:
	sudo systemctl restart docker

rootless-mode
	nvidia-ctk runtime configure --runtime=docker --config=$HOME/.config/docker/daemon.json

	systemctl --user restart docker

	sudo nvidia-ctk config --set nvidia-container-cli.no-cgroups --in-place



Configuring containerd (for Kubernetes)
	sudo nvidia-ctk runtime configure --runtime=containerd
	sudo systemctl restart containerd

Configuring containerd (for nerdctl)
```

### 占位
