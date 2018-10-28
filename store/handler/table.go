package handler

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/KeisukeYamashita/TK_1805/store/types"
	"github.com/kataras/iris"
)

func (ctr *Controller) CreateGroupId() func(ctx iris.Context) {
	return func(ctx iris.Context) {
		tableID := ctx.FormValue("tableId")

		if tableID == "" {
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusBadRequest,
					"message":    "tableId is missing",
				},
			})
			return
		}

		now := time.Now()
		data := fmt.Sprintf("%v-%v", tableID, now)
		keyByteArray := sha256.Sum256([]byte(data))

		keyBase := base64.StdEncoding.EncodeToString(keyByteArray[:])

		group := types.Group{
			Key:      keyBase,
			TableKey: tableID,
			State:    "IN_STORE",
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
				"groupId": keyBase,
				"state":   "IN_STORE",
			},
		})
		return
	}
}

func (ctr *Controller) FetchState() func(ctx iris.Context) {
	return func(ctx iris.Context) {
		tableID := ctx.FormValue("tableId")

		if tableID == "" {
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusBadRequest,
					"message":    "tableId is missing",
				},
			})
			return
		}

		group := new(types.Group)

		if err := ctr.DB.Where("table_key = ?", tableID).First(group); err.Error != nil {
			ctx.StatusCode(iris.StatusInternalServerError)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusInternalServerError,
					"message":    err.Error,
				},
			})
			return
		}

		groupID := &group.Key
		state := &group.State

		table := new(types.Table)

		if err := ctr.DB.Where("table_key = ?", tableID).First(table); err.Error != nil {
			ctx.StatusCode(iris.StatusInternalServerError)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusInternalServerError,
					"message":    err.Error,
				},
			})
			return
		}

		storeID := &table.StoreID

		ctx.JSON(iris.Map{
			"error": "",
			"message": iris.Map{
				"groupId": groupID,
				"storeId": storeID,
				"state":   state,
			},
		})

		return
	}
}
