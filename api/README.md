# Discord Bot API

REST API для хранения и выдачи настроек Discord бота.

## Установка

```bash
cd api
npm install
cp env.example .env
```

## Скрипты

- `npm run dev` — запуск в режиме разработки (node --watch)
- `npm start` — запуск в production

## Переменные окружения

| Название | Описание |
| --- | --- |
| `DISCORD_CLIENT_ID` | Client ID Discord приложения |
| `DISCORD_CLIENT_SECRET` | Client Secret Discord приложения |
| `DISCORD_REDIRECT_URI` | Redirect URI (например, http://localhost:3000/login) |
| `DISCORD_BOT_TOKEN` | Токен Discord бота (нужен для получения информации о серверах/каналах) |
| `JWT_SECRET` | Секрет для подписи JWT |
| `MONGODB_URI` | Строка подключения к MongoDB |
| `BOT_API_TOKEN` | Секрет для доступа к эндпоинту `/guild/:id/config` |
| `PORT` | Порт API (по умолчанию 5000) |
| `CORS_ORIGIN` | Разрешённые источники (по умолчанию http://localhost:3000) |

## Эндпоинты

### Auth
- `POST /api/auth/callback` — получить JWT после OAuth
- `GET /api/auth/user` — текущий пользователь
- `GET /api/auth/guilds` — сервера пользователя с правами управления

### Guild
- `GET /api/guild/:id` — информация о сервере + настройки
- `POST /api/guild/:id/settings` — сохранить настройки сервера
- `GET /api/guild/:id/config` — получить конфигурацию (для бота, требуется `X-Bot-Token`)

## База данных

Используется MongoDB, коллекция `guildconfigs` хранит объект:

```json
{
  "guildId": "123",
  "settings": {
    "auditLog": { "enabled": true, "channelId": "456" },
    "economy": { "enabled": false },
    "moderation": { "enabled": true, "autoMod": false, "warnThreshold": 3 },
    "prefix": "!",
    "language": "ru"
  }
}
```

## Мониторинг

- `GET /api/health` — проверка статуса API

