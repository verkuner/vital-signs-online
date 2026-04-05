# Core SaaS Features

## Overview

This guide covers implementing essential SaaS features including user management, billing, settings, notifications, and data tables.

## User Management

### 1. User List with Data Table

**src/pages/UsersPage.tsx**:

```typescript
import { useState } from 'react'
import {
  Container,
  Title,
  Paper,
  Table,
  Avatar,
  Group,
  Text,
  Badge,
  ActionIcon,
  Menu,
  TextInput,
  Button,
  Flex,
  Select,
  Pagination,
} from '@mantine/core'
import {
  IconSearch,
  IconDots,
  IconPencil,
  IconTrash,
  IconUserPlus,
} from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  avatar?: string
  joinedAt: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
    joinedAt: '2024-02-20',
  },
  // Add more mock users
]

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleDeleteUser = (userId: string) => {
    modals.openConfirmModal({
      title: 'Delete user',
      children: <Text size="sm">Are you sure you want to delete this user?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
        notifications.show({
          title: 'Success',
          message: 'User deleted successfully',
          color: 'green',
        })
      },
    })
  }

  return (
    <Container size="xl">
      <Title order={1} mb="xl">
        User Management
      </Title>

      <Paper withBorder p="md" radius="md" mb="md">
        <Flex
          gap="md"
          justify="space-between"
          align="flex-end"
          direction={{ base: 'column', sm: 'row' }}
        >
          <TextInput
            placeholder="Search users..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by role"
            data={['Admin', 'User', 'Manager']}
            value={roleFilter}
            onChange={setRoleFilter}
            clearable
            style={{ minWidth: 200 }}
          />
          <Button leftSection={<IconUserPlus size={16} />}>Add User</Button>
        </Flex>
      </Paper>

      <Paper withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Joined</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredUsers
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar src={user.avatar} radius="xl">
                        {user.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500}>
                          {user.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {user.email}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light">{user.role}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={user.status === 'active' ? 'green' : 'gray'}>
                      {user.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{user.joinedAt}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconPencil size={16} />}>
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size={16} />}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>

        <Flex justify="center" p="md">
          <Pagination
            total={Math.ceil(filteredUsers.length / itemsPerPage)}
            value={page}
            onChange={setPage}
          />
        </Flex>
      </Paper>
    </Container>
  )
}
```

## Billing & Subscriptions

### 2. Subscription Plans

**src/pages/BillingPage.tsx**:

```typescript
import {
  Container,
  Title,
  SimpleGrid,
  Card,
  Text,
  Button,
  List,
  Badge,
  Group,
  ThemeIcon,
  Stack,
  Paper,
  Table,
} from '@mantine/core'
import { IconCheck, IconDownload } from '@tabler/icons-react'

interface Plan {
  id: string
  name: string
  price: number
  interval: string
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    interval: 'month',
    features: [
      'Up to 5 users',
      '10 GB storage',
      'Basic support',
      'Core features',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 29,
    interval: 'month',
    popular: true,
    features: [
      'Up to 20 users',
      '100 GB storage',
      'Priority support',
      'Advanced features',
      'API access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited users',
      'Unlimited storage',
      '24/7 dedicated support',
      'All features',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
]

const invoices = [
  { id: 'INV-001', date: '2024-02-01', amount: '$29.00', status: 'Paid' },
  { id: 'INV-002', date: '2024-01-01', amount: '$29.00', status: 'Paid' },
  { id: 'INV-003', date: '2023-12-01', amount: '$29.00', status: 'Paid' },
]

export function BillingPage() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            Billing & Subscription
          </Title>
          <Text c="dimmed">Manage your subscription and billing information</Text>
        </div>

        <div>
          <Title order={2} mb="md">
            Choose Your Plan
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {plans.map((plan) => (
              <Card
                key={plan.id}
                withBorder
                radius="md"
                p="xl"
                style={{
                  position: 'relative',
                  border: plan.popular ? '2px solid var(--mantine-primary-color-5)' : undefined,
                }}
              >
                {plan.popular && (
                  <Badge
                    variant="filled"
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                    }}
                  >
                    Most Popular
                  </Badge>
                )}

                <Stack gap="md">
                  <div>
                    <Text size="xl" fw={700}>
                      {plan.name}
                    </Text>
                    <Group align="baseline" gap="xs" mt="xs">
                      <Text size="3rem" fw={900}>
                        ${plan.price}
                      </Text>
                      <Text size="sm" c="dimmed">
                        /{plan.interval}
                      </Text>
                    </Group>
                  </div>

                  <List
                    spacing="sm"
                    size="sm"
                    icon={
                      <ThemeIcon size={20} radius="xl" color="green">
                        <IconCheck size={12} />
                      </ThemeIcon>
                    }
                  >
                    {plan.features.map((feature) => (
                      <List.Item key={feature}>{feature}</List.Item>
                    ))}
                  </List>

                  <Button
                    fullWidth
                    variant={plan.popular ? 'filled' : 'light'}
                    size="md"
                  >
                    Get Started
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </div>

        <div>
          <Title order={2} mb="md">
            Billing History
          </Title>
          <Paper withBorder radius="md">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Invoice</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invoices.map((invoice) => (
                  <Table.Tr key={invoice.id}>
                    <Table.Td>
                      <Text fw={500}>{invoice.id}</Text>
                    </Table.Td>
                    <Table.Td>{invoice.date}</Table.Td>
                    <Table.Td>{invoice.amount}</Table.Td>
                    <Table.Td>
                      <Badge color="green">{invoice.status}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Button
                        variant="subtle"
                        size="xs"
                        leftSection={<IconDownload size={14} />}
                      >
                        Download
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </div>
      </Stack>
    </Container>
  )
}
```

