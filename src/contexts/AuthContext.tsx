import React, { createContext, useContext, useEffect, useState } from 'react'
import { type AuthUser } from '../services/authService'
import { getAuthMode, getAuthStrategy } from '../auth/strategies'
import type { AuthMode } from '../auth/strategies'

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
  mode: AuthMode
  login: (email?: string, password?: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  setUserFromAuth: (user: AuthUser) => void
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
  const mode = getAuthMode()
  const strategy = getAuthStrategy()

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const restored = await strategy.init()
        if (!cancelled && restored) {
          setUser(toUser(restored))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [strategy])

  const login = async (email?: string, password?: string) => {
    if (mode === 'oidc') {
      // Redirects the browser; this promise effectively never resolves.
      await strategy.login()
      return
    }
    if (!email || !password) {
      throw new Error('email and password are required for backend login')
    }
    const result = await strategy.login({ email, password })
    if (result) setUser(toUser(result))
  }

  const register = async (email: string, password: string, name: string) => {
    if (!strategy.register) {
      throw new Error('Registration is handled by the identity provider in this mode')
    }
    const result = await strategy.register({ email, password, name })
    setUser(toUser(result))
  }

  const logout = async () => {
    setUser(null)
    await strategy.logout()
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null))
  }

  const setUserFromAuth = (au: AuthUser) => {
    setUser(toUser(au))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        mode,
        login,
        register,
        logout,
        updateUser,
        setUserFromAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
