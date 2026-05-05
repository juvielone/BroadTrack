'use client'

import Link from 'next/link'
import { mockProjects, calculateProjectCompletion, getAllExpenses } from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  FolderKanban,
  Briefcase,
  Clock,
  DollarSign,
  ArrowRight,
  Plus,
} from 'lucide-react'

export default function PMDashboard() {
  const allJobs = mockProjects.flatMap((p) => p.jobs)
  const activeJobs = allJobs.filter((j) => j.status === 'in_progress')
  const pendingExpenses = getAllExpenses().filter((e) => e.status === 'pending')
  const totalHours = allJobs.reduce(
    (sum, job) => sum + job.hoursTracked.reduce((h, t) => h + t.hours, 0),
    0
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of all projects and jobs</p>
        </div>
        <Button asChild>
          <Link href="/pm/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjects.filter((p) => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockProjects.length} total projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Jobs In Progress</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs.length}</div>
            <p className="text-xs text-muted-foreground">{allJobs.length} total jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hours Tracked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses.length}</div>
            <p className="text-xs text-muted-foreground">
              ${pendingExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projects</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pm/projects">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {mockProjects.map((project) => {
            const completion = calculateProjectCompletion(project)
            const inProgressJobs = project.jobs.filter((j) => j.status === 'in_progress').length
            const completedJobs = project.jobs.filter((j) => j.status === 'completed').length

            return (
              <Card key={project.id} className="hover:border-primary/50 transition-colors">
                <Link href={`/pm/projects/${project.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{project.name}</CardTitle>
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
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-muted-foreground">Completion</span>
                        <span className="font-medium">{completion}%</span>
                      </div>
                      <Progress value={completion} className="h-2" />
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">
                        <span className="font-medium text-foreground">{inProgressJobs}</span> in
                        progress
                      </span>
                      <span className="text-muted-foreground">
                        <span className="font-medium text-foreground">{completedJobs}</span>{' '}
                        completed
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Pending Reimbursements</h2>
        <Card>
          <CardContent className="p-0">
            {pendingExpenses.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No pending reimbursements
              </div>
            ) : (
              <div className="divide-y">
                {pendingExpenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.technicianName} &middot;{' '}
                        {new Date(expense.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${expense.amount.toFixed(2)}</p>
                      <Badge variant="outline" className="text-amber-600">
                        Pending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
