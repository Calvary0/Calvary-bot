#!/bin/bash

# Скрипт для проверки конфигурации перед деплоем

echo "🔍 Проверка конфигурации..."

ERRORS=0

# Проверка API .env
echo ""
echo "📋 Проверка API .env..."
if [ ! -f "api/.env" ]; then
    echo "❌ api/.env не найден!"
    ERRORS=$((ERRORS + 1))
else
    if grep -q "DISCORD_REDIRECT_URI=http://localhost:8080" api/.env; then
        echo "✅ DISCORD_REDIRECT_URI настроен правильно"
    else
        echo "⚠️  DISCORD_REDIRECT_URI должен быть http://localhost:8080/login для production"
    fi
    
    if grep -q "CORS_ORIGIN.*8080" api/.env; then
        echo "✅ CORS_ORIGIN включает порт 8080"
    else
        echo "⚠️  CORS_ORIGIN должен включать http://localhost:8080"
    fi
    
    if grep -q "PORT=5001" api/.env; then
        echo "✅ PORT настроен на 5001"
    else
        echo "⚠️  PORT должен быть 5001"
    fi
fi

# Проверка Dashboard .env
echo ""
echo "📋 Проверка Dashboard .env..."
if [ ! -f "dashboard/.env" ]; then
    echo "❌ dashboard/.env не найден!"
    ERRORS=$((ERRORS + 1))
else
    if grep -q "VITE_DISCORD_CLIENT_ID" dashboard/.env; then
        echo "✅ VITE_DISCORD_CLIENT_ID настроен"
    else
        echo "⚠️  VITE_DISCORD_CLIENT_ID не найден"
    fi
fi

# Проверка собранного фронтенда
echo ""
echo "📋 Проверка собранного фронтенда..."
if [ -d "dashboard/dist" ] && [ -f "dashboard/dist/index.html" ]; then
    echo "✅ Фронтенд собран (dashboard/dist/)"
else
    echo "⚠️  Фронтенд не собран. Запустите: cd dashboard && npm run build"
fi

# Проверка Nginx конфигурации
echo ""
echo "📋 Проверка Nginx конфигурации..."
NGINX_CONF="/opt/homebrew/etc/nginx/servers/amaribot.conf"
if [ -f "$NGINX_CONF" ]; then
    if grep -q "proxy_pass http://localhost:5001/api" "$NGINX_CONF"; then
        echo "✅ Nginx proxy_pass настроен правильно"
    else
        echo "⚠️  Nginx proxy_pass может быть настроен неправильно"
    fi
    
    if grep -q "listen 8080" "$NGINX_CONF"; then
        echo "✅ Nginx слушает на порту 8080"
    else
        echo "⚠️  Nginx должен слушать на порту 8080"
    fi
else
    echo "⚠️  Nginx конфигурация не найдена. Будет создана при деплое."
fi

# Проверка PM2
echo ""
echo "📋 Проверка PM2..."
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "amaribot-api"; then
        echo "✅ API запущен через PM2"
    else
        echo "⚠️  API не запущен через PM2"
    fi
else
    echo "⚠️  PM2 не установлен. Установите: npm install -g pm2"
fi

# Итог
echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✅ Конфигурация в порядке!"
else
    echo "❌ Найдено $ERRORS критических ошибок"
    exit 1
fi

