package app

import (
	"math/rand"
	"os"
	"strconv"
	"testing"

	"github.com/KeisukeYamashita/TK_1805/payment/handler"
	"github.com/KeisukeYamashita/TK_1805/payment/types"
	"github.com/joho/godotenv"
	"github.com/kataras/iris"
	"github.com/kataras/iris/httptest"
	stripe "github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/token"
)

func NewRandomEmail() string {
	return strconv.Itoa(rand.Intn(100000)) + "@gmail.com"
}

func CreateToken() (*stripe.Token, error) {
	if err := godotenv.Load("../.env.test"); err != nil {
		return nil, err
	}

	stripe.Key = os.Getenv("SECRET_KEY")

	params := &stripe.TokenParams{
		Card: &stripe.CardParams{
			Number:   stripe.String("4242424242424242"),
			ExpMonth: stripe.String("12"),
			ExpYear:  stripe.String("2019"),
			CVC:      stripe.String("123"),
		},
	}
	t, err := token.New(params)

	if err != nil {
		return nil, err
	}

	return t, nil
}
func TestNewIrisApp(t *testing.T) {
	t.Helper()
	t.Run("/healthy", func(t *testing.T) {

		mdb := new(handler.MockDB)
		app := NewIrisApp(mdb)
		e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))

		e.GET("/healthy").WithHeaders(map[string]string{
			"Content-Type": "application/json",
		}).Expect().Status(httptest.StatusOK)

		e.POST("/healthy").WithHeaders(map[string]string{
			"Content-Type": "application/json",
		}).Expect().Status(httptest.StatusNotFound)
	})

	t.Run("/v1/payment", func(t *testing.T) {
		testAmount := 2000

		t.Run("when first payment", func(t *testing.T) {
			t.Run("when it fails to find user", func(t *testing.T) {
				user := &types.User{
					StripeCustomerID: "hoge",
				}

				// Will fail in DB attraction
				mdb := &handler.MockDB{
					User: user,
					Err:  true,
				}

				token, _ := CreateToken()

				app := NewIrisApp(mdb)
				e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))
				req := e.POST("/v1/payment")
				req.WithQuery("stripeToken", token.ID)
				req.WithQuery("amount", testAmount)
				req.WithQuery("userID", 3)
				req.WithQuery("email", NewRandomEmail())
				resp := req.Expect()
				resp.Status(httptest.StatusInternalServerError)

			})

			t.Run("when it ok", func(t *testing.T) {
				description := "Test: for not first payment"

				user := &types.User{
					StripeCustomerID: "hoge",
				}

				mdb := &handler.MockDB{
					User: user,
				}

				token, _ := CreateToken()

				app := NewIrisApp(mdb)
				e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))
				req := e.POST("/v1/payment")
				req.WithQuery("stripeToken", token.ID)
				req.WithQuery("amount", 2000)
				req.WithQuery("userID", 3)
				req.WithQuery("email", NewRandomEmail())
				req.WithQuery("description", description)
				resp := req.Expect()
				resp.JSON().Object().ContainsMap(iris.Map{
					"error": "",
					"message": iris.Map{
						"amount":      testAmount,
						"currency":    stripe.String(string(stripe.CurrencyJPY)),
						"description": description,
					},
				})
				resp.Status(httptest.StatusOK)
			})
		})

		t.Run("when not first payment", func(t *testing.T) {
			t.Run("when it ok", func(t *testing.T) {
				customerID := "cus_Do9kIREYKIxw48"
				description := "Test: for not first payment"

				user := &types.User{
					StripeCustomerID: customerID,
				}

				mdb := &handler.MockDB{
					User: user,
				}

				app := NewIrisApp(mdb)
				e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))
				req := e.POST("/v1/payment")
				req.WithQuery("customerID", customerID)
				req.WithQuery("amount", testAmount)
				req.WithQuery("userID", 3)
				req.WithQuery("description", description)
				resp := req.Expect()
				resp.Status(httptest.StatusOK)
				resp.JSON().Object().ContainsMap(iris.Map{
					"error": "",
					"message": iris.Map{
						"customerID":  customerID,
						"amount":      testAmount,
						"currency":    stripe.String(string(stripe.CurrencyJPY)),
						"description": description,
					},
				})
			})
		})

		t.Run("when missing form value", func(t *testing.T) {
			t.Run("missing amount", func(t *testing.T) {
				mdb := new(handler.MockDB)
				app := NewIrisApp(mdb)
				e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))

				req := e.POST("/v1/payment")
				req.WithQuery("stripeToken", "hogehoge")
				// req.WithQuery("amount", 1000) is missing
				req.WithQuery("userID", 3)
				resp := req.Expect()

				resp.JSON().Object().ContainsMap(iris.Map{
					"error": iris.Map{
						"statusCode": iris.StatusBadRequest,
						"message":    "amount or userID is missing",
					},
				})
				resp.Status(httptest.StatusBadRequest)
			})

			t.Run("missing stripeToken", func(t *testing.T) {
				mdb := new(handler.MockDB)
				app := NewIrisApp(mdb)
				e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))

				req := e.POST("/v1/payment")
				// req.WithQuery("stripeToken", "hogehoge") is missing
				req.WithQuery("amount", 1000)
				req.WithQuery("userID", 3)
				req.Expect().Status(httptest.StatusBadRequest)
			})

			t.Run("missing userID", func(t *testing.T) {
				mdb := new(handler.MockDB)
				app := NewIrisApp(mdb)
				e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))

				req := e.POST("/v1/payment")
				req.WithQuery("stripeToken", "hogehoge")
				req.WithQuery("amount", 1000)
				// req.WithQuery("userID", 3) is missing
				req.Expect().Status(httptest.StatusBadRequest)
			})

			t.Run("missing email when there is no customerID", func(t *testing.T) {
				mdb := new(handler.MockDB)
				app := NewIrisApp(mdb)
				e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))

				req := e.POST("/v1/payment")
				req.WithQuery("stripeToken", "hogehoge")
				req.WithQuery("amount", 1000)
				req.WithQuery("userID", 3)
				// req.WithQuery("email", "hogehoge@gmail") is missing

				req.Expect().Status(httptest.StatusBadRequest)
			})
		})

		t.Run("when amount is invalid format", func(t *testing.T) {
			t.Run("when it is float", func(t *testing.T) {
				mdb := new(handler.MockDB)
				app := NewIrisApp(mdb)
				e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))
				req := e.POST("/v1/payment")
				req.WithQuery("stripeToken", "hogehoge")
				req.WithQuery("amount", 1000.023)
				req.WithQuery("userID", 3)
				req.Expect().Status(httptest.StatusBadRequest)
			})

			t.Run("when it is string", func(t *testing.T) {
				mdb := new(handler.MockDB)
				app := NewIrisApp(mdb)
				e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))
				req := e.POST("/v1/payment")
				req.WithQuery("stripeToken", "hogehoge")
				req.WithQuery("amount", "hoge")
				req.WithQuery("userID", 3)
				req.Expect().Status(httptest.StatusBadRequest)
			})
		})

		t.Run("when email is invalid format", func(t *testing.T) {
			user := &types.User{
				StripeCustomerID: "hoge",
			}

			mdb := &handler.MockDB{
				User: user,
			}

			token, _ := CreateToken()

			app := NewIrisApp(mdb)
			e := httptest.New(t, app, httptest.URL("http://payment:8880.com"))
			req := e.POST("/v1/payment")
			req.WithQuery("stripeToken", token.ID)
			req.WithQuery("amount", 2000)
			req.WithQuery("userID", 3)
			req.WithQuery("email", "haga_tatanai_jinsei")
			req.Expect().Status(httptest.StatusBadRequest)
		})
	})
}
