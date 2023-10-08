package middleware

import (
	"github.com/go-resty/resty/v2"
	"github.com/tidwall/gjson"
	"github.com/valyala/fasthttp"
	"github.com/valyala/fastjson"
	"testing"
)

func TestGetPackage(t *testing.T) {

	var parser fastjson.Parser
	parser.Parse("")

	fasthttp.Post(nil, "", nil)

	resty.New()
	gjson.Parse("")
}
