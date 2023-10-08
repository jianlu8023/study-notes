package main

import (
	"fmt"

	"main.go/web/router"
	"net/http"
	"os"
)

func main() {
	//定义请求路径
	router.SetRouter()
	//启动监听
	err := http.ListenAndServe("0.0.0.0:9090", nil)
	if err != nil {
		fmt.Println(fmt.Errorf("监听过程中出现错误:%s", err.Error()))
		os.Exit(1)
	}

}
