import { get } from './apiClient'
import { NotificationItem } from './mockData'

interface Alert {
  id: string
  user_id: string
  vital_type: string
  value: number
  threshold_breached: string
  threshold_value: number
  severity: string
  acknowledged: boolean
  acknowledged_at?: string
  created_at: string
}

interface AlertsResponse {
  data: Alert[] | null
  meta: { total: number; page: number; per_page: number }
}

function severityToType(severity: string): NotificationItem['type'] {
  if (severity === 'critical') return 'error'
  if (severity === 'high') return 'warning'
  if (severity === 'medium') return 'warning'
  return 'info'
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export async function getNotifications(): Promise<NotificationItem[]> {
  try {
    const res = await get<AlertsResponse>('/alerts', { per_page: '20' })
    if (!res.data) return []
    return res.data.map((alert) => ({
      id: alert.id,
      title: `${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Alert: ${alert.vital_type.replace(/_/g, ' ')}`,
      message: `${alert.vital_type.replace(/_/g, ' ')} reading of ${alert.value} breached ${alert.threshold_breached} threshold (${alert.threshold_value})`,
      type: severityToType(alert.severity),
      read: alert.acknowledged,
      timestamp: formatRelativeTime(alert.created_at),
    }))
  } catch {
    return []
  }
}
