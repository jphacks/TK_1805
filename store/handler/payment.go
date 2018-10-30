package handler

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	"github.com/KeisukeYamashita/TK_1805/payment/types"
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

func createBadRequest(ctx iris.Context, message string) {
	golog.Warn(message)

	ctx.StatusCode(iris.StatusBadRequest)
	ctx.JSON(iris.Map{
		"error": iris.Map{
			"statusCode": iris.StatusBadRequest,
			"message":    message,
		},
	})
}

func createInternalServerError(ctx iris.Context, message string) {
	golog.Warn(message)

	ctx.StatusCode(iris.StatusInternalServerError)
	ctx.JSON(iris.Map{
		"error": iris.Map{
			"statusCode": iris.StatusInternalServerError,
			"message":    message,
		},
	})
}

func handleRegisteredUser(ctr *Controller, ctx iris.Context, payment Payment) {
	golog.Info("This is a payment for existing users")

	user := new(types.User)

	ctr.DB.First(user, "id = ?", payment.UserID)

	if user == nil {
		createBadRequest(ctx, "User not found")
		return
	}

	stripeCustomerID := user.StripeCustomerID
	paymentURL := fmt.Sprintf("%v:%v/v1/payment", ctr.PaymentHost, ctr.PaymentPort)
	amountStr := strconv.Itoa(payment.Amount)

	// TODO: URLを使うらしいので治す
	resp, err := http.PostForm(paymentURL, url.Values{
		"amount":     {amountStr},
		"userID":     {payment.UserID},
		"customerID": {stripeCustomerID},
	})

	if err != nil {
		createInternalServerError(ctx, fmt.Sprintf("Payment server request failed: %v", err.Error()))
		return
	}

	jsonBytes, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		createInternalServerError(ctx, fmt.Sprintf("Failed to read body of payment request: %v", err.Error()))
		return
	}

	paymentInfo := new(PaymentInfo)

	if err := json.Unmarshal(jsonBytes, paymentInfo); err != nil {
		createInternalServerError(ctx, fmt.Sprintf("Failed to parse body of payment request: %v", err.Error()))
		return
	}

	if paymentInfo.Error != nil {
		createInternalServerError(ctx, "Payment service returned error")
		return
	}

	ctx.JSON(iris.Map{
		"error": "",
		"message": iris.Map{
			"result": "OK",
		},
	})
}

func handleAnonymousUser(ctr *Controller, ctx iris.Context, payment Payment) {
	golog.Info("This is a payment for new users")

	user := types.User{
		Name: payment.UserID,
	}

	if ctr.DB.First(&user, "name = ?", payment.UserID).RecordNotFound() {
		if err := ctr.DB.Create(&user).Error; err != nil {
			createBadRequest(ctx, fmt.Sprintf("The request for new users needs a stripe token: %v", err.Error()))
			return
		}
	}

	paymentURL := fmt.Sprintf("%v:%v/v1/payment?stripeToken=%v&amount=%v&userID=%v", ctr.PaymentHost, ctr.PaymentPort, payment.Token, payment.Amount, payment.UserID)
	response, err := http.Post(paymentURL, "plain/text", nil)

	if err != nil {
		createInternalServerError(ctx, fmt.Sprintf("Payment server returned error: %v", err.Error()))
		return
	}

	switch response.StatusCode {
	case 200:
		ctx.JSON(iris.Map{
			"error": "",
			"message": iris.Map{
				"result": "OK",
			},
		})
	case 400:
		createBadRequest(ctx, "Payment server received bad request")
	case 500:
		createInternalServerError(ctx, "Payment server caused problem")
	default:
		createInternalServerError(ctx, "Unknown error in payment server")
	}
}

// ExecutePayment ...
func (ctr *Controller) ExecutePayment() func(ctx iris.Context) {
	return func(ctx iris.Context) {
		golog.Info("CALLED: ExecutePayment")

		var payment Payment

		if err := ctx.ReadJSON(&payment); err != nil {
			createBadRequest(ctx, fmt.Sprintf("Faield to parse: %v", err.Error()))
			return
		}

		if payment.Amount == 0 {
			createBadRequest(ctx, "`amount` should not be empty")
			return
		}

		if payment.UserID == "" {
			createBadRequest(ctx, "`userId` should not be empty")
			return
		}

		if payment.Token == "" {
			handleRegisteredUser(ctr, ctx, payment)
		} else {
			handleAnonymousUser(ctr, ctx, payment)
		}
	}
}
