# Этап сборки
FROM golang:1.23.2-alpine AS builder

# Установка зависимостей для работы с Go workspace
RUN apk add --no-cache git

# Указываем рабочую директорию в контейнере
WORKDIR /app

# Копируем структуру проекта, включая все локальные библиотеки и приложения
COPY ./go.work ./go.work
COPY ./go.work.sum ./go.work.sum
COPY ./libs ./libs
COPY ./apps/auth ./apps/auth
COPY ./apps/task-agregator ./apps/task-agregator
COPY ./apps/result-agregator ./apps/result-agregator
COPY ./apps/test ./apps/test

# Собираем программу для Linux
RUN GOOS=linux GOARCH=amd64 go build -o /libs/main ./libs/migrations/main.go

# Этап для запуска
FROM alpine:latest

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем бинарник из этапа сборки
COPY --from=builder /libs/main .

# Делаем бинарник исполнимым
RUN chmod +x ./main

# Запускаем бинарник
CMD ["/app/main"]
