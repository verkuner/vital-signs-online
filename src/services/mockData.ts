export interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  avatar?: string
  joinedAt: string
}

export interface Plan {
  id: string
  name: string
  price: number
  interval: string
  features: string[]
  popular?: boolean
}

export interface Invoice {
  id: string
  date: string
  amount: string
  status: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: string
}

export interface StatCardData {
  title: string
  value: string
  diff: number
}

export interface ActivityItem {
  id: number
  user: string
  action: string
  time: string
}

export interface SignsHistoryItem {
  id: string
  date: string
  time: string
  pulseRate: number
  temperature: number
  respirationRate: number
  bloodPressure: string
  weight: number
  location: string
  status: 'normal' | 'warning' | 'critical' | 'suppressed'
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
    joinedAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Taylor Green',
    email: 'taylor@example.com',
    role: 'Manager',
    status: 'inactive',
    joinedAt: '2023-12-02',
  },
]

export const mockPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    interval: 'month',
    features: ['Up to 5 users', '10 GB storage', 'Basic support', 'Core features'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 29,
    interval: 'month',
    popular: true,
    features: [
      'Up to 20 users',
      '100 GB storage',
      'Priority support',
      'Advanced features',
      'API access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited users',
      'Unlimited storage',
      '24/7 dedicated support',
      'All features',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
]

export const mockInvoices: Invoice[] = [
  { id: 'INV-001', date: '2024-02-01', amount: '$29.00', status: 'Paid' },
  { id: 'INV-002', date: '2024-01-01', amount: '$29.00', status: 'Paid' },
  { id: 'INV-003', date: '2023-12-01', amount: '$29.00', status: 'Paid' },
]

export const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Welcome to the platform!',
    message: 'Thank you for joining us. Get started by exploring the dashboard.',
    type: 'success',
    read: false,
    timestamp: '2 minutes ago',
  },
  {
    id: '2',
    title: 'Payment received',
    message: 'Your payment of $29.00 has been processed successfully.',
    type: 'success',
    read: true,
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    title: 'New report ready',
    message: 'Your weekly activation report is ready to view.',
    type: 'info',
    read: true,
    timestamp: '3 hours ago',
  },
]

export const mockStats: StatCardData[] = [
  { title: 'Total Users', value: '13,456', diff: 12 },
  { title: 'Revenue', value: '$45,231', diff: 8 },
  { title: 'Conversion', value: '3.24%', diff: -2 },
]

export const mockActivity: ActivityItem[] = [
  { id: 1, user: 'John Doe', action: 'Created account', time: '2 minutes ago' },
  { id: 2, user: 'Jane Smith', action: 'Upgraded plan', time: '15 minutes ago' },
  { id: 3, user: 'Bob Johnson', action: 'Submitted ticket', time: '1 hour ago' },
]

export const mockSignsHistory: SignsHistoryItem[] = [
  {
    id: 's1',
    date: '2026-02-04',
    time: '08:15 AM',
    pulseRate: 72,
    temperature: 98.4,
    respirationRate: 16,
    bloodPressure: '118/76',
    weight: 172.4,
    location: 'Home',
    status: 'normal',
  },
  {
    id: 's2',
    date: '2026-02-03',
    time: '07:55 AM',
    pulseRate: 96,
    temperature: 99.1,
    respirationRate: 21,
    bloodPressure: '132/86',
    weight: 173.2,
    location: 'Clinic',
    status: 'warning',
  },
  {
    id: 's3',
    date: '2026-02-02',
    time: '09:05 AM',
    pulseRate: 88,
    temperature: 98.7,
    respirationRate: 18,
    bloodPressure: '126/80',
    weight: 172.9,
    location: 'Home',
    status: 'normal',
  },
  {
    id: 's4',
    date: '2026-02-01',
    time: '08:40 AM',
    pulseRate: 110,
    temperature: 100.2,
    respirationRate: 24,
    bloodPressure: '145/92',
    weight: 174.0,
    location: 'Urgent care',
    status: 'critical',
  },
  {
    id: 's5',
    date: '2026-01-31',
    time: '07:50 AM',
    pulseRate: 90,
    temperature: 98.9,
    respirationRate: 19,
    bloodPressure: '124/82',
    weight: 173.5,
    location: 'Home',
    status: 'suppressed',
  },
]
