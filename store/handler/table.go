package handler

import (
	"crypto/sha256"
	"fmt"
	"time"

	"github.com/KeisukeYamashita/TK_1805/store/types"
	"github.com/kataras/iris"
)

func (ctr *Controller) CreateGroupId() func(ctx iris.Context) {
	return func(ctx iris.Context) {
		tableId := ctx.Params().Get("tableId")
		now := time.Now()
		data := fmt.Sprintf("%v-%v", tableId, now)
		keyByteArray := sha256.Sum256([]byte(data))

		key := string(keyByteArray[:])

		group := types.Group{
			Key: key,
		}

		if err := ctr.DB.Create(&group).Error; err != nil {
			ctx.StatusCode(iris.StatusInternalServerError)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusInternalServerError,
					"message":    err.Error(),
				},
			})
			return
		}

		ctx.JSON(iris.Map{
			"error": "",
			"message": iris.Map{
				// "groupId": key,
				"state": "IN_STORE",
			},
		})
		return
	}
}
