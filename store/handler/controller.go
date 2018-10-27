package handler

import (
	"github.com/jinzhu/gorm"
)

type Controller struct {
  DB *gorm.DB
}

func NewController(db *gorm.DB) *Controller {
	return &Controller{
    DB: db,
  }
}
