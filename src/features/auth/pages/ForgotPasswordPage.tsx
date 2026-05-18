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
  Group,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconArrowLeft, IconExternalLink } from '@tabler/icons-react'
import { apiForgotPassword } from '../../../services/authService'
import { useAuth } from '../../../contexts/AuthContext'

function getKeycloakAccountUrl(): string | null {
  const authority = import.meta.env.VITE_OIDC_AUTHORITY
  if (!authority) return null
  return `${authority.replace(/\/$/, '')}/account`
}

export function ForgotPasswordPage() {
  const { mode } = useAuth()
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

  const handleSubmit = async () => {
    setLoading(true)

    try {
      await apiForgotPassword(form.values.email)
      setSubmitted(true)
      notifications.show({
        title: 'Email sent',
        message: 'Check your inbox for password reset instructions',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to send reset email',
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
          Reset your password
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Password resets are handled by your identity provider
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Stack gap="md">
            <Text size="sm">
              This deployment uses KeyCloak. Reset your password through the KeyCloak account
              console.
            </Text>

            {accountUrl && (
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
            )}

            <Center>
              <Anchor component={Link} to="/login" size="sm">
                <Group gap="xs">
                  <IconArrowLeft size={16} />
                  <span>Back to login</span>
                </Group>
              </Anchor>
            </Center>
          </Stack>
        </Paper>
      </Container>
    )
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
              If an account exists for {form.values.email}, you will receive a password reset
              email shortly.
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
