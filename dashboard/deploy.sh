#!/bin/bash

# Настройки
FRONTEND_DIR=~/Amaribot-clone/dashboard
API_DIR=~/Amaribot-clone/api
PUBLIC_DIR=/var/www/amaribot
DOMAIN=yourdomain.com   # <- замени на свой домен или IP
API_PORT=5001

# 1️⃣ Сборка фронтенда
echo "🔹 Сборка фронтенда..."
cd $FRONTEND_DIR || { echo "Не найден фронтенд каталог"; exit 1; }
npm install
npm run build || { echo "Ошибка сборки фронтенда"; exit 1; }

# 2️⃣ Копирование фронтенда в публичную папку
echo "🔹 Копирование фронтенда в $PUBLIC_DIR..."
sudo mkdir -p $PUBLIC_DIR
sudo cp -r dist/* $PUBLIC_DIR/

# 3️⃣ Настройка Nginx
echo "🔹 Настройка Nginx..."
NGINX_CONF="/etc/nginx/sites-available/amaribot"
sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    root $PUBLIC_DIR;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:$API_PORT/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo nginx -t || { echo "Ошибка проверки конфигурации Nginx"; exit 1; }
sudo systemctl reload nginx

# 4️⃣ Запуск API через PM2
echo "🔹 Запуск API через PM2..."
cd $API_DIR || { echo "Не найден API каталог"; exit 1; }
npm install
pm2 start server.js --name amaribot-api
pm2 save
pm2 startup | tail -n 1

# 5️⃣ Проверка
echo "🔹 Проверка API..."
curl http://localhost:$API_PORT/api/health

echo "✅ Деплой завершён. Фронтенд доступен на http://$DOMAIN"

