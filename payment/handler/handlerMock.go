package handler

import (
	"errors"

	"github.com/KeisukeYamashita/TK_1805/payment/types"
)

// MockDB ...
type MockDB struct {
	User *types.User
	Err  bool
}

// Where ...
func (mdb *MockDB) Where(query, arg interface{}) types.Datastorable {
	return mdb
}

// First ...
func (mdb *MockDB) First(i interface{}) error {
	if mdb.Err {
		return errors.New("it is error by tester")
	}

	switch model := i.(type) {
	case *types.User:
		model.StripeCustomerID = "cus_hogehoge"
	}

	return nil
}

// Model ...
func (mdb *MockDB) Model(i interface{}) types.Datastorable {
	switch ia := i.(type) {
	case *types.User:
		mdb.User = ia
		return mdb
	}

	return mdb
}

// Update ...
func (mdb *MockDB) Update(query, arg interface{}) error {
	if mdb.Err {
		return errors.New("it is error by tester")
	}

	switch a := arg.(type) {
	case string:
		mdb.User.StripeCustomerID = a
	}

	return nil
}
