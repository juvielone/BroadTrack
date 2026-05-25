'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/auth-store'
import { computeHoursFromSessions } from '@/lib/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

type SessionRow = {
  id: string; start_time: string; end_time: string; status: string
  job: { title: string; project: { name: string } | null } | null
}

export default function TechnicianTimePage() {
  const { user } = useAuthStore()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await supabase
        .from('time_sessions')
        .select('id, start_time, end_time, status, job:jobs!job_id(title, project:projects!project_id(name))')
        .eq('technician_id', user.id)
        .eq('status', 'ended')
        .not('end_time', 'is', null)
        .order('start_time', { ascending: false })
      setSessions((data as unknown as SessionRow[]) ?? [])
      setLoading(false)
    }
    load()
  }, [user])

  const totalHours = computeHoursFromSessions(sessions)

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Time Tracking</h1>
        <p className="text-sm text-muted-foreground">Your logged hours</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Recent Entries</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {sessions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No hours logged yet</p>
          ) : (
            sessions.map((s) => {
              const hrs = ((new Date(s.end_time).getTime() - new Date(s.start_time).getTime()) / 3_600_000).toFixed(1)
              return (
                <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{s.job?.title ?? '—'}</p>
                    <p className="text-sm text-muted-foreground">{s.job?.project?.name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{new Date(s.start_time).toLocaleDateString()}</p>
                  </div>
                  <span className="text-lg font-semibold">{hrs}h</span>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
