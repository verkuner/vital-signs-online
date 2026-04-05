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
