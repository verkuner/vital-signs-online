import { Container, Title, Text, Stack, Paper, Group, Badge } from '@mantine/core'

export function AnalyticsReportsPage() {
  const reports = [
    { id: 'RPT-001', name: 'Weekly Activation', status: 'Ready' },
    { id: 'RPT-002', name: 'Cohort Retention', status: 'Queued' },
    { id: 'RPT-003', name: 'Revenue by Plan', status: 'Ready' },
  ]

  return (
    <Container size="lg">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="xs">
            Analytics Reports
          </Title>
          <Text c="dimmed">Export and share your key analytics reports.</Text>
        </div>

        <Stack gap="md">
          {reports.map((report) => (
            <Paper key={report.id} withBorder p="md" radius="md">
              <Group justify="space-between">
                <div>
                  <Text fw={600}>{report.name}</Text>
                  <Text size="xs" c="dimmed">
                    {report.id}
                  </Text>
                </div>
                <Badge variant="light" color={report.status === 'Ready' ? 'green' : 'yellow'}>
                  {report.status}
                </Badge>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
