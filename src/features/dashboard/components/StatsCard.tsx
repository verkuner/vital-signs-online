import { Card, Text, Group, ThemeIcon } from '@mantine/core'
import classes from './StatsCard.module.css'

interface StatsCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card className={classes.card} withBorder p="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text className={classes.value}>{value}</Text>
        </div>
        <ThemeIcon className={classes.icon} size="xl" radius="md">
          {icon}
        </ThemeIcon>
      </Group>
    </Card>
  )
}
