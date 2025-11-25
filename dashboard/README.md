# Discord Bot Dashboard

React SPA для управления настройками Discord бота.

## Установка

```bash
cd dashboard
npm install
```

Создайте файл `.env` на основе `env.example`:

```bash
cp env.example .env
```

## Скрипты

- `npm run dev` — локальная разработка (http://localhost:3000)
- `npm run build` — production сборка
- `npm run preview` — предпросмотр сборки

## Функциональность

- Авторизация через Discord OAuth2
- Список доступных серверов (guilds)
- Страница настроек сервера:
  - Логи аудита (вкл/выкл + выбор канала)
  - Экономика
  - Модерация (автомод и порог предупреждений)
  - Префикс команд
  - Язык сервера
- Переключение тёмной/светлой темы

## Окружение

В `.env` необходима переменная:

```
VITE_DISCORD_CLIENT_ID=ваш_client_id
```

Backend должен работать на `http://localhost:5000` (см. `vite.config.js` proxy).

