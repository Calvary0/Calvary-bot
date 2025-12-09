import { Client, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const API_BASE = process.env.DASHBOARD_API || process.env.API_URL || 'http://localhost:5001'
const BOT_API_TOKEN = process.env.BOT_API_TOKEN

if (!BOT_TOKEN) {
  console.warn('⚠️  DISCORD_BOT_TOKEN не задан. Бот не будет запущен.')
  // Не останавливаем процесс, чтобы API продолжало работать
} else {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  })

  // Кэш для настроек серверов
  const configCache = new Map()
  const CACHE_TTL = 60 * 1000 // 1 минута

  // Функция для получения настроек сервера из API
  async function getGuildConfig(guildId) {
    try {
      const response = await axios.get(`${API_BASE}/api/guild/${guildId}/config`, {
        headers: {
          'X-Bot-Token': BOT_API_TOKEN,
        },
      })
      return response.data.settings
    } catch (error) {
      console.error(`Failed to fetch config for guild ${guildId}:`, error.message)
      // Возвращаем настройки по умолчанию
      return {
        auditLog: { enabled: false, channelId: '' },
        economy: { enabled: false },
        moderation: { enabled: true, autoMod: false, warnThreshold: 3 },
        prefix: '!',
        language: 'ru',
      }
    }
  }

  // Функция с кэшированием
  async function getGuildConfigCached(guildId) {
    const cached = configCache.get(guildId)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.config
    }

    const config = await getGuildConfig(guildId)
    configCache.set(guildId, { config, timestamp: Date.now() })
    return config
  }

  // Очистка кэша при изменении настроек (можно вызывать из API)
  export function clearGuildCache(guildId) {
    if (guildId) {
      configCache.delete(guildId)
    } else {
      configCache.clear()
    }
  }

  // События бота
  client.once('ready', () => {
    console.log(`✅ Discord bot logged in as ${client.user.tag}`)
    console.log(`📊 Bot is in ${client.guilds.cache.size} guilds`)
  })

  client.on('messageCreate', async (message) => {
    // Игнорируем сообщения от ботов и не в гильдиях
    if (message.author.bot || !message.guild) return

    try {
      const config = await getGuildConfigCached(message.guild.id)
      const prefix = config.prefix || '!'

      if (!message.content.startsWith(prefix)) return

      const args = message.content.slice(prefix.length).trim().split(/ +/)
      const command = args.shift()?.toLowerCase()

      // Пример команды ping
      if (command === 'ping') {
        await message.reply('Pong! 🏓')
      }

      // Здесь можно добавить другие команды
      // Используйте config для получения настроек сервера
    } catch (error) {
      console.error('Error handling message:', error)
    }
  })

  client.on('error', (error) => {
    console.error('Discord client error:', error)
  })

  // Запуск бота
  client.login(BOT_TOKEN).catch((error) => {
    console.error('❌ Failed to login Discord bot:', error.message)
    // Не останавливаем процесс, чтобы API продолжало работать
  })
}

