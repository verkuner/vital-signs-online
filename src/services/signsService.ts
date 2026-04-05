import { get } from './apiClient'
import { SignsHistoryItem } from './mockData'

interface VitalReading {
  id: string
  user_id: string
  vital_type: string
  value: number
  unit: string
  status: string
  device_id?: string
  notes?: string
  measured_at: string
  created_at: string
}

interface VitalsListResponse {
  data: VitalReading[] | null
  meta: { limit: number; has_more: boolean; next_cursor?: string }
}

function mapStatus(status: string): SignsHistoryItem['status'] {
  if (status === 'normal' || status === 'warning' || status === 'critical' || status === 'suppressed') {
    return status
  }
  return 'normal'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-CA')
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export async function getMySignsHistory(): Promise<SignsHistoryItem[]> {
  const res = await get<VitalsListResponse>('/vitals', { limit: '50' })
  if (!res.data || res.data.length === 0) return []

  const grouped = new Map<string, Partial<SignsHistoryItem> & { id: string; date: string; time: string; status: SignsHistoryItem['status'] }>()

  for (const v of res.data) {
    const key = `${formatDate(v.measured_at)}_${formatTime(v.measured_at)}`
    const existing = grouped.get(key) ?? {
      id: v.id,
      date: formatDate(v.measured_at),
      time: formatTime(v.measured_at),
      pulseRate: 0,
      temperature: 0,
      respirationRate: 0,
      bloodPressure: '--',
      weight: 0,
      location: v.notes ?? '--',
      status: mapStatus(v.status) as SignsHistoryItem['status'],
    }

    if (v.vital_type === 'heart_rate') existing.pulseRate = v.value
    else if (v.vital_type === 'temperature') existing.temperature = v.value
    else if (v.vital_type === 'respiration_rate') existing.respirationRate = v.value
    else if (v.vital_type === 'blood_pressure') existing.bloodPressure = `${v.value}`
    else if (v.vital_type === 'weight') existing.weight = v.value

    if (v.status === 'critical' || (v.status === 'warning' && existing.status !== 'critical')) {
      existing.status = mapStatus(v.status)
    }

    grouped.set(key, existing)
  }

  return [...grouped.values()].map((row) => ({
    id: row.id,
    date: row.date,
    time: row.time,
    pulseRate: row.pulseRate ?? 0,
    temperature: row.temperature ?? 0,
    respirationRate: row.respirationRate ?? 0,
    bloodPressure: row.bloodPressure ?? '--',
    weight: row.weight ?? 0,
    location: row.location ?? '--',
    status: row.status,
  }))
}

export async function getLatestVitals(): Promise<VitalReading[]> {
  const res = await get<{ data: VitalReading[] | null }>('/vitals/latest')
  return res.data ?? []
}

export type { VitalReading }
