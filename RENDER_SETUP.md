# Настройка монорепозитория для Render

Этот проект настроен как монорепозиторий с отдельными сервисами для фронтенда и бэкенда.

## Структура проекта

```
.
├── api/              # Backend (Node.js + Express)
│   ├── server.js     # Точка входа для API
│   └── package.json
├── dashboard/        # Frontend (React + Vite)
│   ├── src/
│   └── package.json
└── package.json      # Корневой package.json для управления монорепозиторием
```

## Настройка на Render

### 1. Backend Service (API)

**Настройки в Render:**
- **Name**: `amaribot-api` (или любое другое имя)
- **Environment**: `Node`
- **Build Command**: `cd api && npm install`
- **Start Command**: `cd api && npm start`
- **Root Directory**: оставьте пустым (или укажите `/api`)

**Переменные окружения:**
- `PORT` - порт (Render автоматически установит)
- `MONGODB_URI` - URI подключения к MongoDB
- `CORS_ORIGIN` - разрешённые источники для CORS (например, `https://your-frontend.onrender.com`)
- `JWT_SECRET` - секретный ключ для JWT (если используется)
- `NODE_ENV` - `production`

### 2. Frontend Service (Dashboard)

**Настройки в Render:**
- **Name**: `amaribot-dashboard` (или любое другое имя)
- **Environment**: `Static Site`
- **Build Command**: `cd dashboard && npm install && npm run build`
- **Publish Directory**: `dashboard/dist`

**Альтернатива (Web Service):**
Если хотите использовать Web Service вместо Static Site:
- **Environment**: `Node`
- **Build Command**: `cd dashboard && npm install && npm run build`
- **Start Command**: `cd dashboard && npm run preview` (или используйте nginx/serve)
- **Root Directory**: оставьте пустым (или укажите `/dashboard`)

**Переменные окружения:**
- `VITE_API_URL` - URL вашего API сервиса (например, `https://amaribot-api.onrender.com`)

## Локальная разработка

### Установка всех зависимостей

```bash
npm run install:all
```

Или вручную:
```bash
cd api && npm install
cd ../dashboard && npm install
```

### Запуск в режиме разработки

**Backend:**
```bash
cd api
npm run dev
```

**Frontend:**
```bash
cd dashboard
npm run dev
```

**Одновременно (требует `concurrently`):**
```bash
npm run dev
```

### Сборка фронтенда

```bash
cd dashboard
npm run build
```

## Проверка работы

1. **API Health Check**: `GET https://your-api.onrender.com/api/health`
2. **Frontend**: откройте URL вашего статического сайта или веб-сервиса

## Важные замечания

- Каждый сервис имеет свой собственный `package.json` и может работать независимо
- Backend использует ES modules (`"type": "module"`)
- Frontend использует Vite для сборки
- Убедитесь, что CORS настроен правильно для production окружения
- MongoDB URI должен быть доступен из Render

