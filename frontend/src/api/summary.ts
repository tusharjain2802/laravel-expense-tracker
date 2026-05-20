import api from './client'
import type { MonthlySummary } from '../types'

export async function fetchMonthlySummary(month?: string): Promise<MonthlySummary> {
  const { data } = await api.get<MonthlySummary>('/api/summary/monthly', {
    params: month ? { month } : undefined,
  })
  return data
}
