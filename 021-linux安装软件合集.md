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
