import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { DashboardLayout } from '../features/layout/components/DashboardLayout'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { UsersPage } from '../features/users/pages/UsersPage'
import { BillingPage } from '../features/billing/pages/BillingPage'
import { SettingsPage } from '../features/settings/pages/SettingsPage'
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage'
import { AnalyticsOverviewPage } from '../features/analytics/pages/AnalyticsOverviewPage'
import { AnalyticsReportsPage } from '../features/analytics/pages/AnalyticsReportsPage'
import { ProfilePage } from '../features/profile/pages/ProfilePage'
import { SupportPage } from '../features/support/pages/SupportPage'
import { UnauthorizedPage } from '../features/common/pages/UnauthorizedPage'
import { NotFoundPage } from '../features/common/pages/NotFoundPage'
import { TermsPage } from '../features/common/pages/TermsPage'
import { MySignsHistoryPage } from '../features/signs/pages/MySignsHistoryPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics/overview" element={<AnalyticsOverviewPage />} />
        <Route path="/analytics/reports" element={<AnalyticsReportsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/billing/subscriptions" element={<BillingPage />} />
        <Route path="/billing/invoices" element={<BillingPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/my-signs-history" element={<MySignsHistoryPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
