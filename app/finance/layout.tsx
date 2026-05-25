'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth-guard'
import { useAuthStore } from '@/lib/auth-store'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Receipt,
  FileBarChart,
  LogOut,
  Radio,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/finance/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/finance/expenses', label: 'Expenses', icon: Receipt },
  { href: '/finance/reports', label: 'Reports', icon: FileBarChart },
]

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    logout()
    router.push('/login')
  }

  return (
    <AuthGuard allowedRoles={['finance']}>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-card">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Radio className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">BroadTrack</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">Finance</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-64 flex-1">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
