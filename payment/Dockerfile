FROM golang:1.11 as build
LABEL MAINTAINER=KeisukeYamashita

RUN mkdir -p /go
ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH

RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

WORKDIR /go/src/github.com/KeisukeYamashita/TK_1805/payment
ADD ./payment .
RUN dep ensure
RUN go build -v app/payment/payment.go


FROM gcr.io/distroless/base
COPY --from=build /go/src/github.com/KeisukeYamashita/TK_1805/payment/payment /
COPY payment/.env /

EXPOSE 8880
CMD ["/payment"]