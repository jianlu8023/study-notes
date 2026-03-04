# Kubernetes介绍

kubernetes（k8s）是2014年由Google公司基于Go语言编写的一款开源的容器集群编排系统，用于自动化容器的部署、扩缩容和管理；
kubernetes（k8s）是基于Google内部的Borg系统的特征开发的一个版本，集成了Borg系统大部分优势；
官方地址：https://Kubernetes.io
代码托管平台：https://github.com/Kubernetes

# kubernetes具备的功能

● 自我修复：k8s可以监控容器的运行状况，并在发现容器出现异常时自动重启故障实例；
● 弹性伸缩：k8s可以根据资源的使用情况自动地调整容器的副本数。例如，在高峰时段，k8s可以自动增加容器的副本数以应对更多的流量；而在低峰时段，k8s可以减少应用的副本数，节省资源；
● 资源限额：k8s允许指定每个容器所需的CPU和内存资源，能够更好的管理容器的资源使用量；
● 滚动升级：k8s可以在不中断服务的情况下滚动升级应用版本，确保在整个过程中仍有足够的实例在提供服务；
● 负载均衡：k8s可以根据应用的负载情况自动分配流量，确保各个实例之间的负载均衡，避免某些实例过载导致的性能下降；
● 服务发现：k8s可以自动发现应用的实例，并为它们分配一个统一的访问地址。这样，用户只需要知道这个统一的地址，就可以访问到应用的任意实例，而无需关心具体的实例信息；
● 存储管理：k8s可以自动管理应用的存储资源，为应用提供持久化的数据存储。这样，在应用实例发生变化时，用户数据仍能保持一致，确保数据的持久性；
● 密钥与配置管理：Kubernetes 允许你存储和管理敏感信息，例如：密码、令牌、证书、ssh密钥等信息进行统一管理，并共享给多个容器复用；

# kubernetes集群角色

k8s集群需要建⽴在多个节点上，将多个节点组建成一个集群，然后进⾏统⼀管理，但是在k8s集群内部，这些节点⼜被划分成了两类⻆⾊：
● 一类⻆⾊为管理节点，叫Master，负责集群的所有管理工作；
● ⼀类⻆⾊为⼯作节点，叫Node，负责运行集群中所有用户的容器应用 ；

# Master管理节点组件

● API Server：作为集群的管理入口，处理外部和内部通信，接收用户请求并处理集群内部组件之间的通信；
● Scheduler：作为集群资源调度计算，根据调度策略，负责将待部署的 Pods 分配到合适的 Node 节点上；
● Controller Manager：管理集群中的各种控制器，例如 Deployment、ReplicaSet、DaemonSet等，管理集群中的各种资源；
● etcd：作为集群的数据存储，保存集群的配置信息和状态信息；

# Node工作节点组件

● Kubelet：负责与 Master 节点通信，并根据 Master 节点的调度决策来创建、更新和删除 Pod，同时维护 Node 节点上的容器状态；
● 容器运行时（如 Docker、containerd 等）：负责运行和管理容器，提供容器生命周期管理功能。例如：创建、更新、删除容器等；
● Kube-proxy：负责为集群内的服务实现网络代理和负载均衡，确保服务的访问性；

# 非必须的集群插件

● DNS服务：严格意义上的必须插件，在k8s中，很多功能都需要用到DNS服务，例如：服务发现、负载均衡、有状态应用的访问等；
● Dashboard： 是k8s集群的Web管理界面；
● 资源监控：例如metrics-server监视器，用于监控集群中资源利用率；

# kubernetes集群类型

● 一主多从集群：由一台Master管理节点和多台Node工作节点组成，生产环境下Master节点存在单点故障的风险，适合学习和测试环境使用；
● 多主多从集群：由多台Master管理节点和多Node工作节点组成，安全性高，适合生产环境使用；

# kubernetes集群规划

提示：系统尽量别带图形界面，图形比较吃内存。
主机名 IP地址 角色 操作系统 硬件配置
master01 192.168.0.10 管理节点 openEuler 24.03 2CPU/4G内存/50G
node01 192.168.0.11 工作节点 openEuler 24.03 2CPU/4G内存/50G
node02 192.168.0.12 工作节点 openEuler 24.03 2CPU/4G内存/50G

提示：系统提前关闭防火墙与 SELinux

