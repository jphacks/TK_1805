package helpers

import (
	"os"
	"strconv"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

const (
	paymentHost string = "hahaKoregaTest"
	paymentPort int    = 9999
)

func _Setenv() {
	os.Setenv("PAYMENT_HOST", paymentHost)
	os.Setenv("PAYMENT_PORT", strconv.Itoa(paymentPort))
}

func TestGetPaymentServerInfo(t *testing.T) {
	Convey("GetPaymentServerInfo will return host and port of PaymentAPI", t, func() {
		Convey("when debug, dev, test mode", func() {
			var testBool bool = true
			_Setenv()

			host, port, err := GetPaymentServerInfo(testBool)
			So(err, ShouldBeNil)
			So(host, ShouldEqual, "http://localhost")
			So(port, ShouldEqual, 8880)
		})

		Convey("when prod mode", func() {
			var testBool bool = false
			_Setenv()

			host, port, err := GetPaymentServerInfo(testBool)
			So(err, ShouldBeNil)
			So(host, ShouldEqual, "http://"+paymentHost)
			So(port, ShouldEqual, paymentPort)
		})
	})
}
