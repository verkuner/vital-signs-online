import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiLogin, apiLogout, apiGetMe, apiRegister, type AuthUser } from '../services/authService'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function toUser(au: AuthUser): User {
  return { id: au.id, email: au.email, name: au.name, avatar: au.avatar, role: au.role }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const userData = await apiGetMe()
        if (userData) {
          setUser(toUser(userData))
        } else {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
        }
      } catch {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password)
    setUser(toUser(data.user))
  }

  const register = async (email: string, password: string, name: string) => {
    const data = await apiRegister(email, password, name)
    setUser(toUser(data.user))
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