```shell
systemctl stop firewalld && systemctl disable firewalld
setenforce 0 && \
sed -i "s/SELINUX=enforcing/SELINUX=disabled/" /etc/selinux/config
```

## 集群前期环境准备

按照集群规划修改每个节点主机名

```shell
hostnamectl set-hostname 主机名
```

## 配置集群之间本地解析，集群在初始化时需要能够解析主机名

```shell
echo "192.168.0.10 master
192.168.0.11 node01
192.168.0.12 node02" >> /etc/hosts
```

## 开启bridge网桥过滤

```shell
cat > /etc/sysctl.d/k8s.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
# 参数解释：
# net.bridge.bridge-nf-call-ip6tables = 1  //对网桥上的IPv6数据包通过iptables处理
# net.bridge.bridge-nf-call-iptables = 1   //对网桥上的IPv4数据包通过iptables处理
# net.ipv4.ip_forward = 1                         //开启IPv4路由转发,来实现集群中的容器与外部网络的通信

```

## 由于开启bridge功能，需要加载br_netfilter模块来允许在bridge设备上的数据包经过iptables防火墙处理

```shell
modprobe br_netfilter && lsmod | grep br_netfilter
# 命令解释：
# modprobe       	 //命令可以加载内核模块
# br_netfilter    		//模块模块允许在bridge设备上的数据包经过iptables防火墙处理
```

## 加载配置文件，使上述配置生效

```shell
sysctl -p /etc/sysctl.d/k8s.conf
```

## 关闭SWAP交换分区

```shell
# 为了保证 kubelet 正常工作，k8s强制要求禁用，否则集群初始化失败
swapoff -a && \
sed -ri 's/.*swap.*/#&/' /etc/fstab
```

## 安装Containerd软件包

### 添加华为 云docker-ce仓库（containerd软件包在docker仓库）

```shell
cat <<EOF | sudo tee /etc/yum.repos.d/docker-ce.repo > /dev/null
[docker-ce-stable]
name=Docker CE Stable - \$basearch
baseurl=https://mirrors.huaweicloud.com/docker-ce/linux/centos/9/\$basearch/stable
enabled=1
gpgcheck=1
gpgkey=https://mirrors.huaweicloud.com/docker-ce/linux/centos/gpg
EOF
```

### 安装containerd软件包

```shell
dnf install -y containerd.io-1.6.20-3.1.el9.x86_64
```

### 生成containerd配置文件

```shell
containerd config default | tee /etc/containerd/config.toml
```

### 启用Cgroup用于限制进程的资源使用量，如CPU、内存资源

```shell
sed -i 's#SystemdCgroup = false#SystemdCgroup = true#' /etc/containerd/config.toml
```

### 替换文件中pause镜像的下载地址为阿里云仓库

```shell
sed -i 's#sandbox_image = "registry.k8s.io/pause:3.6"#sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.9"#' /etc/containerd/config.toml
```

### 为Containerd配置镜像加速器，在文件中找到[plugins."io.containerd.grpc.v1.cri".registry.mirrors]，在下方添加镜像加速器

```text
#...
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
           endpoint = ["https://abde64ba3c6d4242b9d12854789018c6.mirror.swr.myhuaweicloud.com"]
```

### 指定contaienrd接口文件地址，在k8s环境中，kubelet通过 containerd.sock 文件与containerd进行通信

```shell
cat <<EOF | tee /etc/crictl.yaml
runtime-endpoint: unix:///var/run/containerd/containerd.sock
image-endpoint: unix:///var/run/containerd/containerd.sock
timeout: 10
debug: false
EOF
# 参数解释：
# runtime-endpoint		//指定了容器运行时的sock文件位置
# image-endpoint		//指定了容器镜像使用的sock文件位置
# timeout				//容器运行时或容器镜像服务之间的通信超时时间
# debug				//指定了crictl工具的调试模式,false表示调试模式未启用,true则会在输出中包含更多的调试日志信息，有助于故障排除和问题调试
```

### 启动containerd并设置随机自启

```shell
systemctl enable containerd --now
```

## k8s集群部署方式

kubernetes集群有多种部署方式，目前常用的部署方式有如下两种：
● kubeadm部署方式：kubeadm是一个快速搭建kubernetes的集群工具；
● 二进制包部署方式：从官网下载每个组件的二进制包，依次去安装，部署麻烦；
● 其他方式：通过一些开源的工具搭建，例如：sealos；

### kubeadm

#### 配置kubeadm仓库，使用阿里云 YUM源

