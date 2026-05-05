'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type User, type UserRole } from '@/lib/mockData'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'broadtrack-auth',
    }
  )
)

export function getRoleRedirectPath(role: UserRole): string {
  switch (role) {
    case 'pm':
      return '/pm/dashboard'
    case 'technician':
      return '/technician/projects'
    case 'finance':
      return '/finance/dashboard'
    default:
      return '/login'
  }
}
