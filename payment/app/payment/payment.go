package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/KeisukeYamashita/TK_1805/payment/app"
	"github.com/KeisukeYamashita/TK_1805/payment/handler"
	"github.com/KeisukeYamashita/TK_1805/payment/types"
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
	db types.Datastorable
)

func init() {
	var err error = nil

	if os.Getenv("GO_ENV") != "test" {
		err = godotenv.Load()

		if err != nil {
			log.Fatal(fmt.Sprintf("Error loading .env file: %v", err))
		}

		connectionArgs := fmt.Sprintf("%v:%v@/%v?charset=utf8&parseTime=True&loc=Local", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_DATABASE"))

		dbClient, err := gorm.Open("mysql", connectionArgs)

		if err != nil {
			log.Fatal(fmt.Sprintf("Error while connecting to db: %v", err))
		}

		dbClient.AutoMigrate(&types.User{}, &types.Transaction{})

		db = &types.DB{
			Client: dbClient,
		}
	} else {
		err = godotenv.Load("./.env.test")

		if err != nil {
			log.Fatal(fmt.Sprintf("Error loading .env file: %v", err))
		}

		mdb := new(handler.MockDB)
		db = mdb
	}
}

func main() {
	app := app.NewIrisApp(db)

	go func() {
		if err := app.Run(iris.Addr(":8880")); err != nil {
			log.Fatal("shutting down server")
		}
	}()

	quitSig := make(chan os.Signal)
	signal.Notify(quitSig,
		syscall.SIGHUP,
		syscall.SIGINT,
		syscall.SIGTERM,
		syscall.SIGQUIT)
	<-quitSig

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := app.Shutdown(ctx); err != nil {
		log.Fatal(err)
	}
}
