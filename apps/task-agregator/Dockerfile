FROM golang:1.23.2-alpine AS builder

WORKDIR /app

COPY ./go.work ./go.work
COPY ./go.work.sum ./go.work.sum
COPY ./libs ./libs
COPY ./apps/auth ./apps/auth
COPY ./apps/task-agregator ./apps/task-agregator
COPY ./apps/result-agregator ./apps/result-agregator
COPY ./apps/test ./apps/test

RUN GOOS=linux GOARCH=amd64 go build -o /app/main ./apps/task-agregator/cmd/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

RUN chmod +x ./main

CMD ["/app/main"]
