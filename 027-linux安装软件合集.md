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