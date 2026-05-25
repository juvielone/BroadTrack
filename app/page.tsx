'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore, getRoleRedirectPath } from '@/lib/auth-store'
import { type AppUser } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user, login } = useAuthStore()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session && !isAuthenticated) {
        const { data: profile } = await supabase
          .from('users')
          .select('id, email, name, role, avatar_url')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          login(profile as AppUser)
          router.push(getRoleRedirectPath(profile.role))
          return
        }
      }

      if (isAuthenticated && user) {
        router.push(getRoleRedirectPath(user.role))
      } else {
        router.push('/login')
      }
    }

    checkSession()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
