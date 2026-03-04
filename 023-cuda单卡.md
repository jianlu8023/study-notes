# 基础方法



```python
import torch 
# cuda是否可用
torch.cuda.is_available()
# gpu数量
torch.cuda.device_count()
# 当前设备索引号 从 0 开始
torch.cuda.current_device()
# gpu名称
torch.cuda.get_device_name(0)
# gpu容量
torch.cuda.get_device_capability(0)
```



#  CUDA 在多卡环境指定使用单张卡

```text
假设 目前有 四张卡 
nvidia-smi 会有标号 0 1 2 3
要使用第四张卡(也就是3)
```



## 方式1

```python
import torch

device = torch.device("cuda:3" if torch.cuda.is_available() else "cpu")
print(f"using device : { device }")
```



## 方式2

```python
import os
# 设置CUDA 可见性 只能查看到3号卡 
os.envrion['CUDA_VISIBLE_DEVICES'] = '3'

import torch 

if torch.cuda.is_available():
    print(f"torch.cuda.is_available(): { torch.cuda.is_available() }")
    # 因为只能看到一张卡 所以直接 cuda:0 即可
    device = torch.device("cuda:0")
    print(f"current GPUs: { torch.cuda.device_count() }") # output: current GPUs: 1
    if torch.cuda.device_count() == 0:
        device = torch.device("cpu")
else:
    device = torch.device("cpu")
```



### 设置自定义gpu可见顺序

```python
import os
# 此时3号卡为主卡
os.envrion['CUDA_VISIBLE_DEVICES'] = '3,0,1,2'
# 实际显卡编号    --》   运算显卡编号
# 3                        0
# 0                        1
# 1                        2
# 2                        3


```



# CUDA 多卡训练

```python
# 场景描述，四张卡 我要使用 2,3卡并行训练
import os
os.environ['CUDA_VISIBLE_DEVICES'] = '2,3'

import torch

net = torch.nn.DataParallel(model,device_ids=[0,1])
model = torch.nn.DataParallel(model,device_ids=[0,1]).cuda()


```





