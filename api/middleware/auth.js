import jwt from 'jsonwebtoken'
import axios from 'axios'

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.userId = decoded.userId
      req.discordAccessToken = decoded.accessToken
      return next()
    } catch {
      const response = await axios.get('https://discord.com/api/v10/users/@me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      req.userId = response.data.id
      req.discordAccessToken = token
      return next()
    }
  } catch {
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

export const verifyBotToken = (req, res, next) => {
  if (!process.env.BOT_API_TOKEN) {
    return next()
  }

  const botToken = req.headers['x-bot-token']
  if (!botToken || botToken !== process.env.BOT_API_TOKEN) {
    return res.status(401).json({ error: 'Invalid bot token' })
  }

  next()
}

