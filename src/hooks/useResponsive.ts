import { useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

export function useResponsive() {
  const theme = useMantineTheme()

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const isTablet = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.md})`,
  )
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`)

  return { isMobile, isTablet, isDesktop }
}
