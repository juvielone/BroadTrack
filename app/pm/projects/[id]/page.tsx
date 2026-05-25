'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { computeProjectCompletion, computeJobCompletion, computeHoursFromSessions } from '@/lib/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Plus, MapPin, User, Mail, Calendar, Briefcase, Clock, DollarSign } from 'lucide-react'

type JobRow = {
  id: string
  title: string
  location: string | null
  status: string
  priority: string
  procedure_steps: { id: string; completed: boolean }[]
  expenses: { amount: number }[]
  time_sessions: { start_time: string | null; end_time: string | null; status: string }[]
}

type ProjectRow = {
  id: string
  name: string
  description: string | null
  customer: string
  customer_contact: string | null
  customer_email: string | null
  location: string
  status: string
  created_at: string
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [project, setProject] = useState<ProjectRow | null>(null)
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [projectRes, jobsRes] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).single(),
        supabase
          .from('jobs')
          .select('id, title, location, status, priority, procedure_steps(id, completed), expenses(amount), time_sessions(start_time, end_time, status)')
          .eq('project_id', id)
          .order('created_at', { ascending: false }),
      ])

      if (!projectRes.data) { notFound(); return }
      setProject(projectRes.data as ProjectRow)
      setJobs((jobsRes.data as unknown as JobRow[]) ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!project) return null

  const completion = computeProjectCompletion(jobs)
  const totalHours = computeHoursFromSessions(jobs.flatMap((j) => j.time_sessions))
  const totalExpenses = jobs.flatMap((j) => j.expenses).reduce((s, e) => s + e.amount, 0)

  const statusColors: Record<string, string> = {
    in_progress: 'bg-blue-500',
    on_hold: 'bg-amber-500',
    completed: 'bg-green-500',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/pm/projects"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <Badge variant={project.status === 'active' ? 'default' : project.status === 'completed' ? 'secondary' : 'outline'}>
                {project.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/pm/projects/${project.id}/jobs/new`}>
            <Plus className="mr-2 h-4 w-4" />Add Job
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-2xl font-bold">{completion}%</div>
            <Progress value={completion} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">
              {jobs.filter((j) => j.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hours Tracked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Total hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total submitted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Jobs table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Jobs</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => {
                    const jobCompletion = computeJobCompletion(job.procedure_steps)
                    return (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-sm text-muted-foreground">{job.location}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${statusColors[job.status]}`} />
                            <span className="capitalize text-sm">{job.status.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={jobCompletion} className="h-2 w-20" />
                            <span className="text-sm text-muted-foreground">{jobCompletion}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={job.priority === 'high' ? 'destructive' : job.priority === 'medium' ? 'default' : 'secondary'}>
                            {job.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/pm/projects/${project.id}/jobs/${job.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Project Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{project.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{project.customer}</p>
                  <p className="text-sm text-muted-foreground">{project.customer_contact}</p>
                </div>
              </div>
              {project.customer_email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{project.customer_email}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
