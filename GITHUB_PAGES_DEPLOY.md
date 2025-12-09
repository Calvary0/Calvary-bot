# Деплой Dashboard на GitHub Pages

## Настройка GitHub Pages

1. Перейдите в настройки репозитория: **Settings** → **Pages**
2. В разделе **Source** выберите:
   - **Branch**: `main` (или ваша основная ветка)
   - **Folder**: `/dashboard/dist`
3. Сохраните изменения

## Автоматический деплой

GitHub Pages автоматически будет раздавать содержимое папки `dashboard/dist/` по адресу:
`https://calvary0.github.io/Calvary-bot/`

## Важные настройки

### 1. Переменные окружения для сборки

Перед сборкой Dashboard создайте файл `dashboard/.env`:

```env
VITE_DISCORD_CLIENT_ID=ваш_client_id
VITE_API_URL=https://calvary-bot.onrender.com/api
VITE_DISCORD_REDIRECT_URI=https://calvary0.github.io/Calvary-bot/login
```

### 2. Сборка Dashboard

```bash
cd dashboard
npm install
npm run build
```

### 3. Коммит и пуш

```bash
git add dashboard/dist
git commit -m "Deploy dashboard to GitHub Pages"
git push origin main
```

## Проверка работы

1. Откройте `https://calvary0.github.io/Calvary-bot/`
2. Проверьте что:
   - Страница загружается без ошибок
   - Favicon отображается
   - Кнопка "Войти через Discord" работает
   - После авторизации происходит редирект

## Настройка OAuth2 в Discord

Убедитесь что в Discord Developer Portal добавлен Redirect URI:
- `https://calvary0.github.io/Calvary-bot/login`

Это должно совпадать с `VITE_DISCORD_REDIRECT_URI` и `DISCORD_REDIRECT_URI` в API.

## Структура после деплоя

```
dashboard/dist/          # Эта папка раздается GitHub Pages
├── index.html          # Главная страница
├── favicon.svg         # Иконка (относительный путь: ./favicon.svg)
├── assets/
│   ├── css/           # CSS файлы (относительные пути: ./assets/css/...)
│   └── js/            # JS файлы (относительные пути: ./assets/js/...)
└── _redirects         # Для SPA роутинга (если используется)
```

## Troubleshooting

### Белый экран
- Проверьте что все пути относительные (начинаются с `./`)
- Проверьте консоль браузера на ошибки
- Убедитесь что `base: './'` в `vite.config.js` для production

### OAuth не работает
- Проверьте что `VITE_DISCORD_REDIRECT_URI` совпадает с настройками в Discord
- Убедитесь что API доступен и CORS настроен правильно
- Проверьте что `VITE_API_URL` указывает на правильный URL

### 404 при переходе по роутам
- Убедитесь что файл `_redirects` существует в `dashboard/dist/`
- Для GitHub Pages может потребоваться настройка 404.html с редиректом

