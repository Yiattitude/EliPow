import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: number | null
  email: string | null
  nickname: string | null
  hasProfile: boolean
  setAuth: (token: string, userId: number, email: string, nickname: string | null, hasProfile: boolean) => void
  setHasProfile: (v: boolean) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      email: null,
      nickname: null,
      hasProfile: false,
      setAuth: (token, userId, email, nickname, hasProfile) =>
        set({ token, userId, email, nickname, hasProfile }),
      setHasProfile: (v) => set({ hasProfile: v }),
      logout: () =>
        set({ token: null, userId: null, email: null, nickname: null, hasProfile: false })
    }),
    { name: 'elipow-auth' }
  )
)
