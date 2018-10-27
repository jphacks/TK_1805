package handler

import (
	"crypto/sha256"
	"fmt"
	"time"

	"github.com/kataras/iris"
)

func (ctr *Controller) CreateGroupId() func(ctx iris.Context) {
	return func(ctx iris.Context) {
		tableId := ctx.Params().Get("tableId")
		now := time.Now()
		data := fmt.Sprintf("%v-%v", tableId, now)
		key := sha256.Sum256([]byte(data))

		ctx.JSON(iris.Map{
			"error": "",
			"message": iris.Map{
				"groupId": key,
				"state":   "IN_STORE",
			},
		})
		return
	}
}
