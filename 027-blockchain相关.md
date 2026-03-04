# blockchain相关

## hyperledger fabric

### 配置fabric环境

#### 步骤

```shell
# 1.到gopath目录
cd $GOPATH
# 2.创建文件夹
mkdir {src,pkg,bin}
mkdir -p src/github.com/hyperledger/fabric/
# 3.克隆指定版本fabric
git clone -b v2.2.0 https://gitee.com/hyperledger/fabric.git fabric2.2.0
# 4.进入fabric/script文件夹
cd $GOPATH/src/github.com/hyperledger/fabric/fabric2.2.0/script
# 5.修改bootstrap.sh
vi bootstrap.sh
######################展示有改动位置##########################
# 这里指定fabric-simple版本
VERSION=2.2.0

# 指定fabric-ca版本
CA_VERSION=1.4.9

cloneSamplesRepo() {
    if [ -d test-network ]; then
        echo "==> Already in fabric-samples repo"
    elif [ -d fabric-samples ]; then
        echo "===> Changing directory to fabric-samples"
        cd fabric-samples
    else
        echo "===> Cloning hyperledger/fabric-samples repo"
        # 这里有修改
        git clone -b main https://mirror.ghproxy.com/https://github.com/hyperledger/fabric-samples.git && cd fabric-samples
    fi
    if GIT_DIR=.git git rev-parse v${VERSION} >/dev/null 2>&1; then
        echo "===> Checking out v${VERSION} of hyperledger/fabric-samples"
        git checkout -q v${VERSION}
    else
        echo "fabric-samples v${VERSION} does not exist, defaulting to main. fabric-samples main branch is intended to work with recent versions of fabric."
        git checkout -q main
    fi
}
pullBinaries() {
    echo "===> Downloading version ${FABRIC_TAG} platform specific fabric binaries"
            # 这里有修改
    download "${BINARY_FILE}" "https://mirror.ghproxy.com/https://github.com/hyperledger/fabric/releases/download/v${VERSION}/${BINARY_FILE}"
    if [ $? -eq 22 ]; then
        echo
        echo "------> ${FABRIC_TAG} platform specific fabric binary is not available to download <----"
        echo
        exit
    fi
    echo "===> Downloading version ${CA_TAG} platform specific fabric-ca-client binary"
# 这里有修改
    download "${CA_BINARY_FILE}" "https://mirror.ghproxy.com/https://github.com/hyperledger/fabric-ca/releases/download/v${CA_VERSION}/${CA_BINARY_FILE}"
    if [ $? -eq 22 ]; then
        echo
        echo "------> ${CA_TAG} fabric-ca-client binary is not available to download  (Available from 1.1.0-rc1) <----"
        echo
        exit
    fi
}

# 6.执行脚本
./bootstrap.sh
# 7.启动测试环境
cd fabric-simples/test-network
# 启动测试网络并创建名为mychannel的通道
./network.sh createChannel -ca -s couchdb
# 关闭测试网络
./network.sh down
```

###  

## chainmaker

### chainmaker 学习记录

#### 初始化过程

1. 读取配置文件并将配置文件分别形成webconfig、dbconfig、logconfig三个独立的viper <br>
   数据库表名可修改

   postman显示验证码图片

   ```
   var data = {response: pm.response.json()}
   var template = `<html><img src="{{response.Response.Data.Content}}" /></html>`;
   pm.visualizer.set(template, data);
   
   ```

2. 在jetbrains系列开发环境中创建mysql数据库方法

```mysql
create schema nunu collate utf8mb4_general_ci;
```

3. 长安链处理sdk_config.yml文件

