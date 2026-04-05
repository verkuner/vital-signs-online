import { Container, Title, Text, Stack, Paper, Group, Button } from '@mantine/core'

export function SupportPage() {
  return (
    <Container size="md">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="xs">
            Help & Support
          </Title>
          <Text c="dimmed">Get help with your account, billing, and technical issues.</Text>
        </div>
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text fw={600}>Need assistance?</Text>
              <Text size="sm" c="dimmed">
                Our support team is ready to help.
              </Text>
            </div>
            <Button variant="light">Contact Support</Button>
          </Group>
        </Paper>
      </Stack>
    </Container>
  )
}
