# PaymentAPI

![CircleCI](https://circleci.com/gh/KeisukeYamashita/payment.svg?style=svg&circle-token=c76f1766d1bcdcc597e785c89d9e20e37f8db21f)
![goversion batch](https://img.shields.io/badge/go-1.11-blue.svg)
![version batch](https://img.shields.io/badge/apiversion-v1-blue.svg)

## API仕様書

以下のコマンドを実行してください。

```
open doc/v1/api.html
```

## 起動

以下のコマンドでサーバーを起動してください。

```
go run main.go
```

## テスト

以下のコマンドでテストをすることができます。

```
GO_ENV=test go test -v ./...
```