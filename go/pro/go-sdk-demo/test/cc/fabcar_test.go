package cc

import (
	"errors"
	"fmt"
	"github.com/hxx258456/fabric-sdk-go-gm/pkg/core/config"
	"github.com/hxx258456/fabric-sdk-go-gm/pkg/gateway"
	"os"
	"path/filepath"
	"testing"
)

func Test_queryAllCar(t *testing.T) {
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
	// read the certificate pem
	cert, err := os.ReadFile(filepath.Clean(certPath))
	if err != nil {
		return err
	}

	keyDir := filepath.Join(credPath, "keystore")
	// there's a single file in this dir containing the private key
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
