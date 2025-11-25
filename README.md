# Discord Bot Website + Dashboard + API

Этот репозиторий содержит:

- Статический сайт (`index.html`, и др.)
- SPA Dashboard на React (`/dashboard`)
- REST API на Express + MongoDB (`/api`)

## Быстрый старт

1. **API**
   ```bash
   cd api
   npm install
   cp env.example .env
   npm run dev
   ```

2. **Dashboard**
   ```bash
   cd dashboard
   npm install
   cp env.example .env
   npm run dev
   ```

3. Откройте http://localhost:3000

## Переменные окружения

### `/api/.env`
```
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_REDIRECT_URI=http://localhost:3000/login
DISCORD_BOT_TOKEN=...
JWT_SECRET=...
MONGODB_URI=mongodb://localhost:27017/discord-bot
BOT_API_TOKEN=...
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### `/dashboard/.env`
```
VITE_DISCORD_CLIENT_ID=...
```

## Скрипты

| Путь | Скрипт | Описание |
| --- | --- | --- |
| `/api` | `npm run dev` | dev режим API (порт 5000) |
| `/api` | `npm start` | production сервер |
| `/dashboard` | `npm run dev` | Vite dev server (порт 3000) |
| `/dashboard` | `npm run build` | production сборка SPA |

## Полезные файлы

- `SETUP.md` — подробная инструкция
- `QUICK_START.md` — краткий чек-лист
- `PROJECT_STRUCTURE.md` — описание структуры
- `api/BOT_USAGE.md` — пример интеграции с ботом

