import { Loader, Stack, Text } from '@mantine/core'

export function CustomLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <Stack align="center" justify="center" style={{ minHeight: 200 }}>
      <Loader size="lg" type="dots" />
      <Text size="sm" c="dimmed">
        {message}
      </Text>
    </Stack>
  )
}
