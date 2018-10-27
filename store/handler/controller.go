package handler

import (
	"github.com/jinzhu/gorm"
)

type Controller struct {
	DB          *gorm.DB
	DebugMode   bool
	PaymentHost string
	PaymentPort int
}

func NewController(db *gorm.DB, debugMode bool, paymentHost string, paymentPort int) *Controller {
	return &Controller{
		DB:          db,
		DebugMode:   debugMode,
		PaymentHost: paymentHost,
		PaymentPort: paymentPort,
	}
}
