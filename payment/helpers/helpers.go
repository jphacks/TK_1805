package helpers

import "strconv"

// StrToInt64 ...
func StrToInt64(s string) (int64, error) {
	i, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return -1, err
	}
	return i, nil
}
