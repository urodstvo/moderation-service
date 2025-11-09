# Этап сборки
FROM golang:1.24-alpine AS builder
RUN apk add --no-cache git ca-certificates

WORKDIR /src

# Copy the rest of the repo (services and libs)
COPY . .
RUN go env -w GOPROXY=https://proxy.golang.org && go mod download && go work sync

# Build webhook service
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /app/main ./apps/webhook/cmd

FROM alpine:latest
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /app/main .
RUN chmod +x /app/main
EXPOSE 8000
CMD ["/app/main"]
