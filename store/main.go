package main

import (
	"log"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/kataras/iris"

	"github.com/KeisukeYamashita/TK_1805/store/app"
	"github.com/KeisukeYamashita/TK_1805/store/types"
)

var db *gorm.DB
var debugMode bool

func init() {

}

func main() {
	db, err := gorm.Open("mysql", "root:@/jphack2018?charset=utf8&parseTime=True&loc=Local")

	if err != nil {
		log.Fatal(err)
	}

	debugMode = os.Getenv("GO_ENV") == "test"

	db.LogMode(debugMode)
	db.AutoMigrate(&types.User{}, &types.Transaction{}, &types.Store{}, &types.Table{}, &types.Group{})
	app := app.NewIrisApp(db, debugMode)
	app.Run(iris.Addr(":8880"))

	defer db.Close()
}
