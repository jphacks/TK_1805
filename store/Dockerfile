FROM golang:1.11 as build
LABEL MAINTAINER=KeisukeYamashita

RUN mkdir -p /go
ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH

RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

WORKDIR /go/src/github.com/KeisukeYamashita/TK_1805/store
ADD ./store .
RUN dep ensure
RUN go build -v -o store main.go


FROM gcr.io/distroless/base
COPY --from=build /go/src/github.com/KeisukeYamashita/TK_1805/store/store /

EXPOSE 8880
CMD ["/store"]