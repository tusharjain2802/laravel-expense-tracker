import api, { ensureCsrfCookie } from './client'
import type { AuthResponse, User } from '../types'

export async function register(
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
): Promise<AuthResponse> {
  await ensureCsrfCookie()
  const { data } = await api.post<AuthResponse>('/api/register', {
    name,
    email,
    password,
    password_confirmation,
  })
  return data
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  await ensureCsrfCookie()
  const { data } = await api.post<AuthResponse>('/api/login', { email, password })
  return data
}

export async function logout(): Promise<void> {
  await api.post('/api/logout')
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/api/me')
  return data.user
}
