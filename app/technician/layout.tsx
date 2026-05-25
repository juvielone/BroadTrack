'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth-guard'
import { useAuthStore } from '@/lib/auth-store'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { FolderKanban, Clock, Receipt, LogOut, Radio, User } from 'lucide-react'

const navItems = [
  { href: '/technician/projects', label: 'My Jobs', icon: FolderKanban },
  { href: '/technician/time', label: 'Time', icon: Clock },
  { href: '/technician/expenses', label: 'Expenses', icon: Receipt },
]

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    logout()
    router.push('/login')
  }

  return (
    <AuthGuard allowedRoles={['technician']}>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b bg-card">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Radio className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">BroadTrack</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground hover:bg-muted"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="hidden sm:inline">{user?.name}</span>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 pb-20">{children}</main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card">
          <div className="flex h-16 items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-2',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </AuthGuard>
  )
}
