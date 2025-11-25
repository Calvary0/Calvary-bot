# Quick Start Checklist

## 1. Backend (API)

```bash
cd api
npm install
cp env.example .env
npm run dev
```

## 2. Frontend (Dashboard)

```bash
cd dashboard
npm install
cp env.example .env
npm run dev
```

## 3. Обязательные переменные

- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`
- `DISCORD_BOT_TOKEN`
- `JWT_SECRET`
- `MONGODB_URI`
- `BOT_API_TOKEN`
- `VITE_DISCORD_CLIENT_ID`

## 4. Проверка

- API должно работать на `http://localhost:5000`
- Dashboard доступен на `http://localhost:3000`
- `GET http://localhost:5000/api/health` возвращает `{ status: "ok" }`
- Авторизация в Dashboard ведёт на Discord OAuth

## 5. Бот

- Использует `GET /api/guild/:id/config` с заголовком `X-Bot-Token`
- Пример кода см. в `api/BOT_USAGE.md`

