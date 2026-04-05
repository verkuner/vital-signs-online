# Setup and Configuration

## Initial Project Setup

### 1. Create Vite Project

```bash
npm create vite@latest my-saas-app -- --template react-ts
cd my-saas-app
```

### 2. Install All Dependencies

```bash
# Mantine core packages
npm install @mantine/core@7.14.3 @mantine/hooks@7.14.3

# Mantine additional packages
npm install @mantine/form@7.14.3 \
            @mantine/notifications@7.14.3 \
            @mantine/modals@7.14.3 \
            @mantine/dropzone@7.14.3 \
            @mantine/dates@7.14.3 \
            @mantine/nprogress@7.14.3 \
            @mantine/spotlight@7.14.3

# Date handling
npm install dayjs

# Routing
npm install react-router-dom@6

# Icons
npm install @tabler/icons-react

# Charts (optional)
npm install @mantine/charts@7.14.3 recharts

# PostCSS
npm install -D postcss postcss-preset-mantine postcss-simple-vars
```

### 3. Configure Vite

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

Update `tsconfig.json` to include path aliases:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. PostCSS Configuration

Create `postcss.config.cjs`:

```javascript
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
```

## Main Application Setup

### 5. Configure main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/nprogress/styles.css'
import '@mantine/spotlight/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 6. Create Theme Configuration

Create `src/theme/theme.ts`:

```typescript
import { createTheme, MantineColorsTuple } from '@mantine/core'

const primaryColor: MantineColorsTuple = [
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

export const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: primaryColor,
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
  },
})
```

### 7. Setup App.tsx

```typescript
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { NavigationProgress } from '@mantine/nprogress'
import { BrowserRouter } from 'react-router-dom'
import { theme } from './theme/theme'
import { AppRoutes } from './routes'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <NavigationProgress />
      <Notifications position="top-right" />
      <ModalsProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
```

### 8. Create Project Structure

```bash
mkdir -p src/{components/{auth,dashboard,layout,common},pages,hooks,contexts,services,utils,styles,types}
```

Create the following files:

**src/routes/index.tsx**:
```typescript
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {/* Add more protected routes here */}
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
```

### 9. Environment Variables

Create `.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=My SaaS App
VITE_APP_VERSION=1.0.0
```

Create `.env.example`:

```env
VITE_API_URL=
VITE_APP_NAME=
VITE_APP_VERSION=
```

Access in code:

```typescript
const API_URL = import.meta.env.VITE_API_URL
const APP_NAME = import.meta.env.VITE_APP_NAME
```

### 10. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

## Verification

Test your setup:

```bash
# Start dev server
npm run dev

# Should open http://localhost:3000
```

You should see a blank page without errors in the console.

## Common Issues

### PostCSS Errors
If you see PostCSS errors, ensure `postcss.config.cjs` is in the root directory.

### Module Resolution
If imports fail, check `tsconfig.json` path aliases and `vite.config.ts` resolve settings.

### CSS Not Loading
Ensure all Mantine CSS imports are in `main.tsx` in the correct order.

---

**Next:** Proceed to `02-AUTHENTICATION-SYSTEM.md` to implement authentication.
