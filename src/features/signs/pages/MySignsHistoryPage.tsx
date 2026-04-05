import { useEffect, useState, useTransition } from 'react'
import {
  Badge,
  Button,
  Container,
  Group,
  Menu,
  Paper,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { IconDots, IconEyeOff, IconRefresh, IconAlertTriangle, IconClipboard } from '@tabler/icons-react'
import { getMySignsHistory } from '../../../services/signsService'
import { SignsHistoryItem } from '../../../services/mockData'

const statusColor: Record<SignsHistoryItem['status'], string> = {
  normal: 'green',
  warning: 'yellow',
  critical: 'red',
  suppressed: 'gray',
}

export function MySignsHistoryPage() {
  const [rows, setRows] = useState<SignsHistoryItem[]>([])
  const [isPending, startTransition] = useTransition()

  const loadData = async () => {
    const data = await getMySignsHistory()
    startTransition(() => {
      setRows(data)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSuppress = (id: string) => {
    startTransition(() => {
      setRows((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'suppressed' } : item,
        ),
      )
    })
  }

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1}>My Signs History</Title>
          <Text c="dimmed">Review and manage your recorded vital signs.</Text>
        </div>
        <Button leftSection={<IconRefresh size={16} />} variant="light" onClick={loadData}>
          Refresh
        </Button>
      </Group>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="md">
          <Text fw={600}>Recent entries</Text>
          {isPending && (
            <Badge variant="light" color="blue">
              Loading...
            </Badge>
          )}
        </Group>

        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Time</Table.Th>
              <Table.Th>Pulse Rate</Table.Th>
              <Table.Th>Temperature</Table.Th>
              <Table.Th>Respiration Rate</Table.Th>
              <Table.Th>Blood Pressure</Table.Th>
              <Table.Th>Weight</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.date}</Table.Td>
                <Table.Td>{row.time}</Table.Td>
                <Table.Td>{row.pulseRate} bpm</Table.Td>
                <Table.Td>{row.temperature}°F</Table.Td>
                <Table.Td>{row.respirationRate} /min</Table.Td>
                <Table.Td>{row.bloodPressure}</Table.Td>
                <Table.Td>{row.weight} lbs</Table.Td>
                <Table.Td>{row.location}</Table.Td>
                <Table.Td>
                  <Badge color={statusColor[row.status]} variant="light">
                    {row.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <Button variant="subtle" size="xs" leftSection={<IconDots size={14} />}>
                        Actions
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconClipboard size={16} />}>View details</Menu.Item>
                      <Menu.Item leftSection={<IconAlertTriangle size={16} />}>Flag for review</Menu.Item>
                      {row.status === 'warning' && (
                        <Menu.Item
                          leftSection={<IconEyeOff size={16} />}
                          onClick={() => handleSuppress(row.id)}
                        >
                          Suppress warning
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  )
}
