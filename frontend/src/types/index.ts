export interface User {
  id: number
  name: string
  email: string
}

export interface Category {
  id: number
  name: string
  color: string
  created_at?: string
  updated_at?: string
}

export interface Expense {
  id: number
  category_id: number
  category?: Category
  amount: string
  spent_on: string
  note: string | null
  created_at?: string
  updated_at?: string
}

export interface MonthlySummary {
  month: string
  total: number
  by_category: Array<{
    category_id: number
    category_name: string
    color: string
    total: string
  }>
}

export interface AuthResponse {
  user: User
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
