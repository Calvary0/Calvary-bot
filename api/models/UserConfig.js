import mongoose from 'mongoose'

const userConfigSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  preferences: {
    theme: { type: String, default: 'dark' },
    language: { type: String, default: 'ru' },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

userConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('UserConfig', userConfigSchema)

