import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

let csrfInitialized = false

export async function ensureCsrfCookie(): Promise<void> {
  if (csrfInitialized) {
    return
  }

  await api.get('/sanctum/csrf-cookie')
  csrfInitialized = true
}

export function resetCsrfCookie(): void {
  csrfInitialized = false
}

export default api
