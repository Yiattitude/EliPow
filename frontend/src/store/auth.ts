import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  email: string | null
  nickname: string | null
  setAuth: (token: string, email: string, nickname: string | null) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      nickname: null,
      setAuth: (token, email, nickname) => set({ token, email, nickname }),
      logout: () => set({ token: null, email: null, nickname: null })
    }),
    { name: 'elipow-auth' }
  )
)
