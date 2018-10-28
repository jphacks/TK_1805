package helpers

import (
	"errors"
	"fmt"
	"strconv"
)

func GetPaymentServerInfo(debugMode bool) (string, int, error) {
	if debugMode {
		return "http://localhost", 8880, nil
	}

	host := "payment"
	portStr := 8880

	if host == "" || portStr == "" {
		err := errors.New("cannot get PAYMENT_HOST or PAYMENT_PORT from os.Getenv()")
		return "", 0, err
	}
	port, err := strconv.Atoi(portStr)

	if err != nil {
		return "", 0, err
	}

	url := fmt.Sprintf("http://%v", host)

	return url, port, nil
}
