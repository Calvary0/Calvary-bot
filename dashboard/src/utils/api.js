import axios from 'axios'

// Получаем URL API из переменной окружения или используем относительный путь
const getApiBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) {
    // Убираем trailing slash если есть
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl
  }
  // Для production используем абсолютный URL, для dev - относительный
  if (import.meta.env.PROD) {
    // В production можно использовать полный URL или оставить относительный
    // Если API на том же домене - используем относительный путь
    return '/api'
  }
  return '/api'
}

const api = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('discord_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('discord_token')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

