package entity

type AjaxResult struct {
	Code    int         `json:"code"`
	Obj     interface{} `json:"obj"`
	Message string      `json:"message"`
	Success bool        `json:"success"`
}
type User struct {
	UserName string `json:"username"`
	PassWord string `json:"password"`
}
