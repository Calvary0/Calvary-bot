import express from 'express'
import axios from 'axios'
import GuildConfig from '../models/GuildConfig.js'
import { verifyToken, verifyBotToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/:guildId', verifyToken, async (req, res) => {
  try {
    const { guildId } = req.params
    let guildData = { id: guildId, name: 'Unknown', icon: null }
    let channels = []

    if (process.env.DISCORD_BOT_TOKEN) {
      try {
        const guildResponse = await axios.get(`https://discord.com/api/v10/guilds/${guildId}`, {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        })
        guildData = {
          id: guildId,
          name: guildResponse.data.name,
          icon: guildResponse.data.icon || null,
        }
      } catch (error) {
        console.warn('Unable to fetch guild info from Discord:', error.response?.data || error.message)
      }

      try {
        const channelsResponse = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        })
        channels = channelsResponse.data
          .filter(ch => ch.type === 0)
          .map(ch => ({ id: ch.id, name: ch.name }))
      } catch (error) {
        console.warn('Unable to fetch channels:', error.response?.data || error.message)
      }
    }

    const config = await GuildConfig.findOne({ guildId })

    res.json({
      ...guildData,
      channels,
      settings: config?.settings || null,
    })
  } catch (error) {
    console.error('Get guild error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Failed to fetch guild' })
  }
})

router.post('/:guildId/settings', verifyToken, async (req, res) => {
  try {
    const { guildId } = req.params
    const { settings } = req.body

    const guildsResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${req.discordAccessToken}` },
    })

    const hasPermission = guildsResponse.data.some((guild) => {
      if (guild.id !== guildId) return false
      const permissions = BigInt(guild.permissions)
      const MANAGE_GUILD = BigInt(0x20)
      return (permissions & MANAGE_GUILD) === MANAGE_GUILD
    })

    if (!hasPermission) {
      return res.status(403).json({ error: 'No permission to manage this guild' })
    }

    const config = await GuildConfig.findOneAndUpdate(
      { guildId },
      { guildId, settings, updatedAt: new Date() },
      { upsert: true, new: true }
    )

    res.json({ success: true, config })
  } catch (error) {
    console.error('Update settings error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Failed to update settings' })
  }
})

router.get('/:guildId/config', verifyBotToken, async (req, res) => {
  try {
    const { guildId } = req.params
    const config = await GuildConfig.findOne({ guildId })

    if (!config) {
      return res.json({
        guildId,
        settings: {
          auditLog: { enabled: false, channelId: '' },
          economy: { enabled: false },
          moderation: { enabled: true, autoMod: false, warnThreshold: 3 },
          prefix: '!',
          language: 'ru',
        },
      })
    }

    res.json({
      guildId: config.guildId,
      settings: config.settings,
      updatedAt: config.updatedAt,
    })
  } catch (error) {
    console.error('Get config error:', error.message)
    res.status(500).json({ error: 'Failed to fetch config' })
  }
})

export default router