```shell
cat > /etc/yum.repos.d/k8s.repo <<EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

#### 安装以下软件包：

● kubeadm：用于初始化集群，并配置集群所需的组件并生成对应的安全证书和令牌；
● kubelet：负责与 Master 节点通信，并根据 Master 节点的调度决策来创建、更新和删除 Pod，同时维护 Node 节点上的容器状态；
● kubectl：用于管理k8集群的一个命令行工具；

```shell
yum -y install kubeadm-1.28.2 kubelet-1.28.2 kubectl-1.28.2
```

#### kubelet启用Cgroup控制组，用于限制进程的资源使用量，如CPU、内存

```shell
tee > /etc/sysconfig/kubelet <<EOF
KUBELET_EXTRA_ARGS="--cgroup-driver=systemd"
EOF
```

#### 设置kubelet开机自启动即可，集群初始化后自动启动

```shell
systemctl enable kubelet
```

#### 集群初始化

##### 在master01节点查看集群所需镜像文件

```text
kubeadm config images list

#...以下是集群初始化所需的集群组件镜像
v1.27.1; falling back to: stable-1.23
k8s.gcr.io/kube-apiserver:v1.23.17
k8s.gcr.io/kube-controller-manager:v1.23.17
k8s.gcr.io/kube-scheduler:v1.23.17
k8s.gcr.io/kube-proxy:v1.23.17
k8s.gcr.io/pause:3.6
k8s.gcr.io/etcd:3.5.1-0
k8s.gcr.io/coredns/coredns:v1.8.6
```

##### 在master01节点生成初始化集群的配置文件

```shell
kubeadm config print init-defaults > kubeadm-config.yaml
```

###### 配置文件需要修改如下内容

```text
#管理节点的IP地址
advertiseAddress: 192.168.0.50

#本机注册到集群后的节点名称
name: master01

#集群镜像下载地址，修改为阿里云
imageRepository: registry.cn-hangzhou.aliyuncs.com/google_containers
```

##### 通过配置文件初始化集群

```shell
kubeadm init --config kubeadm-config.yaml 
# 选项说明：
# init 				//初始化集群
# --config			//通过配置文件初始化
```

##### 根据集群初始化后的提示，执行如下命令

```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

##### 根据提示将node节点加入集群，加入成功后在master节点验证

```shell
kubectl get nodes
 
NAME     STATUS     ROLES                  AGE     VERSION
master01 NotReady   control-plane,master   3m31s   v1.23.0
node01   NotReady   <none>                 12s     v1.23.0
node02   NotReady   <none>                 89s     v1.23.0
```

###### 提示：如果哪个节点出现问题，可以使用下列命令重置当前节点

```shell
kubeadm  reset
```

#### 部署集群网络Calico

Calico 和 Flannel 是两种流行的 k8s 网络插件，它们都为集群中的 Pod 提供网络功能。然而，它们在实现方式和功能上有一些重要区别：
网络模型的区别：
● Calico 使用 BGP（边界网关协议）作为其底层网络模型。它利用 BGP 为每个 Pod 分配一个唯一的 IP 地址，并在集群内部进行路由。Calico
支持网络策略，可以对流量进行精细控制，允许或拒绝特定的通信。
● Flannel 则采用了一个简化的覆盖网络模型。它为每个节点分配一个 IP 地址子网，然后在这些子网之间建立覆盖网络。Flannel 将 Pod
的数据包封装到一个更大的网络数据包中，并在节点之间进行转发。Flannel 更注重简单和易用性，不提供与 Calico 类似的网络策略功能。
性能的区别：
● 由于 Calico 使用 BGP 进行路由，其性能通常优于 Flannel。Calico 可以实现直接的 Pod 到 Pod 通信，而无需在节点之间进行额外的封装和解封装操作。这使得
Calico 在大型或高度动态的集群中具有更好的性能。
● Flannel 的覆盖网络模型会导致额外的封装和解封装开销，从而影响网络性能。对于较小的集群或对性能要求不高的场景，这可能并不是一个严重的问题。

##### master01节点下载Calico文件

```shell
wget https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/calico.yaml
```

##### 创建calico网络

```shell
kubectl apply -f calico.yaml 
```

##### 查看Calico Pod状态是否为Running

