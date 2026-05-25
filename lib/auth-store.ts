'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type AppUser, type UserRole } from '@/lib/types'

interface AuthState {
  user: AppUser | null
  isAuthenticated: boolean
  login: (user: AppUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user: AppUser) => set({ user, isAuthenticated: true }),
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
    case 'admin':
      return '/pm/dashboard'
    case 'technician':
      return '/technician/projects'
    case 'finance':
      return '/finance/dashboard'
    default:
      return '/login'
  }
}
