# ubuntu 升级openssl-3.5.0

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

# 安装 tongsuo(babassl)

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


# 安装gmssl


