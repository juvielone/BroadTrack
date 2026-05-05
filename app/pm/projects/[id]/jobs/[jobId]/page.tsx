'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getJobById, getProjectByJobId, mockUsers } from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  Image as ImageIcon,
  User,
} from 'lucide-react'

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string; jobId: string }>
}) {
  const { id, jobId } = use(params)
  const job = getJobById(jobId)
  const project = getProjectByJobId(jobId)

  if (!job || !project || project.id !== id) {
    notFound()
  }

  const completedSteps = job.procedureSteps.filter((s) => s.completed).length
  const totalHours = job.hoursTracked.reduce((sum, h) => sum + h.hours, 0)
  const totalExpenses = job.expenses.reduce((sum, e) => sum + e.amount, 0)

  const statusColors = {
    in_progress: 'bg-blue-500',
    on_hold: 'bg-amber-500',
    completed: 'bg-green-500',
  }

  const expenseStatusColors = {
    pending: 'text-amber-600 bg-amber-500/10',
    approved: 'text-green-600 bg-green-500/10',
    rejected: 'text-red-600 bg-red-500/10',
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/pm/projects" className="hover:text-foreground">
          Projects
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/pm/projects/${project.id}`} className="hover:text-foreground">
          {project.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{job.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/pm/projects/${project.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${statusColors[job.status]}`} />
                <span className="text-sm capitalize">{job.status.replace('_', ' ')}</span>
              </div>
            </div>
            <p className="text-muted-foreground">{job.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {job.status === 'in_progress' && (
            <Button variant="outline">Put On Hold</Button>
          )}
          {job.status === 'on_hold' && <Button variant="outline">Resume</Button>}
          {job.status !== 'completed' && (
            <Button>Mark Complete</Button>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {totalHours.toFixed(1)} hours logged
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          ${totalExpenses.toFixed(2)} in expenses
        </div>
        <Badge
          variant={
            job.priority === 'high'
              ? 'destructive'
              : job.priority === 'medium'
                ? 'default'
                : 'secondary'
          }
        >
          {job.priority} priority
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Procedure Steps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Procedure Steps</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {completedSteps} of {job.procedureSteps.length} completed
                </span>
              </div>
              <Progress
                value={(completedSteps / job.procedureSteps.length) * 100}
                className="h-2"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {job.procedureSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`rounded-lg border p-4 ${step.completed ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox checked={step.completed} disabled className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Step {index + 1}
                        </span>
                        <h4 className="font-medium">{step.title}</h4>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

                      {/* Sub-steps */}
                      <div className="mt-3 space-y-2">
                        {step.subSteps.map((subStep) => (
                          <div key={subStep.id} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={subStep.completed}
                              disabled
                              className="h-3.5 w-3.5"
                            />
                            <span
                              className={
                                subStep.completed ? 'text-muted-foreground line-through' : ''
                              }
                            >
                              {subStep.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      {step.completed && step.completedAt && (
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          {step.photoUrl && (
                            <span className="flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              Photo attached
                            </span>
                          )}
                          <span>
                            Completed {new Date(step.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {job.expenses.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No expenses submitted for this job
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {job.expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell>{expense.technicianName}</TableCell>
                        <TableCell>
                          {new Date(expense.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium capitalize ${expenseStatusColors[expense.status]}`}
                          >
                            {expense.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Project Context */}
          <Card>
            <CardHeader>
              <CardTitle>Project</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/pm/projects/${project.id}`}
                className="block rounded-lg border p-3 hover:border-primary/50 transition-colors"
              >
                <p className="font-medium">{project.name}</p>
                <p className="text-sm text-muted-foreground">{project.customer}</p>
              </Link>
            </CardContent>
          </Card>

          {/* Assigned Technicians */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Technicians</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.assignedTechnicians.map((techId) => {
                const tech = mockUsers.find((u) => u.id === techId)
                return (
                  <div key={techId} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tech?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">Technician</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Hours Tracked */}
          <Card>
            <CardHeader>
              <CardTitle>Hours Tracked</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.hoursTracked.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hours tracked yet</p>
              ) : (
                job.hoursTracked.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.technicianName} &middot; {entry.date}
                      </p>
                    </div>
                    <span className="font-medium">{entry.hours}h</span>
                  </div>
                ))
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{totalHours.toFixed(1)} hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