```text
kubectl get pod -n kube-system

NAME                                       READY   STATUS    RESTARTS   AGE
calico-kube-controllers-66966888c4-whdkj   1/1     Running   0          101s
calico-node-f4ghp                          1/1     Running   0          101s
calico-node-sj88q                          1/1     Running   0          101s
calico-node-vnj7f                          1/1     Running   0          101s
calico-node-vwnw4                          1/1     Running   0          101s
```

#### 验证集群节点状态

##### 在master01节点查看集群信息

```text
kubectl get nodes

NAME       STATUS   ROLES                  AGE   VERSION
master01   Ready    control-plane,master   25m   v1.23.0
node01     Ready    <none>   							 25m   v1.23.0
node02     Ready    <none>   							 24m   v1.23.0
```

#### 部署Nginx测试集群

##### 在master01节点部署nginx程序测试

```shell
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.20.2
    ports:
    - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 30002
```

##### 查看Pod状态是否为Running

```shell
kubectl get pod

NAME                     READY   STATUS    RESTARTS   AGE
nginx-696649f6f9-j8zbj   1/1     Running   0          2m1s
```

##### 查看Service代理信息

```shell
kubectl get service

NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP        44m
nginx-svc    NodePort    10.103.195.31   <none>        80:30002/TCP   96s
```

# k3s | k0s

## 对比

| 特性       | k3s                    | k0s          |
|----------|------------------------|--------------|
| 功能完整性    | 移除部分非核心功能              | 几乎全量         |
| 默认数据存储   | sqlite                 | 嵌入式etcd      |
| 支持外部存储   | etcd、mysql、postgresql、 | 仅etcd        |
| 控制平面进程模型 | 单二进制，单进程多协程            | 单二进制，多自进程    |
| 使用场景     | 边缘、iot、资源受限            | 需要完整功能但想简化部署 |

## k0s

### 使用 k0s 安装

```shell
# 1. 下载 k0s 二进制

# 本质就是下载最新的k0s 先获取 https://docs.k0sproject.io/stable.txt [version]
# 获取系统 arch (amd64|x86_64=> amd64) [arch]
# 组装下载地址 https://github.com/k0sproject/k0s/releases/download/$version/k0s-$version-$arch
# 本人一般将下载的放/usr/local/bin 然后做软连接 
# sudo curl -fsSL https://github.com/k0sproject/k0s/releases/download/$version/k0s-$version-$arch -o /usr/local/bin/k0s
# sudo chmod +x /usr/local/bin/k0s 
# sudo ln -s /usr/local/bin/k0s /usr/bin/k0s
# 脚本直接放到/usr/bib/k0s
curl -sSLf https://get.k0s.sh | sudo sh

# 2. 生成k0s的yaml文件
sudo mkdir -p /etc/k0s
k0s config create --include-images | sudo tee /etc/k0s/k0s.yaml

# 3. 启动k0s controller
# 本机已经安装了 containerd 所以使用自己的 containerd 并且有教程配置 containerd 的镜像
# 这里添加了--enable-worker controller也当作worker
# 这里可添加 --logging containerd=info,etcd=info,konnectivity-server=1,kube-apiserver=1,kube-controller-manager=1,kube-scheduler=1,kubelet=1
# 这一步会生成一个 systemd unit 放到 /etc/systemd/system/k0scontroller.service 
# 可添加自定义日志输出 放到 [Service]下
# StandardOutput=append:/etc/k0s/logs/k0s.log
# StandardError=append:/etc/k0s/logs/k0s.log
# 执行 sudo systemctl daemon-reload
sudo k0s install controller --enable-metrics-scraper -c /etc/k0s/k0s.yaml --enable-worker --data-dir /var/lib/k0s --cri-socket remote:/var/run/containerd/containerd.sock
sudo k0s start 
sudo systemctl enable k0scontroller.service
# 生成worker使用的token-file
sudo k0s token create --role=worker --expiry=10000h > token-file


# 3. 启动k0s worker
# 拷贝token-file 到worker机器的目录
# 这里建议放到/etc/k0s/token-file
# 这行命令本人没进行执行 凭感觉应该也是生成 systemd unit => k0sworker.service 所以也可以添加自定义日志输出 
sudo k0s install worker --cri-socket remote:/var/run/containerd/containerd.sock --data-dir /var/lib/k0s --token-file /etc/k0s/token-file

```

* 节点无法访问外网

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: netshoot-deploy
  namespace: default
