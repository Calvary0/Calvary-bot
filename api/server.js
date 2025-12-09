import './bot.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import guildRoutes from './routes/guild.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
const MONGO_URI = process.env.MONGODB_URI

if (!MONGO_URI) {
  console.error('❌ MONGODB_URI не задан в .env')
  process.exit(1)
}
console.log('🔗 Using MongoDB URI:', MONGO_URI)

// CORS настройки для production и development
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:8080']

app.use(cors({
  origin: (origin, callback) => {
    // Разрешаем запросы без origin (например, Postman, curl)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err)
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
