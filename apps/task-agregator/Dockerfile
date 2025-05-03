FROM golang:1.23.2-alpine AS builder

WORKDIR /app

COPY . .

RUN GOOS=linux GOARCH=amd64 go build -o /app/main ./apps/task-agregator/cmd/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

RUN chmod +x ./main

CMD ["/app/main"]