spec:
  selector:
    matchLabels:
      app: netshoot-deploy
  template:
    metadata:
      labels:
        app: netshoot-deploy
    spec:
      containers:
        - name: netshoot
          image: nicolaka/netshoot
          command: [ "sleep", "999999" ]
          resources:
            limits:
              cpu: 100m
              memory: 64Mi
            requests:
              cpu: 100m
              memory: 64Mi
```

### 使用 k0sctl 安装

```shell
# 1. 安装k0sctl
# 安装golang可用这个
go install github.com/k0sproject/k0sctl@latest
# wget
# 最新版 https://github.com/k0sproject/k0sctl/releases/latest/download/k0sctl-linux-amd64
wget https://github.com/k0sproject/k0sctl/releases/download/v0.27.0/k0sctl-linux-amd64
sudo chmod +x k0sctl-linux-amd64
sudo mv k0sctl-linux-amd64 /usr/local/bin/k0sctl
sudo ln -s /usr/local/bin/k0sctl /usr/bin/k0sctl

# 2. 编写 yaml文件
mkdir -p /etc/k0sctl/
sudo cat <<'EOF' | sudo tee /etc/k0sctl/k0sctl.yaml
# 这里拷贝下方的yaml
EOF

# 3. apply
# 确保每个机器都配置了免登录， 参考上面的kubernetes教程
k0sctl apply -c /etc/k0sctl/k0sctl.yaml
# 查看
k0s kubuctl get node -o wide

```

```text
error_log syslog:server=unix:/dev/log notice;
 
worker_processes auto;
events {
	multi_accept on;
	use epoll;
	worker_connections 1024;
}
 
stream {
    upstream kube_apiserver {
        least_conn;
        server 10.0.0.11:6443;
        server 10.0.0.12:6443;
        server 10.0.0.13:6443;
    }
    upstream konnectivity_agent {
        least_conn;
        server 10.0.0.11:8132;
        server 10.0.0.12:8132;
        server 10.0.0.13:8132;
    }
    upstream konnectivity_server {
        least_conn;
        server 10.0.0.11:8133;
        server 10.0.0.12:8133;
        server 10.0.0.13:8133;
    }
    upstream controller_join_api {
        least_conn;
        server 10.0.0.11:9443;
        server 10.0.0.12:9443;
        server 10.0.0.13:9443;
    }
    
    server {
        listen        0.0.0.0:6443;
        proxy_pass    kube_apiserver;
        proxy_timeout 10m;
        proxy_connect_timeout 1s;
    }
    server {
        listen        0.0.0.0:8132;
        proxy_pass    konnectivity_agent;
        proxy_timeout 10m;
        proxy_connect_timeout 1s;
    }
    server {
        listen        0.0.0.0:8133;
        proxy_pass    konnectivity_server;
        proxy_timeout 10m;
        proxy_connect_timeout 1s;
    }
    server {
        listen        0.0.0.0:9443;
        proxy_pass    controller_join_api;
        proxy_timeout 10m;
        proxy_connect_timeout 1s;
    }
}
```

```yaml
# https://github.com/k0sproject/k0sctl/blob/main/README.md
apiVersion: k0sctl.k0sproject.io/v1beta1
kind: Cluster
metadata:
  name: k0s-cluster
