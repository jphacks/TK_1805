package handler

import (
	"fmt"
	"time"

	"github.com/kataras/golog"

	"github.com/KeisukeYamashita/TK_1805/store/helpers"
	"github.com/KeisukeYamashita/TK_1805/store/types"
	"github.com/kataras/iris"
)

// TODO: 決済が終了していない場合のチェック機能
func (ctr *Controller) CreateGroupId() func(ctx iris.Context) {
	return func(ctx iris.Context) {
		tableID := ctx.FormValue("tableId")

		if tableID == "" {
			golog.Error("table_id_missing")
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusBadRequest,
					"message":    "table_id_missing",
				},
			})
			return
		}

		group := helpers.NewGroup(tableID)

		if err := ctr.DB.Create(&group).Error; err != nil {
			golog.Error(err.Error())
			ctx.StatusCode(iris.StatusInternalServerError)
			ctx.JSON(iris.Map{
				"error": "creation_failed",
			})
			return
		}

		ctx.JSON(iris.Map{
			"error": "",
			"message": iris.Map{
				"groupId": group.Key,
				"state":   "IN_STORE",
			},
		})
	}
}

func (ctr *Controller) GetGroupId() func(ctx iris.Context) {
	return func(ctx iris.Context) {
		tableID := ctx.FormValue("tableId")

		// TODO: tableの存在チェック

		if tableID == "" {
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": "invalid_table_id",
			})
			return
		}

		group := new(types.Group)

		if err := ctr.DB.Last(group, "table_key = ?", tableID).Error; err != nil {
			golog.Error(fmt.Sprintf("DB error in GetGroupId when finding group: %v", err.Error()))
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": "group_not_found",
			})
			return
		}

		if group.EnteredAt == nil {
			enteredAt := time.Now()
			group.EnteredAt = &enteredAt

			ctr.DB.Save(&group)
		}

		groupID := &group.Key
		state := &group.State
		table := new(types.Table)

		if err := ctr.DB.First(table, "table_key = ?", tableID).Error; err != nil {
			golog.Error(fmt.Sprintf("DB error in GetGroupId when finding table: %v", err.Error()))
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": "table_not_found",
			})
			return
		}

		storeID := &table.StoreID

		ctx.JSON(iris.Map{
			"error": "",
			"message": iris.Map{
				"groupId":   groupID,
				"storeId":   storeID,
				"state":     state,
				"enteredAt": group.EnteredAt.Local().Format(time.RFC1123Z),
			},
		})
	}
}
