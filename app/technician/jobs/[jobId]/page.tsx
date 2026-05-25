'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { computeJobCompletion, computeHoursFromSessions } from '@/lib/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, MapPin, Clock, Plus, Camera, CheckCircle2 } from 'lucide-react'

type SubStep = { id: string; title: string; completed: boolean }
type Step = {
  id: string; title: string; description: string | null
  completed: boolean; completed_at: string | null; sub_steps: SubStep[]
}
type Session = { id: string; start_time: string | null; end_time: string | null; status: string }
type Job = {
  id: string; title: string; description: string | null; location: string | null; status: string
  procedure_steps: Step[]; time_sessions: Session[]
  project: { id: string; name: string } | null
}

export default function TechnicianJobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('jobs')
        .select(`
          id, title, description, location, status,
          procedure_steps(id, title, description, completed, completed_at, sub_steps(id, title, completed)),
          time_sessions(id, start_time, end_time, status),
          project:projects!project_id(id, name)
        `)
        .eq('id', jobId)
        .single()
      if (!data) { notFound(); return }
      setJob(data as unknown as Job)
      setLoading(false)
    }
    load()
  }, [jobId])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!job) return null

  const completion = computeJobCompletion(job.procedure_steps)
  const completedSteps = job.procedure_steps.filter((s) => s.completed).length
  const totalHours = computeHoursFromSessions(job.time_sessions)

  const recentSessions = job.time_sessions
    .filter((s) => s.start_time && s.end_time)
    .sort((a, b) => new Date(b.end_time!).getTime() - new Date(a.end_time!).getTime())
    .slice(0, 3)

  const statusColors: Record<string, string> = {
    in_progress: 'bg-blue-500/10 text-blue-600',
    on_hold: 'bg-amber-500/10 text-amber-600',
    completed: 'bg-green-500/10 text-green-600',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/technician/projects"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{job.title}</h1>
          <p className="text-sm text-muted-foreground">{job.project?.name}</p>
        </div>
        <Badge variant="secondary" className={statusColors[job.status] ?? ''}>
          {job.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4" />{job.location}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" />{totalHours.toFixed(1)}h logged
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{completedSteps}/{job.procedure_steps.length} steps</span>
          </div>
          <Progress value={completion} className="h-2" />
          <p className="mt-2 text-center text-2xl font-bold">{completion}%</p>
        </CardContent>
      </Card>

      {job.status === 'in_progress' && (
        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="h-12">
            <Link href={`/technician/jobs/${job.id}/add-work`}>
              <Camera className="mr-2 h-4 w-4" />Add Work
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-12">
            <Link href={`/technician/jobs/${job.id}/expense`}>
              <Plus className="mr-2 h-4 w-4" />Add Expense
            </Link>
          </Button>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Procedure Steps</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {job.procedure_steps.map((step, index) => (
            <div key={step.id} className={`rounded-lg border p-3 ${step.completed ? 'bg-green-500/5 border-green-500/20' : ''}`}>
              <div className="flex items-start gap-3">
                {step.completed
                  ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                  : <Checkbox disabled className="mt-0.5" />
                }
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Step {index + 1}</span>
                    <span className="font-medium">{step.title}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
                  <div className="mt-2 space-y-1">
                    {step.sub_steps.map((ss) => (
                      <div key={ss.id} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={ss.completed} disabled className="h-3.5 w-3.5" />
                        <span className={ss.completed ? 'text-muted-foreground line-through' : ''}>{ss.title}</span>
                      </div>
                    ))}
                  </div>
                  {step.completed && step.completed_at && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Completed {new Date(step.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {recentSessions.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Recent Time Entries</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {recentSessions.map((s) => {
              const hrs = ((new Date(s.end_time!).getTime() - new Date(s.start_time!).getTime()) / 3_600_000).toFixed(1)
              return (
                <div key={s.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">{new Date(s.end_time!).toLocaleDateString()}</p>
                  <span className="font-medium">{hrs}h</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
