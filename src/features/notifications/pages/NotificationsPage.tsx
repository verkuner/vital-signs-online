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
import { useEffect, useState } from 'react'
import { getNotifications } from '../../../services/notificationsService'
import { NotificationItem } from '../../../services/mockData'

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const data = await getNotifications()
      if (mounted) {
        setNotifications(data)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

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
