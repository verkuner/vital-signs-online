import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Center, Loader, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { getAuthStrategy } from '../../../auth/strategies'
import { OidcStrategy } from '../../../auth/strategies/oidcStrategy'
import { useAuth } from '../../../contexts/AuthContext'

export function CallbackPage() {
  const navigate = useNavigate()
  const { setUserFromAuth } = useAuth()

  useEffect(() => {
    const strategy = getAuthStrategy()
    if (!(strategy instanceof OidcStrategy)) {
      navigate('/login', { replace: true })
      return
    }

    strategy
      .completeSignin()
      .then((user) => {
        setUserFromAuth(user)
        notifications.show({
          title: 'Signed in',
          message: `Welcome, ${user.name}`,
          color: 'green',
        })
        navigate('/dashboard', { replace: true })
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Sign-in failed'
        notifications.show({
          title: 'Sign-in failed',
          message,
          color: 'red',
        })
        navigate('/login', { replace: true })
      })
  }, [navigate, setUserFromAuth])

  return (
    <Center h="100vh">
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text c="dimmed">Completing sign-in…</Text>
      </Stack>
    </Center>
  )
}
