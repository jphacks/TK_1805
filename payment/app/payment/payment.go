package main

import (
	"fmt"
	"log"
	"os"

	"github.com/KeisukeYamashita/payment/app"
	"github.com/KeisukeYamashita/payment/types"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"
	"github.com/kataras/iris"
)

const (
	// VERSION is a version of payment API
	VERSION = 1
)

var (
	db *gorm.DB
)

func init() {
	var err error = nil

	if os.Getenv("GO_ENV") != "test" {
		err = godotenv.Load()
	}

	if err != nil {
		log.Fatal(fmt.Sprintf("Error loading .env file: %v", err))
	}

	if os.Getenv("GO_ENV") == "TEST" {
		connectionArgs := fmt.Sprintf("%v:%v@/%v?charset=utf8&parseTime=True&loc=Local", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_DATABASE"))

		db, err = gorm.Open("mysql", connectionArgs)
		if err != nil {
			log.Fatal(fmt.Sprintf("Error while connecting to db: %v", err))
		}

		db.AutoMigrate(&types.User{}, &types.Transaction{})
	}
}

func main() {
	db := &types.DB{
		Client: db,
	}

	app := app.NewIrisApp(db)
	app.Run(iris.Addr(":8880"))
}
