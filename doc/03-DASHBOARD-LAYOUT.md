# Dashboard Layout & Navigation

## Overview

This guide covers creating a responsive dashboard layout with navigation, header, and sidebar components.

## Dashboard Layout Structure

### 1. Main Dashboard Layout

**src/components/layout/DashboardLayout.tsx**:

```typescript
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DashboardHeader } from './DashboardHeader'
import { DashboardNavbar } from './DashboardNavbar'

export function DashboardLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <DashboardHeader
        mobileOpened={mobileOpened}
        desktopOpened={desktopOpened}
        toggleMobile={toggleMobile}
        toggleDesktop={toggleDesktop}
      />
      <DashboardNavbar />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
```

## Header Component

### 2. Dashboard Header

**src/components/layout/DashboardHeader.tsx**:

```typescript
import {
  Group,
  Burger,
  Avatar,
  Menu,
  Text,
  UnstyledButton,
  rem,
  useMantineTheme,
  ActionIcon,
  TextInput,
} from '@mantine/core'
import { AppShell } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import {
  IconLogout,
  IconSettings,
  IconUser,
  IconChevronDown,
  IconSearch,
  IconBell,
  IconMessageCircle,
} from '@tabler/icons-react'
import { useAuth } from '@/contexts/AuthContext'
import { notifications } from '@mantine/notifications'

interface DashboardHeaderProps {
  mobileOpened: boolean
  desktopOpened: boolean
  toggleMobile: () => void
  toggleDesktop: () => void
}

export function DashboardHeader({
  mobileOpened,
  desktopOpened,
  toggleMobile,
  toggleDesktop,
}: DashboardHeaderProps) {
  const theme = useMantineTheme()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    notifications.show({
      title: 'Logged out',
      message: 'You have been logged out successfully',
      color: 'blue',
    })
    navigate('/login')
  }

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <Text size="xl" fw={700} c={theme.primaryColor}>
            {import.meta.env.VITE_APP_NAME || 'SaaS App'}
          </Text>
        </Group>

        <Group>
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
            visibleFrom="sm"
            styles={{ input: { width: rem(250) } }}
          />

          <ActionIcon variant="subtle" size="lg" visibleFrom="sm">
            <IconMessageCircle size={20} />
          </ActionIcon>

          <ActionIcon variant="subtle" size="lg">
            <IconBell size={20} />
          </ActionIcon>

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <Avatar src={user?.avatar} radius="xl" size="sm">
                    {user?.name?.charAt(0)}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500} visibleFrom="sm">
                      {user?.name}
                    </Text>
                  </div>
                  <IconChevronDown size={16} />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                leftSection={<IconUser size={16} />}
                onClick={() => navigate('/profile')}
              >
                Profile
              </Menu.Item>
              <Menu.Item
                leftSection={<IconSettings size={16} />}
                onClick={() => navigate('/settings')}
              >
                Settings
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  )
}
```

## Navbar Component

### 3. Dashboard Navbar

**src/components/layout/DashboardNavbar.tsx**:

```typescript
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AppShell, NavLink as MantineNavLink, Stack, Box, ScrollArea } from '@mantine/core'
import {
  IconDashboard,
  IconUsers,
  IconSettings,
  IconChartBar,
  IconFileText,
  IconCreditCard,
  IconBell,
  IconHelp,
  IconChevronRight,
} from '@tabler/icons-react'

interface NavItem {
  label: string
  icon: React.ReactNode
  link?: string
  items?: NavItem[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <IconDashboard size={20} />,
    link: '/dashboard',
  },
  {
    label: 'Analytics',
    icon: <IconChartBar size={20} />,
    items: [
      { label: 'Overview', icon: <IconChartBar size={16} />, link: '/analytics/overview' },
      { label: 'Reports', icon: <IconFileText size={16} />, link: '/analytics/reports' },
    ],
  },
  {
    label: 'Users',
    icon: <IconUsers size={20} />,
    link: '/users',
  },
  {
    label: 'Billing',
    icon: <IconCreditCard size={20} />,
    items: [
      { label: 'Subscriptions', icon: <IconCreditCard size={16} />, link: '/billing/subscriptions' },
      { label: 'Invoices', icon: <IconFileText size={16} />, link: '/billing/invoices' },
    ],
  },
  {
    label: 'Notifications',
    icon: <IconBell size={20} />,
    link: '/notifications',
  },
  {
    label: 'Settings',
    icon: <IconSettings size={20} />,
    link: '/settings',
  },
  {
    label: 'Help & Support',
    icon: <IconHelp size={20} />,
    link: '/support',
  },
]

function NavItem({ item }: { item: NavItem }) {
  const [opened, setOpened] = useState(false)

  if (item.items) {
    return (
      <MantineNavLink
        label={item.label}
        leftSection={item.icon}
        rightSection={<IconChevronRight size={16} />}
        opened={opened}
        onClick={() => setOpened(!opened)}
      >
        {item.items.map((subItem) => (
          <NavLink key={subItem.label} to={subItem.link!} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <MantineNavLink
                label={subItem.label}
                leftSection={subItem.icon}
                active={isActive}
              />
            )}
          </NavLink>
        ))}
      </MantineNavLink>
    )
  }

  return (
    <NavLink to={item.link!} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <MantineNavLink label={item.label} leftSection={item.icon} active={isActive} />
      )}
    </NavLink>
  )
}

export function DashboardNavbar() {
  return (
    <AppShell.Navbar p="md">
      <AppShell.Section grow component={ScrollArea}>
        <Stack gap="xs">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </Stack>
      </AppShell.Section>

      <AppShell.Section>
        <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          <MantineNavLink
            label="Documentation"
            leftSection={<IconFileText size={20} />}
            component="a"
            href="https://docs.example.com"
            target="_blank"
          />
        </Box>
      </AppShell.Section>
    </AppShell.Navbar>
  )
}
```

