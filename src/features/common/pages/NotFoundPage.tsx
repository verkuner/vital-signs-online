import { Container, Title, Text, Button, Stack } from '@mantine/core'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="md" align="center">
        <Title order={1}>Page not found</Title>
        <Text c="dimmed" ta="center">
          The page you are looking for doesn&apos;t exist or has been moved.
        </Text>
        <Button component={Link} to="/dashboard">
          Back to dashboard
        </Button>
      </Stack>
    </Container>
  )
}
