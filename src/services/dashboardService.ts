import { get } from './apiClient'
import { ActivityItem, StatCardData } from './mockData'

interface VitalReading {
  id: string
  vital_type: string
  value: number
  unit: string
  status: string
  notes?: string
  measured_at: string
  created_at: string
}

interface VitalsSummaryResponse {
  data: {
    vital_type: string
    from: string
    to: string
    overall: { avg: number; min: number; max: number; count: number }
    buckets: { bucket: string; avg: number; min: number; max: number; count: number }[]
  }
}

interface AlertsResponse {
  data: { id: string; vital_type: string; severity: string; value: number; created_at: string }[] | null
  meta: { total: number }
}

export async function getDashboardStats(): Promise<StatCardData[]> {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  try {
    const [latestRes, summaryRes, alertsRes] = await Promise.all([
      get<{ data: VitalReading[] | null }>('/vitals/latest'),
      get<VitalsSummaryResponse>('/vitals/summary', {
        vital_type: 'heart_rate',
        from: thirtyDaysAgo.toISOString(),
        to: now.toISOString(),
        bucket: 'day',
      }),
      get<AlertsResponse>('/alerts', { per_page: '1' }),
    ])

    const latestReadings = latestRes.data ?? []
    const heartRateAvg = summaryRes.data?.overall?.avg ?? 0
    const readingCount = summaryRes.data?.overall?.count ?? 0
    const alertCount = alertsRes.meta?.total ?? 0

    return [
      { title: 'Latest Heart Rate', value: latestReadings.find((r) => r.vital_type === 'heart_rate')?.value?.toString() + ' bpm' || '--', diff: 0 },
      { title: 'Avg Heart Rate (30d)', value: `${Math.round(heartRateAvg)} bpm`, diff: readingCount },
      { title: 'Active Alerts', value: alertCount.toString(), diff: alertCount > 0 ? -alertCount : 0 },
    ]
  } catch {
    return [
      { title: 'Latest Heart Rate', value: '--', diff: 0 },
      { title: 'Avg Heart Rate (30d)', value: '--', diff: 0 },
      { title: 'Active Alerts', value: '--', diff: 0 },
    ]
  }
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  try {
    const res = await get<{ data: VitalReading[] | null }>('/vitals', { limit: '5' })
    if (!res.data) return []
    return res.data.map((v, i) => ({
      id: i + 1,
      user: 'You',
      action: `Recorded ${v.vital_type.replace(/_/g, ' ')}: ${v.value} ${v.unit}`,
      time: formatRelativeTime(v.created_at),
    }))
  } catch {
    return []
  }
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
