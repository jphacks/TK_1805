package handler

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	"github.com/KeisukeYamashita/TK_1805/store/types"
	"github.com/kataras/golog"
	"github.com/kataras/iris"
)

// Payment ...
type Payment struct {
	Amount int
	UserID string
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
		golog.Info("ExecutePayment is called")
		var payment Payment

		if err := ctx.ReadJSON(&payment); err != nil {
			golog.Warn(fmt.Sprintf("ExecutePayment parse failed: %v", err.Error()))
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusBadRequest,
					"message":    err.Error(),
				},
			})
			return
		}

		golog.Info("ExecutePayment parse success")

		if payment.Amount == 0 || payment.UserID == "" {
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
			golog.Info("ExecutePayment is not first payment")
			user := new(types.User)
			if err := ctr.DB.Where("id = ?", payment.UserID).First(user); err != nil {
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

			resp, err = http.PostForm(paymentURL, url.Values{"amount": {amountStr}, "userID": {payment.UserID}, "customerID": {stripeCustomerID}})

			if err != nil {
				golog.Warn(fmt.Sprintf("ExecutePayment request failed: %v", err.Error()))
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

			respInfo := new(PaymentInfo)

			if err := json.Unmarshal(([]byte)(byteArray), respInfo); err != nil {
				ctx.StatusCode(iris.StatusBadRequest)
				ctx.JSON(iris.Map{
					"error": iris.Map{
						"statusCode": iris.StatusBadRequest,
						"message":    "MarshalError",
					},
				})
				return
			}

			switch paymentErrInfo := respInfo.Error.(type) {
			case string:
				//TODO confirm type of respInfo
				fmt.Print(paymentErrInfo)
				ctx.JSON(iris.Map{
					"error": "",
					"message": iris.Map{
						"state": "ok",
					},
				})
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
		golog.Info("ExecutePayment is first payment")
		user := types.User{
			Name: payment.UserID,
		}

		if err := ctr.DB.Create(&user).Error; err != nil {
			golog.Warn(fmt.Sprintf("ExecutePayment create user failed: %v", err.Error()))
			ctx.StatusCode(iris.StatusInternalServerError)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusInternalServerError,
					"message":    err.Error(),
				},
			})

			return
		}
		golog.Info("ExecutePayment created user")
		amountStr := strconv.Itoa(payment.Amount)

		paymentURL := fmt.Sprintf("%v:%v/v1/payment", ctr.PaymentHost, ctr.PaymentPort)
		resp, err = http.Post(paymentURL+"?stripeToken="+payment.Token+"&amount="+amountStr+"&userID="+payment.UserID, "", nil)
		golog.Info("url")
		golog.Info(paymentURL)
		golog.Info("param")
		golog.Info(url.Values{"stripeToken": {payment.Token}, "amount": {amountStr}, "userID": {payment.UserID}})
		if err != nil {
			golog.Warn(fmt.Sprintf("ExecutePayment payment request failed: %v", err.Error()))
			ctx.StatusCode(iris.StatusBadRequest)
			ctx.JSON(iris.Map{
				"error": iris.Map{
					"statusCode": iris.StatusInternalServerError,
					"message":    "Payment server connect error",
				},
			})
			return
		}
		golog.Info("ExecutePayment request success")
		golog.Info(resp.Body)
		ctx.Header("Access-Control-Allow-Origin", "*")
		ctx.Header("Access-Control-Allow-Credentials", "true")
		ctx.JSON(iris.Map{
			"error": "",
			"message": iris.Map{
				"state": "ok",
			},
		})
		return
	}
}
