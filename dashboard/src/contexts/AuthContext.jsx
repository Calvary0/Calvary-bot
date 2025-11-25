import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('discord_token')
      if (!token) {
        setUser(null)
        return
      }

      const response = await api.get('/auth/user')
      setUser(response.data)
    } catch {
      localStorage.removeItem('discord_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = (token) => {
    localStorage.setItem('discord_token', token)
    checkAuth()
  }

  const logout = () => {
    localStorage.removeItem('discord_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

