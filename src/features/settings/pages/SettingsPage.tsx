import { useState } from 'react'
import {
  Container,
  Title,
  Tabs,
  Paper,
  TextInput,
  Button,
  Stack,
  Group,
  Switch,
  PasswordInput,
  Select,
  Divider,
  Text,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconUser, IconBell, IconLock, IconPalette } from '@tabler/icons-react'
import { useAuth } from '../../../contexts/AuthContext'

export function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)

  const profileForm = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: '',
    },
  })

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword: (value) =>
        value.length >= 8 ? null : 'Password must be at least 8 characters',
      confirmPassword: (value, values) =>
        value === values.newPassword ? null : 'Passwords do not match',
    },
  })

  const handleProfileSubmit = async (values: typeof profileForm.values) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      updateUser({ name: values.name, email: values.email })
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      notifications.show({
        title: 'Success',
        message: 'Password changed successfully',
        color: 'green',
      })
      passwordForm.reset()
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to change password',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="lg">
      <Title order={1} mb="xl">
        Settings
      </Title>

      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Profile
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
            Security
          </Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
            Notifications
          </Tabs.Tab>
          <Tabs.Tab value="appearance" leftSection={<IconPalette size={16} />}>
            Appearance
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pt="xl">
          <Paper withBorder p="xl" radius="md">
            <form onSubmit={profileForm.onSubmit(handleProfileSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Full Name"
                  placeholder="Enter your name"
                  {...profileForm.getInputProps('name')}
                />
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  {...profileForm.getInputProps('email')}
                />
                <TextInput
                  label="Bio"
                  placeholder="Tell us about yourself"
                  {...profileForm.getInputProps('bio')}
                />
                <Group justify="flex-end">
                  <Button type="submit" loading={loading}>
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="security" pt="xl">
          <Paper withBorder p="xl" radius="md">
            <Title order={3} mb="md">
              Change Password
            </Title>
            <form onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}>
              <Stack gap="md">
                <PasswordInput
                  label="Current Password"
                  placeholder="Enter current password"
                  {...passwordForm.getInputProps('currentPassword')}
                />
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                  {...passwordForm.getInputProps('newPassword')}
                />
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  {...passwordForm.getInputProps('confirmPassword')}
                />
                <Group justify="flex-end">
                  <Button type="submit" loading={loading}>
                    Update Password
                  </Button>
                </Group>
              </Stack>
            </form>

            <Divider my="xl" />

            <Title order={3} mb="md">
              Two-Factor Authentication
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              Add an extra layer of security to your account
            </Text>
            <Button variant="light">Enable 2FA</Button>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="notifications" pt="xl">
          <Paper withBorder p="xl" radius="md">
            <Stack gap="md">
              <Switch label="Email notifications" defaultChecked />
              <Switch label="Push notifications" defaultChecked />
              <Switch label="Marketing emails" />
              <Switch label="Weekly summary" defaultChecked />
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="appearance" pt="xl">
          <Paper withBorder p="xl" radius="md">
            <Stack gap="md">
              <Select
                label="Theme"
                placeholder="Choose theme"
                data={['Light', 'Dark', 'Auto']}
                defaultValue="Light"
              />
              <Select
                label="Language"
                placeholder="Choose language"
                data={['English', 'Spanish', 'French', 'German']}
                defaultValue="English"
              />
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}
