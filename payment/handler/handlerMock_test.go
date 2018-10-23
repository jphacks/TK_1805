package handler

import (
	"testing"

	"github.com/KeisukeYamashita/TK_1805/payment/types"
	. "github.com/smartystreets/goconvey/convey"
)

func TestWhere(t *testing.T) {
	SkipConvey("TestWhere", t, func() {
	})
}

func TestFirst(t *testing.T) {
	Convey("TestFirst", t, func() {
		Convey("when something bad happens with error", func() {
			user := &types.User{}
			mdb := &MockDB{
				Err: true,
			}
			ctr := NewController(mdb)
			err := ctr.DB.First(user)
			So(err, ShouldNotBeNil)
		})
		Convey("when it has no error", func() {
			user := &types.User{}
			mdb := &MockDB{
				Err:  false,
				User: user,
			}
			ctr := NewController(mdb)
			err := ctr.DB.First(user)
			So(err, ShouldBeNil)
			So(user.StripeCustomerID, ShouldEqual, "cus_hogehoge")
		})
	})
}

func TestModel(t *testing.T) {
	SkipConvey("TestModel", t, func() {
	})
}

func TestUpdate(t *testing.T) {
	beforeStripeID := "cus_beforebefore"
	afterStripeID := "cus_afterafter"
	Convey("TestUpdate", t, func() {
		Convey("when something bad happens with error", func() {
			user := &types.User{
				StripeCustomerID: beforeStripeID,
			}
			mdb := &MockDB{
				Err: true,
			}
			ctr := NewController(mdb)
			err := ctr.DB.Model(user).Update(beforeStripeID, afterStripeID)
			So(err, ShouldNotBeNil)
		})

		Convey("when it has no error", func() {
			user := &types.User{
				StripeCustomerID: beforeStripeID,
			}
			mdb := &MockDB{
				Err:  false,
				User: user,
			}
			ctr := NewController(mdb)
			err := ctr.DB.Model(user).Update(beforeStripeID, afterStripeID)
			So(err, ShouldBeNil)
			So(mdb.User.StripeCustomerID, ShouldEqual, afterStripeID)
		})
	})
}
