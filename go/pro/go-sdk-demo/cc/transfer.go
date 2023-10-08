package main

import "github.com/hxx258456/fabric-contract-api-go-gm/contractapi"

type Account struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
}

type TransferContract struct {
	contractapi.Contract
}

func main() {

}
