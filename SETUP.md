# Инструкция по установке и запуску

## Предварительные требования

- Node.js (версия 18 или выше)
- MongoDB (локально или MongoDB Atlas)
- Discord Application (для OAuth2)

## Шаг 1: Настройка Discord Application

1. Перейдите на https://discord.com/developers/applications
2. Создайте новое приложение или выберите существующее
3. В разделе **OAuth2** → **General**:
   - Добавьте Redirect URI: `http://localhost:3000/login`
   - Скопируйте **Client ID** и **Client Secret**
4. В разделе **Bot**:
   - Создайте бота, если его еще нет
   - Скопируйте **Bot Token**
   - Включите необходимые привилегии (Server Members Intent, если нужно)

## Шаг 2: Установка Backend (API)

```bash
cd api
npm install
```

Создайте файл `.env`:

```bash
cp env.example .env
```

Заполните `.env`:

```env
DISCORD_CLIENT_ID=ваш_client_id
DISCORD_CLIENT_SECRET=ваш_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/login
DISCORD_BOT_TOKEN=ваш_bot_token
JWT_SECRET=случайная_строка_для_jwt_токенов
MONGODB_URI=mongodb://localhost:27017/discord-bot
BOT_API_TOKEN=случайная_строка_для_защиты_api
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

**Важно:**
- `JWT_SECRET` - любая случайная строка (можно сгенерировать: `openssl rand -hex 32`)
- `BOT_API_TOKEN` - любая случайная строка для защиты API эндпоинта `/guild/:id/config`
- `MONGODB_URI` - если используете MongoDB Atlas, используйте строку подключения оттуда

Запустите API:

```bash
npm run dev
```

API будет доступен на `http://localhost:5000`

## Шаг 3: Установка Frontend (Dashboard)

Откройте новый терминал:

```bash
cd dashboard
npm install
```

Создайте файл `.env`:

```bash
cp .env.example .env
```

Заполните `.env`:

```env
VITE_DISCORD_CLIENT_ID=ваш_client_id
```

Запустите Dashboard:

```bash
npm run dev
```

Dashboard будет доступен на `http://localhost:3000`

## Шаг 4: Проверка работы

1. Откройте `http://localhost:3000`
2. Нажмите "Войти через Discord"
3. Авторизуйтесь через Discord
4. Выберите сервер из списка
5. Настройте параметры и сохраните

## Шаг 5: Использование в боте

В вашем боте (в отдельном репозитории) добавьте функцию для получения конфигурации:

```javascript
const axios = require('axios');

async function getGuildConfig(guildId) {
  const response = await axios.get(
    `http://localhost:5000/api/guild/${guildId}/config`,
    {
      headers: {
        'X-Bot-Token': process.env.BOT_API_TOKEN
      }
    }
  );
  return response.data.settings;
}
```

Добавьте `BOT_API_TOKEN` в `.env` файл вашего бота (тот же токен, что и в API).

## Troubleshooting

### Ошибка подключения к MongoDB

Убедитесь, что MongoDB запущен:
```bash
# Проверка статуса (macOS)
brew services list | grep mongodb

# Запуск MongoDB (macOS)
brew services start mongodb-community
```

Или используйте MongoDB Atlas (облачный сервис).

### Ошибка CORS

Убедитесь, что `CORS_ORIGIN` в API `.env` совпадает с URL Dashboard (обычно `http://localhost:3000`).

### Бот не видит серверы

Убедитесь, что:
1. Бот добавлен на сервер
2. У вас есть права "Управление сервером" на сервере
3. `DISCORD_BOT_TOKEN` правильный

### Не работает OAuth

Проверьте:
1. Redirect URI в Discord Application совпадает с `DISCORD_REDIRECT_URI`
2. Client ID и Client Secret правильные
3. Приложение имеет правильные OAuth2 scopes: `identify`, `guilds`

## Production Deployment

Для production:

1. Измените `CORS_ORIGIN` на ваш домен
2. Измените `DISCORD_REDIRECT_URI` на ваш домен
3. Используйте переменные окружения на сервере
4. Соберите Dashboard: `cd dashboard && npm run build`
5. Настройте reverse proxy (nginx) для статических файлов Dashboard и проксирования API




