# Настройка переменных окружения

## Для API (api/.env)

### Локальная разработка:
```env
DISCORD_CLIENT_ID=ваш_client_id
DISCORD_CLIENT_SECRET=ваш_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/login
DISCORD_BOT_TOKEN=ваш_bot_token
JWT_SECRET=случайная_строка_для_jwt_токенов
MONGODB_URI=mongodb://localhost:27017/discord-bot
BOT_API_TOKEN=случайная_строка_для_защиты_api
PORT=5001
CORS_ORIGIN=http://localhost:3000,http://localhost:8080
NODE_ENV=development
```

### Для Render (Production):
```env
DISCORD_CLIENT_ID=ваш_client_id
DISCORD_CLIENT_SECRET=ваш_client_secret
DISCORD_REDIRECT_URI=https://calvary0.github.io/Calvary-bot/login
DISCORD_BOT_TOKEN=ваш_bot_token
JWT_SECRET=случайная_строка_для_jwt_токенов
MONGODB_URI=ваш_mongodb_atlas_uri
BOT_API_TOKEN=случайная_строка_для_защиты_api
PORT=5001
CORS_ORIGIN=https://calvary0.github.io
NODE_ENV=production
DASHBOARD_API=https://calvary-bot.onrender.com
API_URL=https://calvary-bot.onrender.com
```

**Важно для Render:**
- `DISCORD_REDIRECT_URI` должен совпадать с настройками в Discord Developer Portal
- `CORS_ORIGIN` должен включать URL вашего GitHub Pages
- `DASHBOARD_API` и `API_URL` используются ботом для подключения к API

## Для Dashboard (dashboard/.env)

### Локальная разработка:
```env
VITE_DISCORD_CLIENT_ID=ваш_client_id
VITE_API_URL=http://localhost:5001/api
VITE_DISCORD_REDIRECT_URI=http://localhost:3000/login
```

### Для GitHub Pages (Production):
```env
VITE_DISCORD_CLIENT_ID=ваш_client_id
VITE_API_URL=https://calvary-bot.onrender.com/api
VITE_DISCORD_REDIRECT_URI=https://calvary0.github.io/Calvary-bot/login
```

**Важно:**
- `VITE_DISCORD_REDIRECT_URI` должен совпадать с `DISCORD_REDIRECT_URI` в API
- `VITE_API_URL` должен указывать на ваш Render API сервис
- Все переменные должны начинаться с `VITE_` чтобы быть доступными в браузере

## Настройка Discord OAuth2

1. Перейдите на https://discord.com/developers/applications
2. Выберите ваше приложение
3. В разделе **OAuth2** → **General**:
   - Добавьте Redirect URI: `https://calvary0.github.io/Calvary-bot/login`
   - Для локальной разработки также добавьте: `http://localhost:3000/login`
4. Сохраните изменения

## Генерация секретных ключей

```bash
# JWT_SECRET
openssl rand -hex 32

# BOT_API_TOKEN
openssl rand -hex 32
```

