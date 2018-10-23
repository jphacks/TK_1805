package app

import (
	"github.com/kataras/iris"
)

func NewIrisApp() *iris.Application {
	app := iris.Default()

	app.Get("/healthy", func(ctx iris.Context) {
		ctx.WriteString("OK")
	})

	return app
}
