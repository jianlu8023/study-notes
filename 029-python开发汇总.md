# python 开发汇总

## tensorboard 环境

```shell
conda create -n tensorboard python=3.11 --yes
conda activate tensorboard
pip install uv
uv pip install --system tensorboard==2.20.0
uv pip install --system setuptools==59.8.0
tensorboard --version 
tensorboard --help
```

## pytorch环境

```shell
conda create -n pytorch python=3.11 --yes
conda activate pytorch
pip install uv 
uv pip install --system --extra-index-url https://download.pytorch.org/whl/cu121 --index-url https://pypi.tuna.tsinghua.edu.cn/simple torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1
# uv pip install --system ultralytics==8.3.234 # 安装yolo官方库
```

