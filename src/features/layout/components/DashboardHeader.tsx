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
import { useAuth } from '../../../contexts/AuthContext'
import { notifications } from '@mantine/notifications'
import { ColorSchemeToggle } from '../../common/components/ColorSchemeToggle'

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
            {import.meta.env.VITE_APP_NAME || 'Vital Signs Online'}
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

          <ColorSchemeToggle />

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
              <Menu.Item leftSection={<IconUser size={16} />} onClick={() => navigate('/profile')}>
                Profile
              </Menu.Item>
              <Menu.Item
                leftSection={<IconSettings size={16} />}
                onClick={() => navigate('/settings')}
              >
                Settings
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  )
}
