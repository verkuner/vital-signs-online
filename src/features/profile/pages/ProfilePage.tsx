import { useEffect, useState } from 'react'
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  TextInput,
  Button,
  Group,
  Avatar,
  Loader,
  Center,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { get, patch } from '../../../services/apiClient'
import { useAuth } from '../../../contexts/AuthContext'

interface UserProfile {
  id: string
  provider_id: string
  email: string
  name: string
  date_of_birth?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export function ProfilePage() {
  const { updateUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      date_of_birth: '',
      avatar_url: '',
    },
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await get<{ data: UserProfile }>('/users/me')
        if (mounted) {
          form.setValues({
            name: res.data.name || '',
            email: res.data.email,
            date_of_birth: res.data.date_of_birth || '',
            avatar_url: res.data.avatar_url || '',
          })
        }
      } catch {
        notifications.show({ title: 'Error', message: 'Failed to load profile', color: 'red' })
      }
      if (mounted) setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await patch<{ data: UserProfile }>('/users/me', {
        name: form.values.name,
        date_of_birth: form.values.date_of_birth || undefined,
        avatar_url: form.values.avatar_url || undefined,
      })
      updateUser({ name: res.data.name, avatar: res.data.avatar_url })
      notifications.show({ title: 'Saved', message: 'Profile updated successfully', color: 'green' })
    } catch {
      notifications.show({ title: 'Error', message: 'Failed to save profile', color: 'red' })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <Center h={300}>
        <Loader />
      </Center>
    )
  }

  return (
    <Container size="md">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="xs">
            Profile
          </Title>
          <Text c="dimmed">Manage your personal details and preferences.</Text>
        </div>
        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Group>
              <Avatar size="xl" radius="xl" src={form.values.avatar_url || undefined}>
                {form.values.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div>
                <Text fw={600}>{form.values.name}</Text>
                <Text size="sm" c="dimmed">{form.values.email}</Text>
              </div>
            </Group>

            <TextInput
              label="Name"
              placeholder="Your name"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Email"
              disabled
              {...form.getInputProps('email')}
            />
            <TextInput
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              {...form.getInputProps('date_of_birth')}
            />
            <TextInput
              label="Avatar URL"
              placeholder="https://..."
              {...form.getInputProps('avatar_url')}
            />

            <Group justify="flex-end">
              <Button
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={handleSave}
                loading={saving}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
