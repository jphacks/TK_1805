package main

import (
	"github.com/kataras/iris"
	"github.com/jinzhu/gorm"
	"log"
	_ "github.com/jinzhu/gorm/dialects/mysql"

	"github.com/KeisukeYamashita/TK_1805/store/app"
	"github.com/KeisukeYamashita/TK_1805/store/types"

)

func main() {
	db, err := gorm.Open("mysql", "root:@/jphack2018?charset=utf8&parseTime=True&loc=Local")
	db.LogMode(true)

	if err != nil {
		log.Fatal(err)
	}

	db.AutoMigrate(&types.User{}, &types.Transaction{}, &types.Store{}, &types.Table{}, &types.Group{})

	app := app.NewIrisApp(db)
	app.Run(iris.Addr(":8880"))

  defer db.Close()
}