# spec.api.extraArgs kube-apiserver的自定义参数kvmap
# spec.scheduler.extraArgs
# spec.controllerManger.extraArgs
# spec.workerProfiles 覆盖kubelet-config.yaml中的配置 和默认的kubelet-config.yaml合并
# spec.hosts[*].installFlags 配置传递给k0s 安装时的其他配置项
spec:
  storage:
    type: kine
    kine:
      dataSource: "sqlite:///var/lib/k0s/db/state.db?more_rwc&journal=WAL&cache=shared"
  hosts:
    - ssh:
        address: 10.0.0.11
        user: root
        port: 22
        keyPath: /Users/bleem/.ssh/id_rsa
      # role的值
      # controller 单master
      # worker 单worker
      # controller+worker master worker 都运行
      role: controller+worker
      # 声明需要上传二进制文件 从本地机器上传 k0s二进制 不在目标机器下载
      uploadBinary: true
      # 指定二进制文件未知
      k0sBinaryPath: /Users/bleem/tmp/k0s
      # files 配置将会在安装前将相关文件上传到目标机器
      files:
        - name: images-bundle
          # 如何生成bundle_file
          # k0s airgap list-images | xargs -I {} docker pull {}
          # docker image save $(k0s iargap list-images| xargs) -o bundle_file
          src: /Users/bleem/tmp/bundle_file
          dstDir: /var/lib/k0s/images/
          perm: 0755
        - name: flannel
          src: /Users/bleem/tmp/kube-flannel.yaml
          dstDir: /var/lib/k0s/manifests/flannel
          perm: 0644
        - name: cni-plugins
          # https://github.com/containernetworking/plugins/releases
          src: /Users/bleem/tmp/cni-plugins/*
          dstDir: /opt/cni/bin/
          perm: 0755
    - ssh:
        address: 10.0.0.14
        user: root
        port: 22
        keyPath: /Users/bleem/.ssh/id_rsa
      role: worker
      # 声明需要上传二进制文件 从本地机器上传 k0s二进制 不在目标机器下载
      uploadBinary: true
      # 指定二进制文件未知
      k0sBinaryPath: /Users/bleem/tmp/k0s
      # files 配置将会在安装前将相关文件上传到目标机器
      files:
        - name: images-bundle
          # 如何生成bundle_file
          # k0s airgap list-images | xargs -I {} docker pull {}
          # docker image save $(k0s iargap list-images| xargs) -o bundle_file
          src: /Users/bleem/tmp/bundle_file
          dstDir: /var/lib/k0s/images/
          perm: 0755
        - name: cni-plugins
          # https://github.com/containernetworking/plugins/releases
          src: /Users/bleem/tmp/cni-plugins/*
          dstDir: /opt/cni/bin/
          perm: 0755
  k0s:
    version: 1.21.2+k0s.1
    config:
      apiVersion: k0s.k0sproject.io/v1beta1
      kind: Cluster
      metadata:
        name: k0s
      spec:
        api:
          # 此处填写外部负载均衡器地址 所有kubelet都会链接这个地址
          externalAddress: 10.0.0.20
          address: 10.0.0.11
          port: 6443
          k0sApiPort: 9443
          installConfig:
            users:
              etcdUser: etcd
              kineUser: kube-apiserver
              konnectivityUser: konnectivity-server
              kubeAPIserverUser: kube-apiserver
              kubeSchedulerUser: kube-scheduler
          konnectivity:
            adminPort: 8133
            agentPort: 8132
          network:
            kubeProxy:
              disabled: false
              mode: iptables
            kuberouter:
              autoMTU: true
              mtu: 0
              peerRouterASNs: ""
              peerRouterIPs: ""
            podCIDR: ""
            provider: "kuberouter"
            serviceCIDR: ""
          podSecurityPolicy:
            defaultPolicy: "00-k0s-privileged"
          sans:
            - 10.0.0.11
        storage:
          type: etcd
          etcd:
            peerAddress: 10.0.0.11
        images:
          konnectivity:
            image: us.gcr.io/k8s-artifacts-prod/kas-network-proxy/proxy-agent
            version: v0.0.21
          metricsserver:
            image: gcr.io/k8s-staging-metrics-server/metrics-server
            version: v0.3.7
          kubeproxy:
            image: k8s.gcr.io/kube-proxy
            version: v1.21.3
          coredns:
            image: docker.io/coredns/coredns
            version: 1.7.0
          calico:
            cni:
              image: docker.io/calico/cni
              version: v3.18.1
            node:
              image: docker.io/calico/node
              version: v3.18.1
            kubecontrollers:
              image: docker.io/calico/kube-controllers
              version: v3.18.1
          kuberouter:
            cni:
              image: docker.io/cloudnativelabs/kube-router
              version: v1.2.1
            cniInstaller:
              image: quay.io/k0sproject/cni-node
              version: 0.1.0
          default_pull_policy: IfNotPresent
          #default_pull_policy: Never
        network:
          podCIDR: 10.244.0.0/16
          serviceCIDR: 10.96.0.0/12
          # 这里指定为custom 就不会安装calico/kubu-router 
          provider: custom
          kubeProxy:
            disabled: false
            mode: ipvs
        # 不发送匿名统计信息
        telemetry:
          enabled: false
```

## k3s

### 安装

```shell
sudo curl -fsSL https://github.com/k3s-io/k3s/releases/latest/download/k3s -o /usr/local/bin/k3s && sudo chmod +x /usr/local/bin/k3s
```


### 生成 config.yaml文件

```shell
sudo mkdir -p /etc/rancher/k3s && sudo touch /etc/rancher/k3s/config.yaml
```

