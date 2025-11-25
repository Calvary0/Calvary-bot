import mongoose from 'mongoose'

const guildConfigSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  settings: {
    auditLog: {
      enabled: { type: Boolean, default: false },
      channelId: { type: String, default: '' },
    },
    economy: {
      enabled: { type: Boolean, default: false },
    },
    moderation: {
      enabled: { type: Boolean, default: true },
      autoMod: { type: Boolean, default: false },
      warnThreshold: { type: Number, default: 3 },
    },
    prefix: { type: String, default: '!' },
    language: { type: String, default: 'ru' },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

guildConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('GuildConfig', guildConfigSchema)

