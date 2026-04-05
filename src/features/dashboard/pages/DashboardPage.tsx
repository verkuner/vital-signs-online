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
import { useEffect, useMemo, useState } from 'react'
import {
  IconHeartbeat,
  IconChartLine,
  IconBell,
  IconArrowUpRight,
  IconArrowDownRight,
  IconDots,
} from '@tabler/icons-react'
import { getDashboardStats, getRecentActivity } from '../../../services/dashboardService'
import type { ActivityItem, StatCardData } from '../../../services/mockData'

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
          {diff > 0 ? '+' : ''}
          {diff}%
        </Text>
        <DiffIcon size={16} color={`var(--mantine-color-${color}-6)`} />
        <Text size="xs" c="dimmed">
          vs last month
        </Text>
      </Group>
    </Card>
  )
}

export function DashboardPage() {
  const [stats, setStats] = useState<StatCardData[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const [statsData, activityData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
      ])
      if (mounted) {
        setStats(statsData)
        setRecentActivity(activityData)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const iconMap = useMemo(
    () => ({
      'Latest Heart Rate': <IconHeartbeat size={24} />,
      'Avg Heart Rate (30d)': <IconChartLine size={24} />,
      'Active Alerts': <IconBell size={24} />,
    }),
    [],
  )

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
          <StatCard
            key={stat.title}
            {...stat}
            icon={iconMap[stat.title as keyof typeof iconMap] ?? <IconChartLine size={24} />}
          />
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