## Settings Page

### 3. User Settings

**src/pages/SettingsPage.tsx**:

```typescript
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
import {
  IconUser,
  IconBell,
  IconLock,
  IconPalette,
} from '@tabler/icons-react'
import { useAuth } from '@/contexts/AuthContext'

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
      // API call to update profile
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

  const handlePasswordSubmit = async (values: typeof passwordForm.values) => {
    setLoading(true)
    try {
      // API call to change password
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
```

## Notification System

### 4. Notifications Page

**src/pages/NotificationsPage.tsx**:

```typescript
import {
  Container,
  Title,
  Paper,
  Stack,
  Group,
  Text,
  Badge,
  ActionIcon,
  Button,
  Flex,
} from '@mantine/core'
import { IconBell, IconCheck, IconTrash } from '@tabler/icons-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: string
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Welcome to the platform!',
    message: 'Thank you for joining us. Get started by exploring the dashboard.',
    type: 'success',
    read: false,
    timestamp: '2 minutes ago',
  },
  {
    id: '2',
    title: 'Payment received',
    message: 'Your payment of $29.00 has been processed successfully.',
    type: 'success',
    read: true,
    timestamp: '1 hour ago',
  },
  // Add more notifications
]

export function NotificationsPage() {
  return (
    <Container size="md">
      <Flex justify="space-between" align="center" mb="xl">
        <Title order={1}>Notifications</Title>
        <Button variant="subtle" size="sm">
          Mark all as read
        </Button>
      </Flex>

      <Stack gap="md">
        {notifications.map((notification) => (
          <Paper
            key={notification.id}
            withBorder
            p="md"
            radius="md"
            style={{
              opacity: notification.read ? 0.6 : 1,
            }}
          >
            <Group justify="space-between" align="flex-start">
              <Group align="flex-start" gap="md" style={{ flex: 1 }}>
                <IconBell size={20} />
                <div style={{ flex: 1 }}>
                  <Group justify="space-between" mb="xs">
                    <Text fw={500}>{notification.title}</Text>
                    {!notification.read && <Badge size="sm">New</Badge>}
                  </Group>
                  <Text size="sm" c="dimmed" mb="xs">
                    {notification.message}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {notification.timestamp}
                  </Text>
                </div>
              </Group>
              <Group gap="xs">
                <ActionIcon variant="subtle" color="green">
                  <IconCheck size={16} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="red">
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Container>
  )
}
```

---

**Next:** Proceed to `05-THEMING-STYLING.md` for customization options.
