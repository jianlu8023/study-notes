# shell技巧

## 格式输出

```shell

cat << EOF > ./a.sh

#123
mysqld --user=mysql
EOF

```

## read命令使用

<code>read</code> 命令用于从标准输入读取用户输入，并将输入存储到一个或多个变量中。它的一般语法如下：

<code>read [options] variable(s)</code><br>
<code>options</code>：可选参数，用于指定 <code>read</code> 命令的行为。<br>
<code>variable(s)</code>：要存储输入值的一个或多个变量。

以下是一些常见的 <code>read</code> 命令选项：

<code>-p</code>：指定一个提示消息，用于提示用户输入。<br>
<code>-t</code>：设置一个超时时间，如果在指定的时间内没有输入，则会引发一个超时错误。<br>
<code>-s</code>：开启静默模式，用户输入的内容将不会显示在终端上。<br>
<code>-n</code>：设置只读取指定数量的字符。<br>
<code>-r</code>：禁用反斜杠转义，输入的内容将按照字面值进行处理。<br>

以下是一些示例，演示如何使用 <code>read</code> 命令：

* 读取单个变量：

```bash
read variable
echo "You entered: $variable"
```

* 读取多个变量：

```bash
read var1 var2 var3
echo "You entered: $var1, $var2, $var3"
```

* 提示用户输入：

```bash
read -p "Enter your name: " name
echo "Hello, $name!"
```

* 设置超时时间：

```bash
if read -t 5 -p "Enter your name within 5 seconds: " name; then
    echo "Hello, $name!"
else
    echo "Timeout reached. Exiting..."
fi
```

* 隐藏用户输入：

```bash
read -s -p "Enter your password: " password
echo "Your password is: $password
```

