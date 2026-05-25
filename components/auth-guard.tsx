'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore, getRoleRedirectPath } from '@/lib/auth-store'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: ('pm' | 'technician' | 'finance' | 'admin')[]
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (pathname === '/login') return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push(getRoleRedirectPath(user.role))
    }
  }, [isAuthenticated, user, router, pathname, allowedRoles])

  if (!isAuthenticated && pathname !== '/login') {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
