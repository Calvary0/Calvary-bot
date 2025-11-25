# Структура проекта

```
Amaribot-clone/
├── api/                  # Express API
│   ├── routes/
│   │   ├── auth.js
│   │   └── guild.js
│   ├── models/
│   │   ├── GuildConfig.js
│   │   └── UserConfig.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── env.example
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── dashboard/            # React + Vite SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── GuildSelect.jsx
│   │   │   └── GuildSettings.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── utils/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
│
├── index.html            # Лэндинг бота
├── about.html / commands.html / ... (страницы сайта)
├── style.css             # Стили сайта
├── README.md             # Общая документация
├── QUICK_START.md        # Быстрый чек-лист
└── SETUP.md              # Подробная инструкция
```

