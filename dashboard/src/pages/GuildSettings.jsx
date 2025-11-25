import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Globe, LogOut, MessageSquare, Moon, Save, Shield, Sun, DollarSign, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import api from '../utils/api'

export default function GuildSettings() {
  const { guildId } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [guild, setGuild] = useState(null)
  const [channels, setChannels] = useState([])
  const [config, setConfig] = useState({
    auditLog: { enabled: false, channelId: '' },
    economy: { enabled: false },
    moderation: { enabled: true, autoMod: false, warnThreshold: 3 },
    prefix: '!',
    language: 'ru'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchGuildData()
  }, [guildId])

  const fetchGuildData = async () => {
    setLoading(true)
    try {
      const guildResponse = await api.get(`/guild/${guildId}`)
      const guildData = guildResponse.data

      setGuild(guildData)
      if (guildData?.settings) {
        setConfig(guildData.settings)
      }
      if (guildData?.channels) {
        setChannels(guildData.channels)
      }
    } catch (error) {
      console.error('Failed to fetch guild data:', error)
      setGuild({ id: guildId, name: 'Unknown Server' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post(`/guild/${guildId}/settings`, { settings: config })
      alert('Настройки сохранены')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Ошибка при сохранении настроек')
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (path, value) => {
    setConfig(prev => {
      const keys = path.split('.')
      const newConfig = { ...prev }
      let current = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newConfig
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                {guild?.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guildId}/${guild.icon}.png`}
                    alt={guild?.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center text-white font-bold">
                    {guild?.name?.charAt(0)}
                  </div>
                )}
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {guild?.name || 'Настройки сервера'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <img
                  src={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default-avatar.png'}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full"
                />
                <span>{user?.username}</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-discord-blurple hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>

        <section className="grid gap-6">
          <SettingsCard
            icon={<Settings className="w-6 h-6 text-discord-blurple" />}
            title="Настройки аудита"
            description="Логи действий пользователей"
          >
            <ToggleRow
              label="Включить логи аудита"
              checked={config.auditLog.enabled}
              onChange={(value) => updateConfig('auditLog.enabled', value)}
            />
            {config.auditLog.enabled && (
              <SelectField
                label="Канал для логов"
                value={config.auditLog.channelId}
                onChange={(value) => updateConfig('auditLog.channelId', value)}
                options={channels}
              />
            )}
          </SettingsCard>

          <SettingsCard
            icon={<DollarSign className="w-6 h-6 text-discord-green" />}
            title="Экономика"
            description="Система уровней и валюты"
          >
            <ToggleRow
              label="Включить экономику"
              checked={config.economy.enabled}
              onChange={(value) => updateConfig('economy.enabled', value)}
            />
          </SettingsCard>

          <SettingsCard
            icon={<Shield className="w-6 h-6 text-discord-red" />}
            title="Модерация"
            description="Автоматические меры наказаний"
          >
            <ToggleRow
              label="Включить модерацию"
              checked={config.moderation.enabled}
              onChange={(value) => updateConfig('moderation.enabled', value)}
            />
            <ToggleRow
              label="Автомодерация"
              checked={config.moderation.autoMod}
              onChange={(value) => updateConfig('moderation.autoMod', value)}
            />
            <NumberField
              label="Порог предупреждений для блокировки"
              min={1}
              max={10}
              value={config.moderation.warnThreshold}
              onChange={(value) => updateConfig('moderation.warnThreshold', value)}
            />
          </SettingsCard>

          <SettingsCard
            icon={<MessageSquare className="w-6 h-6 text-discord-yellow" />}
            title="Префикс команд"
          >
            <TextField
              label="Префикс"
              maxLength={5}
              value={config.prefix}
              onChange={(value) => updateConfig('prefix', value)}
            />
          </SettingsCard>

          <SettingsCard
            icon={<Globe className="w-6 h-6 text-discord-fuchsia" />}
            title="Язык сервера"
          >
            <SelectField
              label="Язык"
              value={config.language}
              onChange={(value) => updateConfig('language', value)}
              options={[
                { id: 'ru', name: 'Русский' },
                { id: 'en', name: 'English' },
                { id: 'de', name: 'Deutsch' },
                { id: 'uk', name: 'Українська' },
              ]}
            />
          </SettingsCard>
        </section>
      </main>
    </div>
  )
}

function SettingsCard({ icon, title, description, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow p-6 space-y-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <input
        type="checkbox"
        className="w-5 h-5 text-discord-blurple rounded focus:ring-2 focus:ring-discord-blurple"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-discord-blurple"
      >
        <option value="">Выберите значение</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function NumberField({ label, value, onChange, min = 0, max = 100 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-discord-blurple"
      />
    </div>
  )
}

function TextField({ label, value, onChange, maxLength = 10 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="text"
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-discord-blurple"
      />
    </div>
  )
}

