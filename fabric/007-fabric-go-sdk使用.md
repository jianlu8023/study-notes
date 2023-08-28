<a id = "top"></a>

# fabric-sdk-go 使用

----

## 目录

> * [sdk调用chaincode](#1)
> * [sdk创建channel](#2)





<a id = "1"></a>

## sdk chaincode

样例:

[comment]: <> (https://blog.csdn.net/qq_28052455/article/details/130218103)

```go
package example

import (
	"fmt"
	"errors"
	"os"
	"path/filepath"

	"github.com/hyperledger/fabric-sdk-go/pkg/gateway"
	"github.com/hyperledger/fabric-sdk-go/pkg/core/config"
)

func example() {
	os.Setenv("DISCOVERY_AS_LOCALHOST", "false")
	wallet, err := gateway.NewFileSystemWallet(filepath.Join(os.Getenv("GOPATH"),
		"study",
		"go-sdk-demo",
		"wallet",
	))
	if err != nil {
		fmt.Println(fmt.Sprintf("创建钱包时发生错误: %s", err))
	}
	if !wallet.Exists("appUser") {
		err = createWallet(wallet)
		if err != nil {
			fmt.Println(fmt.Sprintf("创建appUser时发生错误:%s", err))
		}
	}
	ccpath := filepath.Join(
		os.Getenv("GOPATH"),
		"study",
		"go-sdk-demo",
		"test-network",
		"connection",
		"connection-org1.yaml",
	)
	gw, err := gateway.Connect(
		gateway.WithConfig(config.FromFile(filepath.Clean(ccpath))),
		gateway.WithIdentity(wallet, "appUser"),
	)
	if err != nil {
		fmt.Println(fmt.Sprintf("创建网关时发生错误:%s", err))
	}
	network, err := gw.GetNetwork("mychannel")
	if err != nil {
		fmt.Println(fmt.Sprintf("获取通道时发生错误:%s", err))
	}

	contract := network.GetContract("baisc")
	allAssert, err := contract.EvaluateTransaction("GetAllAssets")

	if err != nil {
		fmt.Println(fmt.Sprintf("调用合约时发生错误:%s", err))
	}
	fmt.Println(string(allAssert))
}
func createWallet(wallet *gateway.Wallet) error {
	credPath := filepath.Join(
		os.Getenv("GOPATH"),
		"study",
		"go-sdk-demo",
		"test-network",
		"organizations",
		"peerOrganizations",
		"org1.example.com",
		"users",
		"User1@org1.example.com",
		"msp",
	)
	certPath := filepath.Join(credPath, "signcerts", "cert.pem")
	cert, err := os.ReadFile(filepath.Clean(certPath))
	if err != nil {
		return err
	}
	keyDir := filepath.Join(credPath, "keystore")
	files, err := os.ReadDir(keyDir)
	if err != nil {
		return err
	}
	if len(files) != 1 {
		return errors.New("keystore folder should have contain one file")
	}
	keyPath := filepath.Join(keyDir, files[0].Name())
	key, err := os.ReadFile(filepath.Clean(keyPath))
	if err != nil {
		return err
	}
	identity := gateway.NewX509Identity("Org1MSP", string(cert), string(key))
	err = wallet.Put("appUser", identity)
	if err != nil {
		return err
	}
	return nil
}
```

<a id = "2"></a>

## sdk channel

[comment]: <> (https://www.cnblogs.com/liuhui5599/p/14195513.html)

[comment]: <> (https://blog.csdn.net/qq_28052455/article/details/126819799?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169287664216800226574653%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=169287664216800226574653&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-2-126819799-null-null.268^v1^koosearch&utm_term=fabric&spm=1018.2226.3001.4450)