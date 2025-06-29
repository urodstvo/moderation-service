#!/usr/bin/env bash

set -e

DOMAIN="example.com"          # поменяй на свой домен
EMAIL="andreyka_zub@mail.ru" # твой email для Let's Encrypt

echo "Запускаем docker-compose..."
docker-compose up -d -f docker-compose.stack.yaml

echo "Устанавливаем certbot (если не установлен)..."
if ! command -v certbot &> /dev/null; then
  sudo apt-get update
  sudo apt-get install -y certbot python3-certbot-nginx
fi

echo "Запускаем certbot для $DOMAIN..."
sudo certbot --nginx -d "$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive

echo "Включаем автообновление сертификатов..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "Готово."
