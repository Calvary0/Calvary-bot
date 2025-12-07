#!/bin/bash

# =======================
# Настройки
# =======================
FRONTEND_DIR="$HOME/Documents/Illia R/Amaribot-clone/dashboard"
API_DIR="$HOME/Documents/Illia R/Amaribot-clone/api"
PUBLIC_DIR="$HOME/Documents/Illia R/amaribot"   # Папка для продакшн фронтенда
API_PORT=5001
NGINX_PORT=8080   # Homebrew Nginx по умолчанию 8080

# =======================
# 0️⃣ Проверка конфигурации
# =======================
echo "🔹 Проверка конфигурации..."
if [ ! -f "$API_DIR/.env" ]; then
    echo "❌ Файл $API_DIR/.env не найден!"
    echo "Создайте файл на основе env.example"
    exit 1
fi

if [ ! -f "$FRONTEND_DIR/.env" ]; then
    echo "❌ Файл $FRONTEND_DIR/.env не найден!"
    echo "Создайте файл на основе .env.example"
    exit 1
fi

# =======================
# 1️⃣ Сборка фронтенда
# =======================
echo "🔹 Сборка фронтенда..."
cd "$FRONTEND_DIR" || { echo "Не найден фронтенд каталог"; exit 1; }
npm install
npm run build || { echo "Ошибка сборки фронтенда"; exit 1; }

# =======================
# 2️⃣ Копирование фронтенда
# =======================
echo "🔹 Копирование фронтенда в $PUBLIC_DIR..."
mkdir -p "$PUBLIC_DIR"
cp -r dist/* "$PUBLIC_DIR/"

# =======================
# 3️⃣ Настройка Nginx (Homebrew)
# =======================
echo "🔹 Настройка Nginx..."
NGINX_CONF="/opt/homebrew/etc/nginx/servers/amaribot.conf"
mkdir -p "$(dirname "$NGINX_CONF")"
tee "$NGINX_CONF" > /dev/null <<EOF
server {
    listen $NGINX_PORT;
    server_name localhost;

    root $PUBLIC_DIR;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:$API_PORT/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# =======================
# 4️⃣ Запуск Nginx
# =======================
echo "🔹 Перезапуск Nginx..."
brew services restart nginx || echo "⚠️ Nginx не запущен, проверьте установку"

# =======================
# 5️⃣ Запуск API через PM2
# =======================
echo "🔹 Запуск API через PM2..."
cd "$API_DIR" || { echo "Не найден API каталог"; exit 1; }
npm install
pm2 start server.js --name amaribot-api || pm2 restart amaribot-api
pm2 save

# =======================
# 6️⃣ Проверка
# =======================
echo ""
echo "🔹 Проверка API..."
sleep 2
if curl -s http://localhost:$API_PORT/api/health > /dev/null; then
    echo "✅ API отвечает на порту $API_PORT"
else
    echo "⚠️  API не отвечает. Проверьте, что сервер запущен."
fi

echo ""
echo "✅ Деплой завершён!"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Проверьте конфигурацию: ./check-config.sh"
echo "   2. Откройте в браузере: http://localhost:$NGINX_PORT"
echo "   3. Проверьте API: http://localhost:$NGINX_PORT/api/health"
echo ""
echo "💡 Если есть проблемы, смотрите PRODUCTION_FIXES.md"
