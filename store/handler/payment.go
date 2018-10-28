package handler

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	"github.com/KeisukeYamashita/TK_1805/store/types"
	"github.com/k0kubun/pp"
	"github.com/kataras/iris"
)

// Payment ...
type Payment struct {
	Amount int
	UserID int
	Token  string
}

// PaymentInfo ...
type PaymentInfo struct {
	Error   interface{}
	Message *Message
}

// Message ...
type Message struct {
	CustomerID  string
	Amount      int `json:"amount"`
	Currency    string
	Description string
	ChargeID    string
}

// PaymentError ...
type PaymentError struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}

// ExecutePayment ...
func (ctr *Controller) ExecutePayment() func(ctx iris.Context) {
	return func(ctx iris.Context) {
		var payment Payment

		if err := ctx.ReadJSON(&payment); err != nil {
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusBadRequest,
					"message":    err.Error(),
				},
			})
			return
		}

		pp.Println(payment)

		if payment.Amount == 0 || payment.UserID == 0 {
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusBadRequest,
					"message":    "amount or userID is missing",
				},
			})
			return
		}

		var resp *http.Response
		var err error

		if payment.Token == "" {
			user := new(types.User)
			if err := ctr.DB.Where("id = ?", payment.UserID).First(user); err.Error != nil {
				ctx.StatusCode(iris.StatusBadRequest)
				ctx.JSON(iris.Map{
					"error": iris.Map{
						"statusCode": iris.StatusBadRequest,
						"message":    err.Error,
					},
				})
				return
			}
			if user == nil {
				ctx.StatusCode(iris.StatusBadRequest)
				ctx.JSON(iris.Map{
					"error": iris.Map{
						"statusCode": iris.StatusBadRequest,
						"message":    "user doesn't exist",
					},
				})
				return
			}
			stripeCustomerID := user.StripeCustomerID

			paymentURL := fmt.Sprintf("%v:%v/v1/payment", ctr.PaymentHost, ctr.PaymentPort)

			amountStr := strconv.Itoa(payment.Amount)
			userIDStr := strconv.Itoa(payment.UserID)

			resp, err = http.PostForm(paymentURL, url.Values{"amount": {amountStr}, "userID": {userIDStr}, "customerID": {stripeCustomerID}})

			if err != nil {
				ctx.StatusCode(iris.StatusInternalServerError)
				ctx.JSON(iris.Map{
					"error": iris.Map{
						"statusCode": iris.StatusInternalServerError,
						"message":    "Payment server connect error",
					},
				})
				return
			}

			byteArray, err := ioutil.ReadAll(resp.Body)

			if err != nil {
				ctx.StatusCode(iris.StatusBadRequest)
				ctx.JSON(iris.Map{
					"error": iris.Map{
						"statusCode": iris.StatusBadRequest,
						"message":    "byteArray Error",
					},
				})
				return
			}

			resp_info := new(PaymentInfo)

			if err := json.Unmarshal(([]byte)(byteArray), resp_info); err != nil {
				ctx.StatusCode(iris.StatusBadRequest)
				ctx.JSON(iris.Map{
					"error": iris.Map{
						"statusCode": iris.StatusBadRequest,
						"message":    "MarshalError",
					},
				})
				return
			}

			switch paymentErrInfo := resp_info.Error.(type) {
			case string:
				//TODO confirm type of resp_info
				fmt.Print(paymentErrInfo)
				ctx.JSON(resp_info)
				return
			default:
				ctx.StatusCode(iris.StatusInternalServerError)
				ctx.JSON(iris.Map{
					"error": iris.Map{
						"statusCode": iris.StatusInternalServerError,
						"message":    "not payment error",
					},
				})
				return
			}
		}
		user := types.User{
			Name: payment.UserID,
		}

		if err := ctr.DB.Create(&user).Error; err != nil {
			ctx.StatusCode(iris.StatusInternalServerError)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusInternalServerError,
					"message":    err.Error(),
				},
			})

			return
		}

		amountStr := strconv.Itoa(payment.Amount)
		userIDStr := strconv.Itoa(payment.UserID)

		paymentURL := fmt.Sprintf("%v:%v/v1/payment", ctr.PaymentHost, ctr.PaymentPort)
		resp, err = http.PostForm(paymentURL, url.Values{"stripeToken": {payment.Token}, "amount": {amountStr}, "userID": {userIDStr}})
		pp.Println(resp)
		if err != nil {
			ctx.StatusCode(iris.StatusInternalServerError)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusInternalServerError,
					"message":    "Payment server connect error",
				},
			})
			return
		}

		ctx.JSON(iris.Map{
			"error": "",
			"message": iris.Map{
				"amount": 4000,
			},
		})
		return
	}
}
