# centos 使用 yum 安装指定版本指定软件

## yum 安装指定版本指定软件

```text
yum list packagename --showduplicates

yum install packagename-version

```

## gcc 指定版本

### 在原本没有gcc的环境中安装gcc指定版本<br>

在可以联网的centos系统中

```text

yum install --downloadonly --downloaddir=/root/soft/gcc gcc
yum install --downloadonly --downloaddir=/root/soft/gcc++ gcc-c++


rpm  -ivh  *.rpm --nodeps --force
```

### 源码安装

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
1. 在执行configure时，如果遇到错误“I suspect your system does not have 32-bit development libraries (libc and headers). If you have them, rerun configure with --enable-multilib. If you do not have them, and want to build a 64-bit-only compiler, rerun configure with --disable-multilib”，表示系统不支持32位程序，这样在执行configure时需为它支持参数“--disable-multilib”，如：
2. 如果make时遇到错误“internal compiler error”，可能是因为内存不足，请换台内存更大的机器，或者更换GCC版本试试。
3. 如果遇到错误“C compiler cannot create executables”、“error while loading shared libraries: libmpfr.so.6: cannot open shared object file: No such file or directory”或“cannot compute suffix of object files”，可尝试设置LD_LIBRARY_PATH后再试试：

[comment]: <> (https://www.cnblogs.com/aquester/p/10799125.html)


[comment]: <rpm包管理> (https://blog.csdn.net/qq_39445165/article/details/81771621)
