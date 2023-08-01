### go原生web开发

#### 准备工作

go version: 1.19.11</br>
goland</br>
go相关配置:goproxy等

#### 操作数据库

步骤：

1. 引入驱动</br>
   ```go
   import( 
       // 此处_ 表示引入进行初始化操作
       _ "github.com/go-sql-driver/mysql"
   )
   ```
   连接哪种数据库，就需要引入哪种数据库的连接驱动，否则会报错并且创建的数据库连接对象为nil
2. 创建连接对象
    ```go
   db, err := sql.Open("mysql", "root:123456@tcp(192.168.58.128:3306)/go?charset=utf8")
   if db == nil {
        L.Print(">>> 连接数据库时发生错误:", err)
        return
    } 
   ```
3. 测试连接对象
   ```go
   if err = db.Ping(); err != nil {
        return
    }
   ```
4. 构造查询语句
   ```go
   query := "select username,password from user where username = ?"
   ```
5. 预编译
   ```go
   stmt, err := db.Prepare(query)
    if err != nil {
        return
    }
   ```
6. 传入参数并获取查询结果
   ```go
   rows, err := stmt.Query(username)

    if err != nil {
        return
    }
   ```

7. 遍历生成对象
   ```go
   if rows.Next() {
		err := rows.Scan(&user.UserName, &user.PassWord)
		if err != nil {
			return
		}
	}
   ```

完整代码如下:

```go
package test

import (
	"database/sql"
	//驱动
	_ "github.com/go-sql-driver/mysql"
	"log"
	"main.go/web/entity"
)

var L log.Logger
func dbOperate() {
	var user entity.User

	var username string

	db, err := sql.Open("mysql", "root:123456@tcp(192.168.58.128:3306)/go?charset=utf8")
	if db == nil {
		L.Print(">>> 连接数据库时发生错误:", err)
		return
	}
	if err = db.Ping(); err != nil {

		return
	}
	query := "select username,password from user where username = ?"
	stmt, err := db.Prepare(query)
	if err != nil {
		return
	}
	rows, err := stmt.Query(username)

	if err != nil {
		return
	}
	if rows.Next() {
		err := rows.Scan(&user.UserName, &user.PassWord)
		if err != nil {
			return
		}
	}
}
```

#### main.go

```go
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
		fmt.Errorf("监听过程中出现错误:%s", err.Error())
		os.Exit(1)
	}

}
```

#### router.go

```go
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

```

#### handle

```go
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

```

#### 模板方式返回
```go
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

```