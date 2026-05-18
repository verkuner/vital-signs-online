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
import { IconAlertCircle, IconBrandGoogle, IconBrandGithub, IconExternalLink } from '@tabler/icons-react'
import { useAuth } from '../../../contexts/AuthContext'

function getKeycloakAccountUrl(): string | null {
  const authority = import.meta.env.VITE_OIDC_AUTHORITY
  if (!authority) return null
  return `${authority.replace(/\/$/, '')}/account`
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, mode } = useAuth()
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
    } catch {
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

  if (mode === 'oidc') {
    const accountUrl = getKeycloakAccountUrl()
    return (
      <Container size={420} my={40}>
        <Title ta="center" fw={900}>
          Create an account
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Registration is handled by your identity provider
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Stack gap="md">
            <Text size="sm">
              This deployment uses KeyCloak for sign-in. Please register through the KeyCloak account
              console, then return here to sign in.
            </Text>

            {accountUrl ? (
              <Button
                component="a"
                href={accountUrl}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
                rightSection={<IconExternalLink size={16} />}
              >
                Open KeyCloak account console
              </Button>
            ) : (
              <Alert color="yellow">
                OIDC authority is not configured; cannot link to the account console.
              </Alert>
            )}

            <Button variant="default" fullWidth component={Link} to="/login">
              Back to sign in
            </Button>
          </Stack>
        </Paper>
      </Container>
    )
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
