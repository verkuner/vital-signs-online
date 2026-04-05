# Best Practices & Production Guidelines

## Overview

This guide covers best practices, optimization techniques, and production readiness for your SaaS application.

## Code Organization

### 1. Feature-Based Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   └── users/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── index.ts
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── App.tsx
```

### 2. Barrel Exports

**src/features/auth/index.ts**:

```typescript
export { LoginPage } from './components/LoginPage'
export { RegisterPage } from './components/RegisterPage'
export { useAuth } from './hooks/useAuth'
export type { User, AuthState } from './types'
```

## Performance Optimization

### 3. Code Splitting

**src/routes/index.tsx**:

```typescript
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CustomLoader } from '@/components/common/CustomLoader'

// Lazy load pages
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const UsersPage = lazy(() => import('@/pages/UsersPage'))
const BillingPage = lazy(() => import('@/pages/BillingPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

export function AppRoutes() {
  return (
    <Suspense fallback={<CustomLoader />}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  )
}
```

### 4. Memoization

```typescript
import { useMemo, useCallback, memo } from 'react'

// Memoize expensive computations
function UserList({ users, filter }) {
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [users, filter])

  const handleDelete = useCallback((userId: string) => {
    // Handle delete
  }, [])

  return (
    <div>
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} onDelete={handleDelete} />
      ))}
    </div>
  )
}

// Memoize components
const UserCard = memo(({ user, onDelete }) => {
  return (
    <Card>
      <Text>{user.name}</Text>
      <Button onClick={() => onDelete(user.id)}>Delete</Button>
    </Card>
  )
})
```

### 5. Virtual Scrolling for Large Lists

```bash
npm install @tanstack/react-virtual
```

**src/components/VirtualTable.tsx**:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { Paper, Table } from '@mantine/core'

interface VirtualTableProps {
  data: any[]
  rowHeight: number
}

export function VirtualTable({ data, rowHeight }: VirtualTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
  })

  return (
    <Paper
      ref={parentRef}
      style={{
        height: '600px',
        overflow: 'auto',
      }}
    >
      <Table>
        <Table.Tbody
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <Table.Tr
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Table.Td>{data[virtualRow.index].name}</Table.Td>
              <Table.Td>{data[virtualRow.index].email}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  )
}
```

## Error Handling

### 6. Error Boundary

**src/components/common/ErrorBoundary.tsx**:

```typescript
import React from 'react'
import { Container, Title, Text, Button, Stack } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" style={{ marginTop: '100px' }}>
          <Stack align="center" gap="md">
            <IconAlertCircle size={64} color="red" />
            <Title order={2}>Something went wrong</Title>
            <Text c="dimmed" ta="center">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Text>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </Stack>
        </Container>
      )
    }

    return this.props.children
  }
}
```

Use in App.tsx:

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 7. API Error Handling

**src/services/api.ts**:

```typescript
import { notifications } from '@mantine/notifications'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ApiError(
        error.message || 'Request failed',
        response.status,
        error
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    }
    throw error
  }
}
```

## Type Safety

### 8. Strict TypeScript Configuration

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    // Strict type checking
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    
    // Path aliases
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 9. Shared Type Definitions

**src/types/index.ts**:

```typescript
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user' | 'manager'
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed'
```

## Security Best Practices

### 10. Environment Variables

Never commit sensitive data. Use environment variables:

**.env.example**:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=My SaaS App
VITE_STRIPE_PUBLIC_KEY=
VITE_GOOGLE_CLIENT_ID=
```

**.gitignore**:

```
.env
.env.local
.env.production
```

### 11. Content Security Policy

**index.html**:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https://api.example.com;
  "
/>
```

### 12. Input Sanitization

```typescript
import DOMPurify from 'dompurify'

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href'],
  })
}
```

## Testing

### 13. Unit Testing Setup

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**vite.config.ts**:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

**src/test/setup.ts**:

```typescript
import '@testing-library/jest-dom'
import { MantineProvider } from '@mantine/core'

// Mock Mantine components for testing
export function TestWrapper({ children }: { children: React.ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>
}
```

**Example test**:

```typescript
import { render, screen } from '@testing-library/react'
import { TestWrapper } from '@/test/setup'
import { LoginPage } from '@/pages/LoginPage'

describe('LoginPage', () => {
  it('renders login form', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })
})
```

## Build Optimization

### 14. Vite Build Configuration

**vite.config.ts**:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'mantine': ['@mantine/core', '@mantine/hooks'],
          'icons': ['@tabler/icons-react'],
        },
      },
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
```

### 15. Image Optimization

```bash
npm install -D vite-plugin-image-optimizer
```

```typescript
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
    }),
  ],
})
```

## Deployment

### 16. Docker Setup

**Dockerfile**:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 17. CI/CD Pipeline (GitHub Actions)

**.github/workflows/deploy.yml**:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to production
        run: |
          # Your deployment script
```

## Monitoring & Analytics

### 18. Error Tracking

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

### 19. Performance Monitoring

```typescript
import { useEffect } from 'react'

export function usePageView() {
  useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: window.location.pathname,
      })
    }
  }, [])
}
```

## Accessibility

### 20. ARIA Labels and Keyboard Navigation

```typescript
import { Button, TextInput } from '@mantine/core'

export function AccessibleForm() {
  return (
    <form>
      <TextInput
        label="Email"
        required
        aria-required="true"
        aria-label="Email address"
        id="email-input"
      />
      
      <Button
        type="submit"
        aria-label="Submit form"
      >
        Submit
      </Button>
    </form>
  )
}
```

---

**Congratulations!** You now have a complete guide to building a production-ready SaaS application with React and Mantine UI.