## Dashboard Page

### 4. Main Dashboard Page

**src/pages/DashboardPage.tsx**:

```typescript
import {
  Grid,
  Card,
  Text,
  Title,
  Group,
  ThemeIcon,
  SimpleGrid,
  Paper,
  Progress,
  Stack,
  Badge,
  ActionIcon,
  Menu,
} from '@mantine/core'
import {
  IconUsers,
  IconCreditCard,
  IconChartBar,
  IconArrowUpRight,
  IconArrowDownRight,
  IconDots,
} from '@tabler/icons-react'

interface StatCardProps {
  title: string
  value: string
  diff: number
  icon: React.ReactNode
}

function StatCard({ title, value, diff, icon }: StatCardProps) {
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight
  const color = diff > 0 ? 'teal' : 'red'

  return (
    <Card withBorder p="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Title order={2} mt="xs">
            {value}
          </Title>
        </div>
        <ThemeIcon size="xl" radius="md" variant="light">
          {icon}
        </ThemeIcon>
      </Group>
      <Group mt="md" gap="xs">
        <Text size="sm" c={color} fw={700}>
          {diff > 0 ? '+' : ''}{diff}%
        </Text>
        <Text size="xs" c="dimmed">
          vs last month
        </Text>
      </Group>
    </Card>
  )
}

export function DashboardPage() {
  const stats = [
    {
      title: 'Total Users',
      value: '13,456',
      diff: 12,
      icon: <IconUsers size={24} />,
    },
    {
      title: 'Revenue',
      value: '$45,231',
      diff: 8,
      icon: <IconCreditCard size={24} />,
    },
    {
      title: 'Conversion',
      value: '3.24%',
      diff: -2,
      icon: <IconChartBar size={24} />,
    },
  ]

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Created account', time: '2 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'Upgraded plan', time: '15 minutes ago' },
    { id: 3, user: 'Bob Johnson', action: 'Submitted ticket', time: '1 hour ago' },
  ]

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Dashboard</Title>
        <Badge size="lg" variant="light">
          Last updated: 2 minutes ago
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="md" radius="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Performance Overview</Title>
              <Menu shadow="md">
                <Menu.Target>
                  <ActionIcon variant="subtle">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>Last 7 days</Menu.Item>
                  <Menu.Item>Last 30 days</Menu.Item>
                  <Menu.Item>Last 90 days</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
            <Text size="sm" c="dimmed" mb="md">
              Your application performance metrics
            </Text>
            <Stack gap="md">
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">CPU Usage</Text>
                  <Text size="sm" fw={500}>
                    45%
                  </Text>
                </Group>
                <Progress value={45} color="blue" />
              </div>
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Memory Usage</Text>
                  <Text size="sm" fw={500}>
                    67%
                  </Text>
                </Group>
                <Progress value={67} color="cyan" />
              </div>
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Storage</Text>
                  <Text size="sm" fw={500}>
                    82%
                  </Text>
                </Group>
                <Progress value={82} color="orange" />
              </div>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="md" radius="md">
            <Title order={3} mb="md">
              Recent Activity
            </Title>
            <Stack gap="md">
              {recentActivity.map((activity) => (
                <Paper key={activity.id} p="xs" withBorder>
                  <Text size="sm" fw={500}>
                    {activity.user}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {activity.action}
                  </Text>
                  <Text size="xs" c="dimmed" mt="xs">
                    {activity.time}
                  </Text>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
```

## Responsive Behavior

The layout automatically adapts to different screen sizes:

- **Mobile (<768px)**: Collapsed sidebar with burger menu
- **Tablet (768px-1024px)**: Collapsible sidebar
- **Desktop (>1024px)**: Full sidebar by default

## Customization Options

### Custom Color Scheme

```typescript
// In DashboardLayout.tsx or App.tsx
import { useMantineColorScheme } from '@mantine/core'

const { colorScheme, toggleColorScheme } = useMantineColorScheme()
```

### Sticky Header

The header is already sticky by default with AppShell.

### Fixed Footer

Add a footer to the AppShell:

```typescript
<AppShell
  footer={{ height: 60 }}
  // ... other props
>
  <AppShell.Footer p="md">
    <Text size="sm" ta="center">
      © 2024 Your Company. All rights reserved.
    </Text>
  </AppShell.Footer>
</AppShell>
```

---

**Next:** Proceed to `04-CORE-FEATURES.md` for implementing SaaS-specific features.
