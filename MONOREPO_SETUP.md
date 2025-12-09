# Монорепозиторий Calvary-bot - Итоговая настройка

## ✅ Структура проекта

```
Calvary-bot/
├── src/
│   └── bot.js              # Discord бот (автоматически запускается с API)
├── api/                    # Backend (Node.js + Express + MongoDB)
│   ├── server.js           # Точка входа (импортирует бота из ../src/bot.js)
│   ├── routes/             # API маршруты
│   ├── controllers/        # Контроллеры
│   ├── models/             # MongoDB модели
│   └── package.json
├── dashboard/              # Frontend (React + Vite)
│   ├── src/                # Исходники React
│   ├── dist/               # Собранный фронтенд (для GitHub Pages)
│   └── package.json
└── package.json            # Корневой package.json
```

## 🚀 Деплой

### Render (API + Bot)

1. Создайте **Web Service** на Render
2. Настройки:
   - **Build Command**: `cd api && npm install`
   - **Start Command**: `cd api && npm start`
   - **Root Directory**: оставьте пустым
3. Добавьте переменные окружения (см. `ENV_SETUP.md`)
4. Бот автоматически запустится вместе с API при старте сервера

### GitHub Pages (Dashboard)

1. Настройте GitHub Pages в настройках репозитория:
   - **Source**: `main` branch
   - **Folder**: `/dashboard/dist`
2. Соберите Dashboard с правильными переменными окружения
3. Закоммитьте и запушьте `dashboard/dist/`

## 📋 Чек-лист перед деплоем

### API (Render)
- [ ] `DISCORD_BOT_TOKEN` задан (для работы бота)
- [ ] `DISCORD_REDIRECT_URI` = `https://calvary0.github.io/Calvary-bot/login`
- [ ] `CORS_ORIGIN` включает `https://calvary0.github.io`
- [ ] `MONGODB_URI` настроен (MongoDB Atlas)
- [ ] `DASHBOARD_API` или `API_URL` = `https://calvary-bot.onrender.com`

### Dashboard (GitHub Pages)
- [ ] `VITE_DISCORD_CLIENT_ID` задан
- [ ] `VITE_API_URL` = `https://calvary-bot.onrender.com/api`
- [ ] `VITE_DISCORD_REDIRECT_URI` = `https://calvary0.github.io/Calvary-bot/login`
- [ ] Сборка выполнена: `cd dashboard && npm run build`
- [ ] Все пути относительные (проверено в `dist/index.html`)

### Discord OAuth2
- [ ] Redirect URI добавлен в Discord Developer Portal:
  - `https://calvary0.github.io/Calvary-bot/login`
- [ ] Redirect URI совпадает в API и Dashboard

## 🔧 Локальная разработка

### Установка зависимостей
```bash
cd api && npm install
cd ../dashboard && npm install
```

### Запуск
```bash
# API (порт 5001)
cd api && npm run dev

# Dashboard (порт 3000)
cd dashboard && npm run dev
```

### Переменные окружения для локальной разработки

**api/.env:**
```env
DISCORD_REDIRECT_URI=http://localhost:3000/login
CORS_ORIGIN=http://localhost:3000
```

**dashboard/.env:**
```env
VITE_API_URL=http://localhost:5001/api
VITE_DISCORD_REDIRECT_URI=http://localhost:3000/login
```

## 📚 Дополнительная документация

- `ENV_SETUP.md` - Подробная настройка переменных окружения
- `RENDER_SETUP.md` - Настройка Render для API
- `GITHUB_PAGES_DEPLOY.md` - Настройка GitHub Pages для Dashboard
- `api/BOT_USAGE.md` - Примеры использования API в боте

## ⚠️ Важные замечания

1. **Бот запускается автоматически** при старте API через `import '../src/bot.js'` в `api/server.js`
2. **Если `DISCORD_BOT_TOKEN` не задан**, бот не запустится, но API продолжит работать
3. **Все пути в Dashboard относительные** для корректной работы на GitHub Pages
4. **Redirect URI должен совпадать** в Discord, API и Dashboard

