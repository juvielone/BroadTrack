'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { computeProjectCompletion } from '@/lib/queries'
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
import { Plus, Search, MapPin, Calendar } from 'lucide-react'

type ProjectRow = {
  id: string
  name: string
  description: string | null
  customer: string
  location: string
  status: string
  created_at: string
  jobs: { id: string; status: string }[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, name, description, customer, location, status, created_at, jobs(id, status)')
        .order('created_at', { ascending: false })
      setProjects((data as ProjectRow[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage all your projects</p>
        </div>
        <Button asChild>
          <Link href="/pm/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => {
          const completion = computeProjectCompletion(project.jobs)
          const counts = {
            inProgress: project.jobs.filter((j) => j.status === 'in_progress').length,
            onHold: project.jobs.filter((j) => j.status === 'on_hold').length,
            completed: project.jobs.filter((j) => j.status === 'completed').length,
          }
          return (
            <Link key={project.id} href={`/pm/projects/${project.id}`}>
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.customer}</p>
                    </div>
                    <Badge
                      variant={
                        project.status === 'active'
                          ? 'default'
                          : project.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{completion}%</span>
                    </div>
                    <Progress value={completion} className="h-2" />
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="rounded bg-blue-500/10 px-2 py-1 text-blue-600">
                      {counts.inProgress} in progress
                    </span>
                    <span className="rounded bg-amber-500/10 px-2 py-1 text-amber-600">
                      {counts.onHold} on hold
                    </span>
                    <span className="rounded bg-green-500/10 px-2 py-1 text-green-600">
                      {counts.completed} done
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No projects found matching your criteria
        </div>
      )}
    </div>
  )
}
