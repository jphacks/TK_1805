package app

import (
	"fmt"
	"os"

	"github.com/KeisukeYamashita/payment/handler"
	"github.com/KeisukeYamashita/payment/types"
	"github.com/kataras/iris"
	stripe "github.com/stripe/stripe-go"
)

// NewIrisApp ...
func NewIrisApp(db types.Datastorable) *iris.Application {
	stripe.Key = os.Getenv("SECRET_KEY")

	app := iris.Default()

	app.Get("/healthy", func(ctx iris.Context) { ctx.WriteString("Haha! I am healthy.") })

	ctr := handler.NewController(db)

	api := app.Party(fmt.Sprintf("/v%v", types.VERSION))
	api.Post("/payment", ctr.ExecPayment())

	return app
}
