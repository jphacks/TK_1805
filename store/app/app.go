package app

import (
	"fmt"

	"github.com/KeisukeYamashita/TK_1805/store/handler"
	"github.com/KeisukeYamashita/TK_1805/store/types"
	"github.com/iris-contrib/middleware/cors"
	"github.com/jinzhu/gorm"
	"github.com/kataras/iris"
)

// NewIrisApp ...
func NewIrisApp(db *gorm.DB, debugMode bool, host string, port int) *iris.Application {
	app := iris.New()

	crs := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})

	app.Get("/", func(ctx iris.Context) {
		ctx.WriteString("OKOK")
	})

	app.Get("/healthy", func(ctx iris.Context) {
		ctx.WriteString("OK")
	})

	ctr := handler.NewController(db, debugMode, host, port)

	api := app.Party(fmt.Sprintf("/v%v", types.VERSION), crs).AllowMethods(iris.MethodOptions)

	api.Get("/store/groups", ctr.GetGroupId())
	api.Post("/store/groups", ctr.CreateGroupId())
	api.Get("/store", ctr.CreateGroupId())
	api.Post("/payment", ctr.ExecutePayment())

	api.Post("/linepay/reserve", ctr.LinepayReserve())
	api.Get("/linepay/confirm", ctr.LinepayConfirm())

	return app
}
