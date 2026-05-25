'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/auth-store'
import { computeJobCompletion, computeHoursFromSessions, computeProjectCompletion } from '@/lib/queries'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { MapPin, ChevronRight, Play, Clock } from 'lucide-react'

type JobRow = {
  id: string; title: string; location: string | null; status: string; project_id: string
  procedure_steps: { id: string; completed: boolean }[]
  time_sessions: { start_time: string | null; end_time: string | null; status: string }[]
  projects: { id: string; name: string; customer: string } | null
}
type ProjectGroup = { id: string; name: string; customer: string; jobs: JobRow[] }

export default function TechnicianProjectsPage() {
  const { user } = useAuthStore()
  const [groups, setGroups] = useState<ProjectGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'on_hold' | 'completed'>('all')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await supabase
        .from('jobs')
        .select(`
          id, title, location, status, project_id,
          procedure_steps(id, completed),
          time_sessions(start_time, end_time, status),
          projects(id, name, customer),
          job_assignments!inner(user_id)
        `)
        .eq('job_assignments.user_id', user.id)
        .order('created_at', { ascending: false })

      const jobs = (data as unknown as JobRow[]) ?? []
      const map = new Map<string, ProjectGroup>()
      jobs.forEach((job) => {
        if (!job.projects) return
        if (!map.has(job.project_id)) map.set(job.project_id, { ...job.projects, jobs: [] })
        map.get(job.project_id)!.jobs.push(job)
      })
      setGroups([...map.values()])
      setLoading(false)
    }
    load()
  }, [user])

  const allJobs = groups.flatMap((g) => g.jobs)
  const activeJob = allJobs.find((j) => j.status === 'in_progress')

  const statusColors: Record<string, string> = {
    in_progress: 'border-l-blue-500',
    on_hold: 'border-l-amber-500',
    completed: 'border-l-green-500',
  }
  const statusBadgeColors: Record<string, string> = {
    in_progress: 'bg-blue-500/10 text-blue-600',
    on_hold: 'bg-amber-500/10 text-amber-600',
    completed: 'bg-green-500/10 text-green-600',
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activeJob && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <Play className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currently Working On</p>
                  <p className="font-medium">{activeJob.title}</p>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href={`/technician/jobs/${activeJob.id}`}>Continue</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <p className="text-sm text-muted-foreground">Jobs assigned to you, grouped by project</p>
      </div>

      <div className="flex gap-2">
        {(['all', 'in_progress', 'on_hold', 'completed'] as const).map((s) => (
          <Button key={s} variant={filter === s ? 'default' : 'outline'} size="sm" onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s === 'in_progress' ? 'In Progress' : s === 'on_hold' ? 'On Hold' : 'Completed'}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const filteredJobs = filter === 'all' ? group.jobs : group.jobs.filter((j) => j.status === filter)
          if (filteredJobs.length === 0) return null
          const completion = computeProjectCompletion(group.jobs)

          return (
            <div key={group.id}>
              <div className="mb-3 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">{group.name}</h2>
                    <p className="text-sm text-muted-foreground">{group.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{completion}%</p>
                    <p className="text-xs text-muted-foreground">complete</p>
                  </div>
                </div>
                <Progress value={completion} className="mt-2 h-1.5" />
              </div>

              <div className="space-y-2">
                {filteredJobs.map((job) => {
                  const jobCompletion = computeJobCompletion(job.procedure_steps)
                  const completedSteps = job.procedure_steps.filter((s) => s.completed).length
                  const hours = computeHoursFromSessions(job.time_sessions)

                  return (
                    <Link key={job.id} href={`/technician/jobs/${job.id}`}>
                      <Card className={`border-l-4 ${statusColors[job.status] ?? ''} hover:bg-muted/30 transition-colors`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{job.title}</h3>
                                <Badge variant="secondary" className={statusBadgeColors[job.status] ?? ''}>
                                  {job.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />{job.location}
                              </div>
                              <div className="mt-2 flex items-center gap-4 text-sm">
                                <span className="text-muted-foreground">
                                  {completedSteps}/{job.procedure_steps.length} steps
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />{hours.toFixed(1)}h
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold">{jobCompletion}%</p>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}

        {groups.every((g) => (filter === 'all' ? g.jobs : g.jobs.filter((j) => j.status === filter)).length === 0) && (
          <div className="py-12 text-center text-muted-foreground">
            No jobs found matching the selected filter
          </div>
        )}
      </div>
    </div>
  )
}
