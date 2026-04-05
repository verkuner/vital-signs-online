# Authentication System

## Overview

This guide covers implementing a complete authentication system with login, registration, password reset, and protected routes.

## Authentication Context

### 1. Create Auth Context

**src/contexts/AuthContext.tsx**:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react'

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token and validate
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          // Validate token with your API
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            localStorage.removeItem('auth_token')
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('auth_token')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Replace with your API call
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      localStorage.setItem('auth_token', data.token)
      setUser(data.user)
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const data = await response.json()
      localStorage.setItem('auth_token', data.token)
      setUser(data.user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
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
```

## Login Page

### 2. Create Login Component

**src/pages/LoginPage.tsx**:

```typescript
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Group,
  Anchor,
  Stack,
  Divider,
  Alert,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle, IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react'
import { useAuth } from '@/contexts/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)
    setError('')
    
    try {
      await login(values.email, values.password)
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green',
      })
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
      notifications.show({
        title: 'Error',
        message: 'Failed to log in',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account yet?{' '}
        <Anchor size="sm" component={Link} to="/register">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {error}
              </Alert>
            )}

            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />

            <Group justify="space-between">
              <Anchor component={Link} to="/forgot-password" size="sm">
                Forgot password?
              </Anchor>
            </Group>

            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>

            <Divider label="Or continue with" labelPosition="center" />

            <Group grow>
              <Button variant="default" leftSection={<IconBrandGoogle size={16} />}>
                Google
              </Button>
              <Button variant="default" leftSection={<IconBrandGithub size={16} />}>
                GitHub
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
```

## Registration Page

### 3. Create Register Component

**src/pages/RegisterPage.tsx**:

```typescript
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Anchor,
  Stack,
  Divider,
  Alert,
  Group,
  Checkbox,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle, IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react'
import { useAuth } from '@/contexts/AuthContext'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    validate: {
      name: (value) => (value.length >= 2 ? null : 'Name must be at least 2 characters'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
      terms: (value) => (value ? null : 'You must accept terms and conditions'),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)
    setError('')
    
    try {
      await register(values.email, values.password, values.name)
      notifications.show({
        title: 'Success',
        message: 'Account created successfully',
        color: 'green',
      })
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to create account')
      notifications.show({
        title: 'Error',
        message: 'Failed to create account',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Create your account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component={Link} to="/login">
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {error}
              </Alert>
            )}

            <TextInput
              label="Full name"
              placeholder="John Doe"
              required
              {...form.getInputProps('name')}
            />

            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label="Confirm password"
              placeholder="Confirm your password"
              required
              {...form.getInputProps('confirmPassword')}
            />

            <Checkbox
              label={
                <>
                  I accept{' '}
                  <Anchor size="sm" component={Link} to="/terms">
                    terms and conditions
                  </Anchor>
                </>
              }
              {...form.getInputProps('terms', { type: 'checkbox' })}
            />

            <Button type="submit" fullWidth loading={loading}>
              Create account
            </Button>

            <Divider label="Or continue with" labelPosition="center" />

            <Group grow>
              <Button variant="default" leftSection={<IconBrandGoogle size={16} />}>
                Google
              </Button>
              <Button variant="default" leftSection={<IconBrandGithub size={16} />}>
                GitHub
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
```

## Password Reset

### 4. Create Forgot Password Page

**src/pages/ForgotPasswordPage.tsx**:

```typescript
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Paper,
  TextInput,
  Button,
  Title,
  Text,
  Container,
  Anchor,
  Stack,
  Center,
  Box,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconArrowLeft } from '@tabler/icons-react'

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)
    
    try {
      // Call your password reset API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
      notifications.show({
        title: 'Email sent',
        message: 'Check your inbox for password reset instructions',
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to send reset email',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Forgot your password?
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {submitted ? (
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              If an account exists for {form.values.email}, you will receive a password reset email shortly.
            </Text>
            <Center>
              <Anchor component={Link} to="/login" size="sm">
                <Group gap="xs">
                  <IconArrowLeft size={16} />
                  <span>Back to login</span>
                </Group>
              </Anchor>
            </Center>
          </Stack>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="you@example.com"
                required
                {...form.getInputProps('email')}
              />

              <Button type="submit" fullWidth loading={loading}>
                Send reset link
              </Button>

              <Center>
                <Anchor component={Link} to="/login" size="sm">
                  <Group gap="xs">
                    <IconArrowLeft size={16} />
                    <span>Back to login</span>
                  </Group>
                </Anchor>
              </Center>
            </Stack>
          </form>
        )}
      </Paper>
    </Container>
  )
}
```

## Protected Routes

Already covered in `01-SETUP-CONFIGURATION.md`, but here's a more advanced version:

**src/components/auth/ProtectedRoute.tsx**:

```typescript
import { Navigate, useLocation } from 'react-router-dom'
import { LoadingOverlay } from '@mantine/core'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingOverlay visible />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
```

---

**Next:** Proceed to `03-DASHBOARD-LAYOUT.md` for the dashboard implementation.
