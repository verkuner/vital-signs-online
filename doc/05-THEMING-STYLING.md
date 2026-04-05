# Theming & Styling

## Overview

This guide covers customizing your application's appearance using Mantine's powerful theming system.

## Theme Configuration

### 1. Advanced Theme Setup

**src/theme/theme.ts**:

```typescript
import { createTheme, MantineColorsTuple, rem } from '@mantine/core'

// Custom color palettes
const brandColor: MantineColorsTuple = [
  '#e5f4ff',
  '#cde2ff',
  '#9bc2ff',
  '#64a0ff',
  '#3984fe',
  '#1d72fe',
  '#0969ff',
  '#0058e4',
  '#004ecc',
  '#0043b5'
]

const successColor: MantineColorsTuple = [
  '#e7f5ee',
  '#c3e6cb',
  '#a3d9a5',
  '#7bc77f',
  '#53b259',
  '#3d9c43',
  '#2f7d32',
  '#246127',
  '#1a461d',
  '#0f2b12'
]

export const theme = createTheme({
  // Color scheme
  primaryColor: 'brand',
  colors: {
    brand: brandColor,
    success: successColor,
  },

  // Typography
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(36), lineHeight: '1.2' },
      h2: { fontSize: rem(30), lineHeight: '1.3' },
      h3: { fontSize: rem(24), lineHeight: '1.4' },
      h4: { fontSize: rem(20), lineHeight: '1.5' },
      h5: { fontSize: rem(18), lineHeight: '1.5' },
      h6: { fontSize: rem(16), lineHeight: '1.5' },
    },
  },

  // Spacing
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },

  // Border radius
  radius: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
  },

  defaultRadius: 'md',

  // Shadows
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px',
    md: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
    lg: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 28px 23px -7px, rgba(0, 0, 0, 0.04) 0px 12px 12px -7px',
    xl: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px',
  },

  // Component defaults
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
        },
      },
    },
    
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
        withBorder: true,
      },
    },
    
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    
    Modal: {
      defaultProps: {
        radius: 'md',
        overlayProps: {
          backgroundOpacity: 0.55,
          blur: 3,
        },
      },
    },
    
    Badge: {
      defaultProps: {
        radius: 'sm',
      },
    },
  },

  // Breakpoints
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },
})
```

## Color Scheme Toggle

### 2. Dark Mode Implementation

**src/components/common/ColorSchemeToggle.tsx**:

```typescript
import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="subtle"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
    </ActionIcon>
  )
}
```

Add to your header:

```typescript
// In DashboardHeader.tsx
import { ColorSchemeToggle } from '@/components/common/ColorSchemeToggle'

// Inside the header component
<Group>
  <ColorSchemeToggle />
  {/* ... other header items */}
</Group>
```

## Custom CSS Modules

### 3. Component-Specific Styles

**src/components/dashboard/StatsCard.module.css**:

```css
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--mantine-shadow-md);
}

.icon {
  background: linear-gradient(135deg, var(--mantine-primary-color-5), var(--mantine-primary-color-7));
  color: white;
}

.value {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--mantine-primary-color-5), var(--mantine-primary-color-7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**src/components/dashboard/StatsCard.tsx**:

```typescript
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
```

## Global Styles

### 4. Custom Global Styles

**src/styles/global.css**:

```css
:root {
  --header-height: 60px;
  --navbar-width: 300px;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--mantine-color-gray-1);
}

::-webkit-scrollbar-thumb {
  background: var(--mantine-color-gray-4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--mantine-color-gray-5);
}

/* Dark mode scrollbar */
[data-mantine-color-scheme='dark'] ::-webkit-scrollbar-track {
  background: var(--mantine-color-dark-7);
}

[data-mantine-color-scheme='dark'] ::-webkit-scrollbar-thumb {
  background: var(--mantine-color-dark-4);
}

[data-mantine-color-scheme='dark'] ::-webkit-scrollbar-thumb:hover {
  background: var(--mantine-color-dark-3);
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, var(--mantine-primary-color-5), var(--mantine-primary-color-7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glass morphism effect */
.glass-morphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

[data-mantine-color-scheme='dark'] .glass-morphism {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

Import in `main.tsx`:

```typescript
import './styles/global.css'
```

## Custom Hooks for Styling

### 5. Responsive Styling Hook

**src/hooks/useResponsive.ts**:

```typescript
import { useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

export function useResponsive() {
  const theme = useMantineTheme()
  
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const isTablet = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.md})`
  )
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`)

  return { isMobile, isTablet, isDesktop }
}
```

Usage:

```typescript
import { useResponsive } from '@/hooks/useResponsive'

export function MyComponent() {
  const { isMobile, isDesktop } = useResponsive()

  return (
    <div>
      {isMobile && <p>Mobile view</p>}
      {isDesktop && <p>Desktop view</p>}
    </div>
  )
}
```

## Gradient Utilities

### 6. Gradient Helper

**src/utils/gradients.ts**:

```typescript
export const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  danger: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  dark: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
  ocean: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)',
  sunset: 'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)',
}

export function getGradient(name: keyof typeof gradients) {
  return gradients[name]
}
```

## Custom Component Variants

### 7. Button Variants

**src/components/common/GradientButton.tsx**:

```typescript
import { Button, ButtonProps } from '@mantine/core'
import { gradients } from '@/utils/gradients'

interface GradientButtonProps extends ButtonProps {
  gradient?: keyof typeof gradients
}

export function GradientButton({ 
  gradient = 'primary', 
  children,
  ...props 
}: GradientButtonProps) {
  return (
    <Button
      {...props}
      styles={{
        root: {
          background: gradients[gradient],
          border: 0,
          color: 'white',
          '&:hover': {
            opacity: 0.9,
          },
        },
      }}
    >
      {children}
    </Button>
  )
}
```

## CSS-in-JS with Mantine

### 8. Dynamic Styles

```typescript
import { Button } from '@mantine/core'

export function DynamicButton() {
  return (
    <Button
      styles={(theme) => ({
        root: {
          background: theme.colors.blue[6],
          '&:hover': {
            background: theme.colors.blue[7],
          },
        },
      })}
    >
      Dynamic Button
    </Button>
  )
}
```

## Theme Override Hook

### 9. Per-Component Theme Override

```typescript
import { MantineProvider, useMantineTheme } from '@mantine/core'

export function ThemedSection({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme()
  
  return (
    <MantineProvider
      theme={{
        ...theme,
        primaryColor: 'teal',
        components: {
          Button: {
            defaultProps: {
              color: 'teal',
            },
          },
        },
      }}
    >
      {children}
    </MantineProvider>
  )
}
```

## Loading States

### 10. Custom Loader

**src/components/common/CustomLoader.tsx**:

```typescript
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
```

---

**Next:** Proceed to `06-BEST-PRACTICES.md` for production guidelines.
