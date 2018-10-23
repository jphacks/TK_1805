package main

import (
	"github.com/KeisukeYamashita/TK_1805/store/app"
	"github.com/kataras/iris"
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
	app.Run(iris.Addr(":8880"))
}
