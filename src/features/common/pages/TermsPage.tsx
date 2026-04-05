import { Container, Title, Text, Stack, Paper } from '@mantine/core'

export function TermsPage() {
  return (
    <Container size="md">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="xs">
            Terms and Conditions
          </Title>
          <Text c="dimmed">A short placeholder for your legal terms.</Text>
        </div>
        <Paper withBorder p="md" radius="md">
          <Text size="sm" c="dimmed">
            Add your terms and conditions content here.
          </Text>
        </Paper>
      </Stack>
    </Container>
  )
}
