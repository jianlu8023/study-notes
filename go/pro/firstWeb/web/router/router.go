package router

import (
	"main.go/web/controller"
	"net/http"
)

func SetRouter() {
	http.HandleFunc("/", controller.IndexWeb)
	http.HandleFunc("/test/login", controller.Login)
	http.HandleFunc("/test/result", controller.GetResult)
	http.HandleFunc("/db/login", controller.DbLogin)
}
