package main

import (
	"github.com/KeisukeYamashita/TK_1805/store/app"
	"github.com/kataras/iris"
)

func main() {
	app := app.NewIrisApp()
	app.Run(iris.Addr(":8880"))
}
