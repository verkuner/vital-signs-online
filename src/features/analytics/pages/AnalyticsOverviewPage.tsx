import { Container, Title, Text, Stack, Paper, SimpleGrid } from '@mantine/core'

export function AnalyticsOverviewPage() {
  return (
    <Container size="lg">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="xs">
            Analytics Overview
          </Title>
          <Text c="dimmed">High-level performance insights across your product.</Text>
        </div>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {['Active users', 'Retention', 'Engagement'].map((label) => (
            <Paper key={label} withBorder p="md" radius="md">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                {label}
              </Text>
              <Title order={3} mt="xs">
                0.0%
              </Title>
            </Paper>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
