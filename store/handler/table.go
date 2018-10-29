package handler

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/kataras/golog"

	"github.com/KeisukeYamashita/TK_1805/store/types"
	"github.com/kataras/iris"
)

// TODO: 決済が終了していない場合のチェック機能
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
	}
}

func (ctr *Controller) GetGroupId() func(ctx iris.Context) {
	return func(ctx iris.Context) {
		tableID := ctx.FormValue("tableId")

		if tableID == "" {
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": "tableId is missing",
			})
			return
		}

		group := new(types.Group)

		if err := ctr.DB.First(group, "table_key = ?", tableID).Error; err != nil {
			golog.Error(fmt.Sprintf("DB error in GetGroupId when finding group: %v", err.Error()))
			ctx.StatusCode(iris.StatusInternalServerError)
			return
		}

		if group == nil {
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": "The target group is not found",
			})
			return
		}

		groupID := &group.Key
		state := &group.State
		table := new(types.Table)

		if err := ctr.DB.First(table, "table_key = ?", tableID).Error; err != nil {
			golog.Error(fmt.Sprintf("DB error in GetGroupId when finding table: %v", err.Error()))
			ctx.StatusCode(iris.StatusInternalServerError)
			return
		}

		if table == nil {
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": "The target table was not found",
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
	}
}
