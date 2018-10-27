package handler

import (
	"github.com/jinzhu/gorm"
)

type Controller struct {
	DB        *gorm.DB
	DebugMode bool
}

func NewController(db *gorm.DB, debugMode bool) *Controller {
	return &Controller{
		DB:        db,
		DebugMode: debugMode,
	}
}
