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
import { IconAlertCircle, IconBrandGoogle, IconBrandGithub, IconLogin } from '@tabler/icons-react'
import { useAuth } from '../../../contexts/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, mode } = useAuth()
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
    } catch {
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

  const handleOidcLogin = async () => {
    setLoading(true)
    setError('')
    try {
      // Redirects the browser to KeyCloak; promise effectively never resolves.
      await login()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start sign-in'
      setError(message)
      setLoading(false)
    }
  }

  if (mode === 'oidc') {
    return (
      <Container size={420} my={40}>
        <Title ta="center" fw={900}>
          Welcome
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Sign in with your organization account
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Stack gap="md">
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              size="md"
              leftSection={<IconLogin size={18} />}
              onClick={handleOidcLogin}
              loading={loading}
            >
              Sign in with KeyCloak
            </Button>
          </Stack>
        </Paper>
      </Container>
    )
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don&apos;t have an account yet?{' '}
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
