import { mockDelay } from './mockClient'
import { Plan, Invoice, mockPlans, mockInvoices } from './mockData'

export async function getPlans(): Promise<Plan[]> {
  await mockDelay()
  return [...mockPlans]
}

export async function getInvoices(): Promise<Invoice[]> {
  await mockDelay()
  return [...mockInvoices]
}
