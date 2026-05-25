'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { computeJobCompletion } from '@/lib/queries'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search } from 'lucide-react'

type JobRow = {
  id: string
  title: string
  location: string | null
  status: string
  priority: string
  project_id: string
  procedure_steps: { id: string; completed: boolean }[]
  projects: { id: string; name: string } | null
}

type ProjectOption = { id: string; name: string }

export default function AllJobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      const [jobsRes, projectsRes] = await Promise.all([
        supabase
          .from('jobs')
          .select('id, title, location, status, priority, project_id, procedure_steps(id, completed), projects(id, name)')
          .order('created_at', { ascending: false }),
        supabase.from('projects').select('id, name').order('name'),
      ])
      setJobs((jobsRes.data as unknown as JobRow[]) ?? [])
      setProjectOptions((projectsRes.data as ProjectOption[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.projects?.name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    const matchesProject = projectFilter === 'all' || job.project_id === projectFilter
    return matchesSearch && matchesStatus && matchesProject
  })

  const statusColors: Record<string, string> = {
    in_progress: 'bg-blue-500',
    on_hold: 'bg-amber-500',
    completed: 'bg-green-500',
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Jobs</h1>
        <p className="text-muted-foreground">View all jobs across all projects</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projectOptions.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => {
                const completion = computeJobCompletion(job.procedure_steps)
                return (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {job.projects && (
                        <Link
                          href={`/pm/projects/${job.projects.id}`}
                          className="text-primary hover:underline"
                        >
                          {job.projects.name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusColors[job.status]}`} />
                        <span className="capitalize text-sm">{job.status.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={completion} className="h-2 w-20" />
                        <span className="text-sm text-muted-foreground">{completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.priority === 'high'
                            ? 'destructive'
                            : job.priority === 'medium'
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        {job.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/pm/projects/${job.project_id}/jobs/${job.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No jobs found matching your criteria
        </div>
      )}
    </div>
  )
}
