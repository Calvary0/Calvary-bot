# Использование API в боте

## Запрос настроек сервера

```javascript
import axios from 'axios'

const API_BASE = process.env.DASHBOARD_API || 'http://localhost:5000'

export async function getGuildConfig(guildId) {
  try {
    const response = await axios.get(`${API_BASE}/api/guild/${guildId}/config`, {
      headers: {
        'X-Bot-Token': process.env.BOT_API_TOKEN,
      },
    })

    return response.data.settings
  } catch (error) {
    console.error('Failed to fetch config:', error)
    return {
      auditLog: { enabled: false, channelId: '' },
      economy: { enabled: false },
      moderation: { enabled: true, autoMod: false, warnThreshold: 3 },
      prefix: '!',
      language: 'ru',
    }
  }
}
```

## Кэширование

```javascript
const configCache = new Map()

export async function getGuildConfigCached(guildId) {
  const cached = configCache.get(guildId)
  const TTL = 60 * 1000 // 1 минута

  if (cached && Date.now() - cached.timestamp < TTL) {
    return cached.config
  }

  const config = await getGuildConfig(guildId)
  configCache.set(guildId, { config, timestamp: Date.now() })
  return config
}
```

## Вызов в discord.js

```javascript
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return

  const config = await getGuildConfigCached(message.guild.id)
  const prefix = config.prefix

  if (!message.content.startsWith(prefix)) return

  // ваша логика команд
})
```

