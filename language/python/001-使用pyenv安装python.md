# 使用pyenv安装python

## 安装pyenv

0. 安装前准备

```bash
sudo apt update
sudo apt install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
```

1. 自动安装方式

```bash
# 使用脚本执行clone项目并安装过程
curl https://pyenv.run | bash
echo 'export PATH="$HOME/.pyenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init --path)"' >> ~/.zshrc
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
source ~/.zshrc
```

2. 手动安装方式

```text
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



## 问题 virtualenv-init 找不到解决方案


Tips: 

```bash
git clone https://mirror.ghproxy.com/https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv
source ~/.zshrc
```

