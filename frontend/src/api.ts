import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
})

export interface AuthResponse {
  id: number
  email: string
  nickname: string | null
  role: string
  token: string
}

export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export function register(email: string, password: string, nickname?: string) {
  return api.post<ApiResult<AuthResponse>>('/api/auth/register', { email, password, nickname })
}

export function login(email: string, password: string) {
  return api.post<ApiResult<AuthResponse>>('/api/auth/login', { email, password })
}

export default api
