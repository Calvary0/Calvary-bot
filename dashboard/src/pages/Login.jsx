import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || '/api'
    return url.endsWith('/') ? url.slice(0, -1) : url
  }

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      handleCallback(code)
    } else if (localStorage.getItem('discord_token')) {
      navigate('/dashboard')
    }
  }, [navigate, searchParams])

  const handleCallback = async (code) => {
    try {
      const apiUrl = getApiUrl()
      console.log('API URL для callback:', `${apiUrl}/auth/callback`)

      const response = await fetch(`${apiUrl}/auth/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) throw new Error('Auth failed')

      const data = await response.json()
      console.log('JWT с сервера:', data.token)
      localStorage.setItem('discord_token', data.token)
      login(data.token)
      navigate('/dashboard')
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
