import { Container, Title, Text, Button, Stack } from '@mantine/core'
import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="md" align="center">
        <Title order={1}>Access denied</Title>
        <Text c="dimmed" ta="center">
          You don&apos;t have permission to view this page.
        </Text>
        <Button component={Link} to="/dashboard">
          Back to dashboard
        </Button>
      </Stack>
    </Container>
  )
}