```go

package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/viper"
)


func fix(configPath string) string {
	conf := viper.New()
	conf.SetConfigFile(configPath)
	err := conf.ReadInConfig()
	if err != nil {
		panic(err)
	}
	dir := filepath.Dir(configPath)
	base := filepath.Base(configPath)
	split := strings.Split(base, ".")
	base = split[0] + "_use" + "." + split[1]
	use := filepath.Join(dir, "/", base)
	if strings.Contains(conf.GetString("chain_client.user_key_file_path"), dir) {
		return use
	}
	nodes := conf.Get("chain_client.nodes").([]interface{})
	for i := 0; i < len(nodes); i++ {
		node := nodes[i].(map[string]interface{})
		trp := node["trust_root_paths"]
		paths := trp.([]interface{})
		for j := 0; j < len(paths); j++ {
			s := paths[j].(string)
			paths[j] = dir + s[1:]
		}
	}
	conf.Set("chain_client.user_key_file_path", dir+conf.GetString("chain_client.user_key_file_path")[1:])
	conf.Set("chain_client.user_crt_file_path", dir+conf.GetString("chain_client.user_crt_file_path")[1:])
	conf.Set("chain_client.user_sign_key_file_path", dir+conf.GetString("chain_client.user_sign_key_file_path")[1:])
	conf.Set("chain_client.user_sign_crt_file_path", dir+conf.GetString("chain_client.user_sign_crt_file_path")[1:])
	_, err = os.Stat(use)
	if err == nil {
		// file exist
		return use
	} else if os.IsNotExist(err) {
		// file not exist
		err = conf.SafeWriteConfigAs(use)
		if err != nil {
			fmt.Println(fmt.Errorf("写入配置失败:%s", err))
		}
	} else {
		// other err
	}
	return use
}
func FixSdkConfig(cfg string) string {
   conf := viper.New()
   conf.SetConfigFile(cfg)
   err := conf.ReadInConfig()
   if err != nil {
      panic(err)
   }
   dir := filepath.Dir(cfg)
   base := filepath.Base(cfg)
   split := strings.Split(base, ".")
   base = split[0] + "_use" + "." + split[1]
   use := filepath.Join(dir, "/", base)
   if strings.Contains(conf.GetString("chain_client.user_key_file_path"), dir) {
      return use
   }
   nodes := conf.Get("chain_client.nodes").([]interface{})
   for i := 0; i < len(nodes); i++ {
      node := nodes[i].(map[string]interface{})
      trp := node["trust_root_paths"]
      paths := trp.([]interface{})
      for j := 0; j < len(paths); j++ {
         s := paths[j].(string)
         paths[j] = dir + s[1:]
      }
   }
   conf.Set("chain_client.user_key_file_path", dir+conf.GetString("chain_client.user_key_file_path")[1:])
   conf.Set("chain_client.user_crt_file_path", dir+conf.GetString("chain_client.user_crt_file_path")[1:])
   conf.Set("chain_client.user_sign_key_file_path", dir+conf.GetString("chain_client.user_sign_key_file_path")[1:])
   conf.Set("chain_client.user_sign_crt_file_path", dir+conf.GetString("chain_client.user_sign_crt_file_path")[1:])
   _, err = os.Stat(use)
   if err == nil {
      // file exist
      return use
   } else if os.IsNotExist(err) {
      // file not exist
      err = conf.SafeWriteConfigAs(use)
      if err != nil {
         fmt.Println(fmt.Errorf("写入配置失败:%s", err))
      }
   } else {
      // other err
   }
   return use
}

func main() {
	wd, _ := os.Getwd()
	configPath := filepath.Join(wd, "testdata", "sdk_configs", "sdk_config.yml")
	use := fix(configPath)
	fmt.Println(use)
}

```

4. gin上传文件

```text
只获取文件文件 ctx.FormFile()    
    函数定义func (c *Context) FormFile(name string) (*multipart.FileHeader, error)

获取文件和字段 ctx.MultipartForm()
    函数定义func (c *Context) MultipartForm() (*multipart.Form, error)

```

5. 长安链调用invoke可以有时间戳，长安链调用query不返回时间戳


6. curl 发送请求

```shell
curl -X POST http://172.31.144.20:8000/register --data-raw "{\"username\":\"test\",\"password\":\"testpw\",\"email\":\"test@email.com\"}"
```

7. x
8. x




