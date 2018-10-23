package app

import (
	"handler"
	"types"
	"github.com/kataras/iris"
)

func NewIrisApp(db types.Datastorable) *iris.Application {
	app := iris.Default()

	app.Get("/healthy", func(ctx iris.Context) {
		ctx.WriteString("OK")
	})

	ctr := handler.NewController(db)

	api := app.Party(fmt.Sprintf("/v%v", types.VERSION))
	api.Post("/store/groups", ctr.CreateGroupId())

	return app
}
