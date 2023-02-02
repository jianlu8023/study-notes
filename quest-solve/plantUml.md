解决plantUML相关问题<br>

#### 问题1: 解决缺少Graphviz<br>

#### 解决: <br>

windows: <br>

下载并安装Graphviz并配置环境变量<br>

```text
https://graphviz.org/download/
```

添加环境变量:

```text
GRAPVIZ_DOT=${install-path}
```

linux: <br>

```text
    ubuntu: sudo apt install graphviz
    
    centos: sudo yum install graphviz
```

macos:

```text
brew install graphviz
```

相关文章:<br>
[plantUML官网](https://plantuml.com/zh/) <br>
[grapviz官网](https://graphviz.org/) <br>
[csdn中解决](https://blog.csdn.net/mosesaaron/article/details/10618537) <br>