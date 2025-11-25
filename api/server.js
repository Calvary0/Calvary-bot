import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import guildRoutes from './routes/guild.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/discord-bot'

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}))
app.use(express.json())

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })

app.use('/api/auth', authRoutes)
app.use('/api/guild', guildRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`)
})

