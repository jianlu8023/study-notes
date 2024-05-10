package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"
)

const (
	ssPattern = `{{nodeName}}=Shadowsocks,{{server}},{{port}},{{enc}},"{{password}}",fast-open={{fastOpen}},udp={{udpOp}}`
)

func main() {
	_ = "shadowsocks=54.95.163.121:443, method=aes-256-cfb, password=amazonskr05, fast-open=false, udp-relay=false, tag=VIP专线（日本）JP, Osaka"

	file, err := os.Open("proxy/lq.snippet")
	if err != nil {
		fmt.Println("open file error", err)
	}

	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			fmt.Println("close file error", err)
		}
	}(file)

	reader := bufio.NewReader(file)
	for {
		line, _, err := reader.ReadLine()
		if err != nil && err == io.EOF {
			break
		}
		fmt.Println(convert(string(line)))
	}
}

func convert(str string) string {
	pattern := `(\w+(?:-\w+)?)=("[^"]*"|\S+)`
	compile := regexp.MustCompile(pattern)
	match := compile.FindAllStringSubmatch(str, -1)
	params := make(map[string]string)
	for _, match := range match {
		if match[1] == "tag" {
			params[fmt.Sprintf("{{%s}}", "nodeName")] = match[2][:len(match[2])-1]
		} else if match[1] == "shadowsocks" {
			params[fmt.Sprintf("{{%s}}", "pattern")] = "ssPattern"
			split := strings.Split(match[2], ":")
			params[fmt.Sprintf("{{%s}}", "server")] = split[0]
			params[fmt.Sprintf("{{%s}}", "port")] = split[1][:len(split[1])-1]
		} else if match[1] == "method" {
			params[fmt.Sprintf("{{%s}}", "enc")] = match[2][:len(match[2])-1]
		} else if match[1] == "password" {
			params[fmt.Sprintf("{{%s}}", "password")] = match[2][:len(match[2])-1]
		} else if match[1] == "fast-open" {
			params[fmt.Sprintf("{{%s}}", "fastOpen")] = match[2][:len(match[2])-1]
		} else if match[1] == "udp-relay" {
			params[fmt.Sprintf("{{%s}}", "udpOp")] = match[2][:len(match[2])-1]
		}
	}
	dst := make([]byte, len(ssPattern))
	copy(dst, ssPattern)

	if params["{{pattern}}"] == "ssPattern" {
		for p, r := range params {
			re := regexp.MustCompile(p)
			dst = re.ReplaceAll(dst, []byte(r))
		}
	}
	return string(dst)
}
