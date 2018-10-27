package handler

import (
	"io/ioutil"
	"net/url"
	"os"
	"net/http"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"time"

	"github.com/kataras/iris"
)

type Controller struct {
}

type Payment struct {
	Amount int
	UserID int
	Token  string
}

type PaymentInfo struct {
	Error interface{}
	Message *Message
}

type Message struct {
	CustomerID string
	Amount int `json:"amount"`
	Currency string
	Description string
	ChargeID string
}

type PaymentError struct {
	StatusCode int `json:"statusCode"`
	Message string `json:"message"`
}

func NewController() *Controller {
	return &Controller{}
}

func (ctr *Controller) CreateGroupId() func(ctx iris.Context) {
	return func(ctx iris.Context) {
		tableId := ctx.Params().Get("tableId")
		now := time.Now()
		data := fmt.Sprintf("%v-%v", tableId, now)
		key := sha256.Sum256([]byte(data))

		ctx.JSON(iris.Map{
			"error": "",
			"message": iris.Map{
				"groupId": key,
				"state":   "IN_STORE",
			},
		})
		return
	}
}

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

			if os.Getenv("GO_ENV") != "test" {
				resp, err = http.PostForm("http://payment:8880", url.Values{"stripeToken": {"Value"}, "amount": {"123"}, "userID": {"1"}})
			} else {
				resp, err = http.PostForm("http://localhost:8000/v1/payment", url.Values{"stripeToken": {"Value"}, "amount": {"123"}, "userID": {"1"}})
			}

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

			jsonBytes := ([]byte) (byteArray)
			data := new(PaymentInfo)

			if err := json.Unmarshal(jsonBytes, data); err != nil {
				ctx.StatusCode(iris.StatusBadRequest)
				ctx.JSON(iris.Map{
					"error": iris.Map{
						"statusCode": iris.StatusBadRequest,
						"message":    "MarshalError",
					},
				})
				return
			}

			switch paymentErrInfo := data.Error.(type) {
			case string:
				//TODO confirm type of data
				fmt.Print(paymentErrInfo)
				ctx.JSON(data)
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

			return
		}

		return
	}
}
