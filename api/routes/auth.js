import express from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/callback', async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ error: 'No code provided' })
    }

    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    )

    const { access_token } = tokenResponse.data

    const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const token = jwt.sign(
      {
        userId: userResponse.data.id,
        accessToken: access_token,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: userResponse.data.id,
        username: userResponse.data.username,
        discriminator: userResponse.data.discriminator,
        avatar: userResponse.data.avatar,
        email: userResponse.data.email,
      },
    })
  } catch (error) {
    console.error('OAuth callback error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Failed to authenticate' })
  }
})

router.get('/user', verifyToken, async (req, res) => {
  try {
    const response = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${req.discordAccessToken}`,
      },
    })

    res.json({
      id: response.data.id,
      username: response.data.username,
      discriminator: response.data.discriminator,
      avatar: response.data.avatar,
      email: response.data.email,
    })
  } catch (error) {
    console.error('Get user error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.get('/guilds', verifyToken, async (req, res) => {
  try {
    const response = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${req.discordAccessToken}`,
      },
    })

    const guilds = response.data.filter((guild) => {
      const permissions = BigInt(guild.permissions)
      const MANAGE_GUILD = BigInt(0x20)
      return (permissions & MANAGE_GUILD) === MANAGE_GUILD
    })

    res.json(guilds)
  } catch (error) {
    console.error('Get guilds error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Failed to fetch guilds' })
  }
})

export default router

