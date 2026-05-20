import api from './client'
import type { Expense } from '../types'

export async function fetchExpenses(params?: {
  month?: string
  category_id?: number
}): Promise<Expense[]> {
  const { data } = await api.get<{ data: Expense[] }>('/api/expenses', { params })
  return data.data
}

export async function createExpense(payload: {
  category_id: number
  amount: number
  spent_on: string
  note?: string
}): Promise<Expense> {
  const { data } = await api.post<{ data: Expense }>('/api/expenses', payload)
  return data.data
}

export async function deleteExpense(id: number): Promise<void> {
  await api.delete(`/api/expenses/${id}`)
}
