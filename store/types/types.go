package types

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

const (
	// VERSION is a version of payment API
	VERSION = 1
)

type Store struct {
	gorm.Model
	Name string
}

type Table struct {
	gorm.Model
	Store    Store `gorm:"foreignkey:StoreId"`
	StoreID  int
	TableKey string
}

type Group struct {
	gorm.Model
	Table    Table `gorm:"foreignkey:TableKey"`
	TableKey string
	Key      string
	State    string
}

// User ...
type User struct {
	gorm.Model
	Name             int
	StripeCustomerID string
}

// Transaction ...
type Transaction struct {
	gorm.Model
	User *User
}

// Datastorable ...
type Datastorable interface {
	Where(query, arg interface{}) Datastorable
	First(s interface{}) error
	Model(s interface{}) Datastorable
	Update(query, arg interface{}) error
}

// DB ...
type DB struct {
	Client *gorm.DB
}

// Where ...
func (db *DB) Where(query, arg interface{}) Datastorable {
	db.Client = db.Client.Where(query, arg)
	return db
}

// First ...
func (db *DB) First(s interface{}) error {
	return db.Client.First(s).Error
}

// Model ...
func (db *DB) Model(s interface{}) Datastorable {
	db.Client = db.Client.Model(s)
	return db
}

// Update ...
func (db *DB) Update(query, arg interface{}) error {
	return db.Client.Update(query, arg).Error
}
