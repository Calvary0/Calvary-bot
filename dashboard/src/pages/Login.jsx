import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      handleCallback(code)
    }
  }, [])

  const handleCallback = async (code) => {
    try {
      const response = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) throw new Error('Auth failed')

      const data = await response.json()
      login(data.token)
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleLogin = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID
    const redirectUri = encodeURIComponent(`${window.location.origin}/login`)
    const scope = encodeURIComponent('identify guilds')
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`

    window.location.href = discordAuthUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-discord-blurple via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discord Bot Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Войдите через Discord, чтобы продолжить
          </p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-discord-blurple hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          Войти через Discord
        </button>
      </div>
    </div>
  )
}

