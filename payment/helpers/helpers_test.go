package helpers

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestStrToInt64(t *testing.T) {
	Convey("StrToInt64 given some value", t, func() {
		Convey("when int64 is positive", func() {
			Convey("and int64 in small", func() {
				in := "10"
				out, err := StrToInt64(in)
				So(out, ShouldEqual, 10)
				So(err, ShouldBeNil)
			})

			Convey("and int64 in maximum", func() {
				in := "9223372036854775807"
				out, err := StrToInt64(in)
				So(out, ShouldEqual, 9223372036854775807)
				So(err, ShouldBeNil)
			})
		})

		Convey("when int64 is negative", func() {
			Convey("and int64 in small", func() {
				in := "-20"
				out, err := StrToInt64(in)
				So(out, ShouldEqual, -20)
				So(err, ShouldBeNil)
			})

			Convey("and int64 in maximum", func() {
				in := "-9223372036854775807"
				out, err := StrToInt64(in)
				So(out, ShouldEqual, -9223372036854775807)
				So(err, ShouldBeNil)
			})
		})

		Convey("when int64 is zero", func() {
			in := "0"
			out, err := StrToInt64(in)
			So(out, ShouldEqual, 0)
			So(err, ShouldBeNil)
		})

		Convey("when int64 is not convertable", func() {
			Convey("when value is string", func() {
				in := "hello"
				_, err := StrToInt64(in)
				So(err.Error(), ShouldContainSubstring, "invalid")
			})

			Convey("when value is float", func() {
				in := "32.0"
				_, err := StrToInt64(in)
				So(err.Error(), ShouldContainSubstring, "invalid")
			})
		})
	})
}
