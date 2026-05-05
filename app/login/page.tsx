'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authenticateUser } from '@/lib/mockData'
import { useAuthStore, getRoleRedirectPath } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Radio } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = authenticateUser(email, password)

    if (user) {
      login(user)
      router.push(getRoleRedirectPath(user.role))
    } else {
      setError('Invalid email or password')
      setIsLoading(false)
    }
  }

  const quickLogin = async (email: string) => {
    setEmail(email)
    setPassword('password123')
    setError('')
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 300))

    const user = authenticateUser(email, 'password123')
    if (user) {
      login(user)
      router.push(getRoleRedirectPath(user.role))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Radio className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">BroadTrack</CardTitle>
          <CardDescription>Field Technician Job Management</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@broadtrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 border-t pt-6">
            <p className="mb-3 text-center text-sm text-muted-foreground">
              Quick login for demo:
            </p>
            <div className="grid gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => quickLogin('sarah.pm@broadtrack.com')}
              >
                <span className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                Project Manager (Sarah)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => quickLogin('mike.tech@broadtrack.com')}
              >
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                Technician (Mike)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => quickLogin('lisa.finance@broadtrack.com')}
              >
                <span className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
                Finance (Lisa)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
