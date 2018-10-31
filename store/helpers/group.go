package helpers

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/KeisukeYamashita/TK_1805/store/types"
)

func NewGroup(tableID string) types.Group {
	data := fmt.Sprintf("%v-%v", tableID, time.Now())
	keyByteArray := sha256.Sum256([]byte(data))
	key := base64.URLEncoding.EncodeToString(keyByteArray[:])

	return types.Group{
		Key:      key,
		TableKey: tableID,
		State:    "IN_STORE",
	}
}
