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
  IconHeartbeat,
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
    label: 'My Signs History',
    icon: <IconHeartbeat size={20} />,
    link: '/my-signs-history',
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
              <MantineNavLink label={subItem.label} leftSection={subItem.icon} active={isActive} />
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
