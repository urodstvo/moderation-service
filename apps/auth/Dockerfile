# Этап сборки
FROM golang:1.24-alpine AS builder

# Install git (for fetching modules) and ca-certificates for potential HTTPS operations
RUN apk add --no-cache git ca-certificates

WORKDIR /src

# Use go modules download step to leverage Docker cache
COPY go.mod go.sum ./
RUN go env -w GOPROXY=https://proxy.golang.org && go mod download

# Copy the rest of the repo (services and libs)
COPY . .

# Build a small static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /app/main ./apps/auth/cmd

FROM alpine:latest
RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY --from=builder /app/main .
RUN chmod +x /app/main
EXPOSE 8000
CMD ["/app/main"]
