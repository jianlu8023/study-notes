package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"main.go/web/entity"
	"net/http"
	"strings"
	"text/template"
)

var myTemplate *template.Template

func GetResult(w http.ResponseWriter, r *http.Request) {
	url := "http://172.25.138.23:9100/update/test/v1/selectById"
	body := strings.NewReader("id=151567ce-3971-458b-b431-45b402ec850b")
	contentType := "application/x-www-form-urlencoded"
	post, err := http.Post(url, contentType, body)
	if err != nil {
		fmt.Sprintf("请求过程中出现错误:%s", err.Error())
	}
	defer post.Body.Close()
	response, err := io.ReadAll(post.Body)

	if err != nil {
		fmt.Sprintf("读取返回值时，出现错误:%s", err.Error())
	}
	var result entity.AjaxResult
	err = json.Unmarshal(response, &result)
	if err != nil {
		fmt.Sprintf("返回值在转json时发生错误:%s", err.Error())
	}
	objMap := result.Obj.(map[string]interface{})
	key := objMap["key"]
	value := objMap["value"]
	log.Print(">>> key : ", key, " value : ", value)
	myTemplate, err = template.ParseFiles("D:\\code\\go\\study\\firstWeb\\static\\template\\index.html")
	myTemplate.Execute(w, result)

}

func Login(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "login method")
}
