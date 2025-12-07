# Инструкция по деплою Discord Bot Dashboard

## ✅ Текущий статус

- ✅ Фронтенд пересобран с актуальными изменениями
- ✅ Backend готов к запуску
- ✅ Все зависимости установлены
- ✅ .env файлы настроены

## 📦 Собранные файлы

Фронтенд собран в папку: `dashboard/dist/`

Содержимое:
- `index.html` - главная страница
- `assets/` - JS и CSS файлы

## 🚀 Локальный запуск

### 1. Запуск Backend API

```bash
cd api
npm run dev
```

API будет доступен на `http://localhost:5001`

### 2. Запуск Frontend (preview собранной версии)

```bash
cd dashboard
npm run preview
```

Dashboard будет доступен на `http://localhost:4173`

### 3. Запуск Frontend (development режим)

```bash
cd dashboard
npm run dev
```

Dashboard будет доступен на `http://localhost:3000`

## 🌐 Production деплой

### Вариант 1: Отдельный веб-сервер (Nginx/Apache)

1. **Скопируйте файлы фронтенда:**
   ```bash
   cp -r dashboard/dist/* /var/www/html/dashboard/
   ```

2. **Настройте Nginx для проксирования API:**
   
   Добавьте в конфигурацию Nginx:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           root /var/www/html/dashboard;
           try_files $uri $uri/ /index.html;
       }

       # API proxy
       location /api {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Запустите API как сервис:**
   
   Создайте файл `/etc/systemd/system/discord-bot-api.service`:
   ```ini
   [Unit]
   Description=Discord Bot API
   After=network.target

   [Service]
   Type=simple
   User=your-user
   WorkingDirectory=/path/to/Amaribot-clone/api
   ExecStart=/usr/bin/node server.js
   Restart=always
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```

   Запустите сервис:
   ```bash
   sudo systemctl enable discord-bot-api
   sudo systemctl start discord-bot-api
   ```

### Вариант 2: PM2 для управления процессом

1. **Установите PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Запустите API через PM2:**
   ```bash
   cd api
   pm2 start server.js --name discord-bot-api
   pm2 save
   pm2 startup
   ```

3. **Настройте веб-сервер** (как в варианте 1)

## 🔧 Проверка работы

1. **Проверьте API:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Должен вернуть: `{"status":"ok","timestamp":"..."}`

2. **Проверьте фронтенд:**
   Откройте в браузере и проверьте:
   - Страница логина загружается
   - Кнопка "Войти через Discord" работает
   - После авторизации происходит редирект на /dashboard

## 📝 Важные переменные окружения

### Frontend (dashboard/.env)
```env
VITE_DISCORD_CLIENT_ID=your_client_id
VITE_API_URL=http://localhost:5001/api  # или ваш production URL
```

### Backend (api/.env)
```env
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://your-domain.com/login
DISCORD_BOT_TOKEN=your_bot_token
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/discord-bot
BOT_API_TOKEN=your_secure_token
PORT=5001
CORS_ORIGIN=http://your-domain.com
```

## 🔄 Обновление после изменений

1. **Пересоберите фронтенд:**
   ```bash
   cd dashboard
   npm run build
   ```

2. **Скопируйте новые файлы на сервер:**
   ```bash
   cp -r dashboard/dist/* /var/www/html/dashboard/
   ```

3. **Перезапустите API (если были изменения):**
   ```bash
   pm2 restart discord-bot-api
   # или
   sudo systemctl restart discord-bot-api
   ```

## 🐛 Troubleshooting

### API не запускается
- Проверьте, что MongoDB запущен и доступен
- Проверьте переменные окружения в `api/.env`
- Проверьте логи: `pm2 logs discord-bot-api` или `journalctl -u discord-bot-api`

### Фронтенд не подключается к API
- Проверьте `VITE_API_URL` в `dashboard/.env`
- Проверьте CORS настройки в `api/.env`
- Проверьте, что прокси настроен правильно в Nginx

### OAuth не работает
- Проверьте `DISCORD_REDIRECT_URI` - должен совпадать с URL в Discord Application
- Проверьте Client ID и Client Secret
- Проверьте логи API для ошибок



