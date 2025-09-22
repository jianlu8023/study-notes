FROM golang:1.17.5 AS builder

ARG APPNAME

ENV GO111MODULE=on
ENV GOPROXY=https://goproxy.cn,https://goproxy.io,direct
ENV GOSUMDB=sum.golang.google.cn

WORKDIR /build/app

COPY . .

RUN cd /build/app/demo && \
    if [[ -f "demo"]];then  rm demo; fi && \
    go mod tidy && \
    go build -ldflags="-s -w" -o demo ./src


FROM alpine:3.18

WORKDIR /app

COPY --from=builder /build/app/demo/demo ./
COPY --from=builder /build/app/demo/cert /app/cert
COPY --from=builder /build/app/demo/configs /app/configs

VOLUME /app/configs
VOLUME /app/cert
VOLUME /app/log

EXPOSE 8080

ENTRYPOINT ["./demo"]


