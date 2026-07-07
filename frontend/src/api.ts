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
  hasProfile: boolean
}

export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export interface KnowledgePoint {
  id: number
  name: string
  description: string
  parentId: number | null
  estimatedHours?: number | null
}

// 认证
export function register(email: string, password: string, nickname?: string) {
  return api.post<ApiResult<AuthResponse>>('/api/auth/register', { email, password, nickname })
}

export function login(email: string, password: string) {
  return api.post<ApiResult<AuthResponse>>('/api/auth/login', { email, password })
}

export interface UserProfileData {
  grade: string | null
  target: string | null
  abilityLevel: string | null
  weakKnowledge: string | null
}

export interface UserInfo {
  id: number
  email: string
  nickname: string | null
  role: string
  hasProfile: boolean
  profile?: UserProfileData
}

// 用户
export function getUser(id: number) {
  return api.get<ApiResult<UserInfo>>(`/api/users/${id}`)
}

// 知识点
export function getKnowledgePoints() {
  return api.get<ApiResult<KnowledgePoint[]>>('/api/knowledge-points')
}

// 画像
export function saveProfile(id: number, data: {
  grade: string; target: string; abilityLevel: string; weakKnowledge: string[]
}) {
  return api.put<ApiResult<unknown>>(`/api/users/${id}/profile`, data)
}

// 周计划
export interface PlanItem {
  knowledgePointId: number
  name: string
  description: string
  estimatedMinutes: number
  reason: string
  status: string
}

export interface PlanResult {
  items: PlanItem[]
  totalMinutes: number
  timeBudget?: number
}

export function generatePlan(userId: number, timeBudget: number) {
  return api.post<ApiResult<PlanResult>>(`/api/study-plan/generate?userId=${userId}&timeBudget=${timeBudget}`)
}

export function getCurrentPlan(userId: number) {
  return api.get<ApiResult<PlanResult>>(`/api/study-plan/current?userId=${userId}`)
}

export default api
