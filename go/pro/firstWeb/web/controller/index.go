package controller

import (
	"net/http"
)

func IndexWeb(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello world"))
}
