package app

import (
	"fmt"

	"github.com/KeisukeYamashita/TK_1805/store/handler"
	"github.com/KeisukeYamashita/TK_1805/store/types"
	"github.com/jinzhu/gorm"
	"github.com/kataras/iris"
)

func NewIrisApp(db *gorm.DB) *iris.Application {
	app := iris.Default()

	app.Get("/healthy", func(ctx iris.Context) {
		ctx.WriteString("OK")
	})

	ctr := handler.NewController(db)

	fmt.Printf("v%v\n", types.VERSION)

	api := app.Party(fmt.Sprintf("/v%v", types.VERSION))
	api.Post("/store/groups", ctr.CreateGroupId())

	api.Get("/store/groups", ctr.FetchState())

	api.Get("/store", ctr.CreateGroupId())

	api.Post("/payment", ctr.ExecutePayment())

	return app
}
