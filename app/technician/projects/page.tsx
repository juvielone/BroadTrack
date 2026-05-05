'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  getTechnicianProjects,
  calculateProjectCompletion,
  calculateJobCompletion,
  type Job,
} from '@/lib/mockData'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { MapPin, ChevronRight, Play, Clock } from 'lucide-react'

export default function TechnicianProjectsPage() {
  const { user } = useAuthStore()
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'on_hold' | 'completed'>('all')

  const projects = user ? getTechnicianProjects(user.id) : []

  // Get the active job (most recent in-progress job)
  const activeJob = projects
    .flatMap((p) => p.jobs)
    .find(
      (j) =>
        j.status === 'in_progress' && user && j.assignedTechnicians.includes(user.id)
    )

  const statusColors = {
    in_progress: 'border-l-blue-500',
    on_hold: 'border-l-amber-500',
    completed: 'border-l-green-500',
  }

  const statusBadgeColors = {
    in_progress: 'bg-blue-500/10 text-blue-600',
    on_hold: 'bg-amber-500/10 text-amber-600',
    completed: 'bg-green-500/10 text-green-600',
  }

  const filterJobs = (jobs: Job[]) => {
    if (!user) return []
    const myJobs = jobs.filter((j) => j.assignedTechnicians.includes(user.id))
    if (filter === 'all') return myJobs
    return myJobs.filter((j) => j.status === filter)
  }

  return (
    <div className="space-y-4">
      {/* Active Work Banner */}
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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <p className="text-sm text-muted-foreground">
          Jobs assigned to you, grouped by project
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'in_progress', 'on_hold', 'completed'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === 'all'
              ? 'All'
              : status === 'in_progress'
                ? 'In Progress'
                : status === 'on_hold'
                  ? 'On Hold'
                  : 'Completed'}
          </Button>
        ))}
      </div>

      {/* Projects with Jobs */}
      <div className="space-y-6">
        {projects.map((project) => {
          const filteredJobs = filterJobs(project.jobs)
          if (filteredJobs.length === 0) return null

          const completion = calculateProjectCompletion(project)

          return (
            <div key={project.id}>
              {/* Project Header */}
              <div className="mb-3 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">{project.name}</h2>
                    <p className="text-sm text-muted-foreground">{project.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{completion}%</p>
                    <p className="text-xs text-muted-foreground">complete</p>
                  </div>
                </div>
                <Progress value={completion} className="mt-2 h-1.5" />
              </div>

              {/* Jobs */}
              <div className="space-y-2">
                {filteredJobs.map((job) => {
                  const jobCompletion = calculateJobCompletion(job)
                  const completedSteps = job.procedureSteps.filter((s) => s.completed).length

                  return (
                    <Link key={job.id} href={`/technician/jobs/${job.id}`}>
                      <Card
                        className={`border-l-4 ${statusColors[job.status]} hover:bg-muted/30 transition-colors`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{job.title}</h3>
                                <Badge
                                  variant="secondary"
                                  className={statusBadgeColors[job.status]}
                                >
                                  {job.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location}
                              </div>
                              <div className="mt-2 flex items-center gap-4 text-sm">
                                <span className="text-muted-foreground">
                                  {completedSteps}/{job.procedureSteps.length} steps
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  {job.hoursTracked
                                    .reduce((sum, h) => sum + h.hours, 0)
                                    .toFixed(1)}
                                  h
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <p className="text-lg font-semibold">{jobCompletion}%</p>
                              </div>
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

        {projects.every((p) => filterJobs(p.jobs).length === 0) && (
          <div className="py-12 text-center text-muted-foreground">
            No jobs found matching the selected filter
          </div>
        )}
      </div>
    </div>
  )
}
