package controller

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"io"
	"log"
	"main.go/web/entity"
	"net/http"
	"strings"
)

func DbLogin(w http.ResponseWriter, r *http.Request) {
	var user entity.User
	var result entity.AjaxResult

	var username, password string

	if r.Method == http.MethodGet {
		//	get
		res := r.URL.Query()
		username = res.Get("username")
		password = res.Get("password")
		fmt.Println("get username:", username)
		fmt.Println("get password:", password)
	} else if r.Method == http.MethodPost {
		//	postParam
		defer r.Body.Close()
		bytes, _ := io.ReadAll(r.Body)
		username = postParam("username", string(bytes))
		password = postParam("password", string(bytes))
		fmt.Println("postParam username:", username)
		fmt.Println("postParam password:", password)
	}

	db, err := sql.Open("mysql", "root:123456@tcp(192.168.58.128:3306)/go?charset=utf8")
	if db == nil {
		result.Code = entity.BusinessFailCode
		result.Obj = nil
		result.Message = fmt.Errorf("连接数据库时发生错误:%s", err).Error()
		result.Success = false
		by, _ := json.Marshal(result)
		w.Write(by)
		log.Print(">>> 连接数据库时发生错误:", err)
		return
	}
	if err = db.Ping(); err != nil {
		result.Code = entity.BusinessFailCode
		result.Obj = nil
		result.Message = fmt.Errorf("测试连接数据库时发生错误:%s", err).Error()
		result.Success = false
		by, _ := json.Marshal(result)
		w.Write(by)
		return
	}
	query := "select username,password from user where username = ?"
	stmt, err := db.Prepare(query)
	if err != nil {
		result.Code = entity.BusinessFailCode
		result.Obj = nil
		result.Message = fmt.Errorf("预编译SQL时发生错误:%s", err).Error()
		result.Success = false
		by, _ := json.Marshal(result)
		w.Write(by)
		return
	}
	rows, err := stmt.Query(username)

	if err != nil {
		result.Code = entity.BusinessFailCode
		result.Obj = nil
		result.Message = fmt.Errorf("查询数据时发生错误:%s", err).Error()
		result.Success = false
		by, _ := json.Marshal(result)
		w.Write(by)
		return
	}
	if rows.Next() {
		err := rows.Scan(&user.UserName, &user.PassWord)
		if err != nil {
			result.Code = entity.BusinessFailCode
			result.Obj = nil
			result.Message = fmt.Errorf("读取数据时发生错误:%s", err).Error()
			result.Success = false
			by, _ := json.Marshal(result)
			w.Write(by)

			return
		}
	}

	if password != user.PassWord {
		w.Write([]byte("username or password error"))
		fmt.Sprintf("用户名或密码不正确!")

		result.Code = entity.BusinessFailCode
		result.Obj = nil
		result.Message = fmt.Sprintf("用户名或密码不正确!")
		result.Success = false
		by, _ := json.Marshal(result)
		w.Write(by)
		return
	}
	result = entity.AjaxResult{
		Code:    entity.PostSuccessCode,
		Obj:     user,
		Message: "业务处理成功",
		Success: true,
	}
	bytes, _ := json.Marshal(result)
	w.Write(bytes)
}

func postParam(name string, str string) (returns string) {
	countSplit := strings.Split(str, "&") //用&切分字符串
	post := countSplit                    //储存至临时变量
	var post_len = 2020                   //定义post_len变量 类型为int
	post_len = len(post) - 1              //获取数组post中数组的数量

	for i := 0; i <= post_len; i++ {
		countSplits := strings.Split(post[i], "=") //用=切分字符串
		if name == countSplits[0] {                //判断是否符合条件
			returns = countSplits[1] //保存内容至returns
			break                    //跳出循环
		} else {
			returns = ""
		}
	}
	return returns //返回值
}
