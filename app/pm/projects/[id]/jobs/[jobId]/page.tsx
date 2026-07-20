'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/auth-store'
import { updateStepCompletion } from '@/lib/step-completion'
import { computeJobCompletion, computeHoursFromSessions } from '@/lib/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ArrowLeft, MapPin, Clock, DollarSign, ChevronRight, Image as ImageIcon, User } from 'lucide-react'

type SubStep = { id: string; title: string; completed: boolean }
type Step = {
  id: string; title: string; description: string | null; completed: boolean
  completed_at: string | null; sub_steps: SubStep[]
  completed_by_user: { name: string } | null
  step_photos: { url: string }[] | { url: string } | null
}
type Expense = {
  id: string; description: string; amount: number; status: string
  submitted_at: string; submitter: { name: string } | null
}
type Session = { id: string; start_time: string | null; end_time: string | null; status: string; technician: { name: string } | null }
type Assignment = { user_id: string; user: { id: string; name: string; email: string } | null }
type Job = {
  id: string; title: string; description: string | null; location: string | null
  status: string; priority: string; on_hold_reason: string | null
  procedure_steps: Step[]; expenses: Expense[]
  time_sessions: Session[]; job_assignments: Assignment[]
}
type Project = { id: string; name: string; customer: string }

export default function JobDetailPage({ params }: { params: Promise<{ id: string; jobId: string }> }) {
  const { id, jobId } = use(params)
  const { user } = useAuthStore()
  const [job, setJob] = useState<Job | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [holdDialogOpen, setHoldDialogOpen] = useState(false)
  const [holdReason, setHoldReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [togglingStepId, setTogglingStepId] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

  const load = async () => {
    const [jobRes, projectRes] = await Promise.all([
      supabase
        .from('jobs')
        .select(`
          id, title, description, location, status, priority, on_hold_reason,
          procedure_steps(id, title, description, completed, completed_at, sub_steps(id, title, completed), completed_by_user:users!completed_by(name), step_photos(url)),
          expenses(id, description, amount, status, submitted_at, submitter:users!submitted_by(name)),
          time_sessions(id, start_time, end_time, status, technician:users!technician_id(name)),
          job_assignments(user_id, user:users!user_id(id, name, email))
        `)
        .eq('id', jobId)
        .single(),
      supabase.from('projects').select('id, name, customer').eq('id', id).single(),
    ])

    if (!jobRes.data || !projectRes.data) { notFound(); return }
    setJob(jobRes.data as unknown as Job)
    setProject(projectRes.data as Project)
    setLoading(false)
  }

  useEffect(() => { load() }, [jobId, id])

  const updateStatus = async (status: string, extra: Record<string, unknown> = {}) => {
    setSaving(true)
    await supabase
      .from('jobs')
      .update({ status, updated_at: new Date().toISOString(), ...extra })
      .eq('id', jobId)
    await load()
    setSaving(false)
  }

  const putOnHold = async () => {
    if (!holdReason.trim()) return
    await updateStatus('on_hold', { on_hold_reason: holdReason.trim() })
    setHoldDialogOpen(false)
    setHoldReason('')
  }

  const handleToggleStep = async (stepId: string, checked: boolean) => {
    if (!user) return
    setTogglingStepId(stepId)
    setStepError(null)

    const { error } = await updateStepCompletion(stepId, checked, user.id)

    if (error) {
      setStepError('Failed to update step. Please try again.')
      setTogglingStepId(null)
      return
    }

    setJob((prev) =>
      prev
        ? {
            ...prev,
            procedure_steps: prev.procedure_steps.map((s) =>
              s.id === stepId
                ? {
                    ...s,
                    completed: checked,
                    completed_at: checked ? new Date().toISOString() : null,
                    completed_by_user: checked ? { name: user.name } : null,
                  }
                : s
            ),
          }
        : prev
    )
    setTogglingStepId(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!job || !project) return null

  const completion = computeJobCompletion(job.procedure_steps)
  const totalHours = computeHoursFromSessions(job.time_sessions)
  const totalExpenses = job.expenses.reduce((s, e) => s + e.amount, 0)
  const completedSteps = job.procedure_steps.filter((s) => s.completed).length

  const statusColors: Record<string, string> = {
    in_progress: 'bg-blue-500',
    on_hold: 'bg-amber-500',
    completed: 'bg-green-500',
  }
  const expenseStatusColors: Record<string, string> = {
    pending: 'text-amber-600 bg-amber-500/10',
    approved: 'text-green-600 bg-green-500/10',
    rejected: 'text-red-600 bg-red-500/10',
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/pm/projects" className="hover:text-foreground">Projects</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/pm/projects/${project.id}`} className="hover:text-foreground">{project.name}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{job.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/pm/projects/${project.id}`}><ArrowLeft className="h-4 w-4" /></Link>
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
            {job.on_hold_reason && (
              <p className="mt-1 text-sm text-amber-600">Hold reason: {job.on_hold_reason}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {job.status === 'in_progress' && (
            <Button variant="outline" onClick={() => setHoldDialogOpen(true)} disabled={saving}>
              Put On Hold
            </Button>
          )}
          {job.status === 'on_hold' && (
            <Button variant="outline" onClick={() => updateStatus('in_progress', { on_hold_reason: null })} disabled={saving}>
              Resume
            </Button>
          )}
          {job.status === 'completed' && (
            <Button variant="outline" onClick={() => updateStatus('in_progress')} disabled={saving}>
              Reopen
            </Button>
          )}
          {job.status !== 'completed' && (
            <Button onClick={() => updateStatus('completed', { completed_at: new Date().toISOString() })} disabled={saving}>
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      {stepError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{stepError}</div>
      )}

      {/* Quick Info */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />{job.location}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />{totalHours.toFixed(1)} hours logged
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="h-4 w-4" />${totalExpenses.toFixed(2)} in expenses
        </div>
        <Badge variant={job.priority === 'high' ? 'destructive' : job.priority === 'medium' ? 'default' : 'secondary'}>
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
                  {completedSteps} of {job.procedure_steps.length} completed
                </span>
              </div>
              <Progress value={completion} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {job.procedure_steps.map((step, index) => {
                const hasPhoto = Array.isArray(step.step_photos)
                  ? step.step_photos.length > 0
                  : !!step.step_photos

                return (
                  <div key={step.id} className={`rounded-lg border p-4 ${step.completed ? 'bg-muted/50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={step.completed}
                        disabled={togglingStepId === step.id}
                        onCheckedChange={(v) => handleToggleStep(step.id, v as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Step {index + 1}</span>
                          <h4 className="font-medium">{step.title}</h4>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                        <div className="mt-3 space-y-2">
                          {step.sub_steps.map((ss) => (
                            <div key={ss.id} className="flex items-center gap-2 text-sm">
                              <Checkbox checked={ss.completed} disabled className="h-3.5 w-3.5" />
                              <span className={ss.completed ? 'text-muted-foreground line-through' : ''}>{ss.title}</span>
                            </div>
                          ))}
                        </div>
                        {(hasPhoto || (step.completed && step.completed_at)) && (
                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            {hasPhoto && (
                              <span className="flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" />Photo attached
                              </span>
                            )}
                            {step.completed && step.completed_at && (
                              <span>Completed {new Date(step.completed_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card>
            <CardHeader><CardTitle>Expenses</CardTitle></CardHeader>
            <CardContent className="p-0">
              {job.expenses.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">No expenses submitted</div>
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
                        <TableCell>{expense.submitter?.name ?? '—'}</TableCell>
                        <TableCell>{new Date(expense.submitted_at).toLocaleDateString()}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`rounded px-2 py-1 text-xs font-medium capitalize ${expenseStatusColors[expense.status]}`}>
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
          <Card>
            <CardHeader><CardTitle>Project</CardTitle></CardHeader>
            <CardContent>
              <Link href={`/pm/projects/${project.id}`} className="block rounded-lg border p-3 hover:border-primary/50 transition-colors">
                <p className="font-medium">{project.name}</p>
                <p className="text-sm text-muted-foreground">{project.customer}</p>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Assigned Technicians</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {job.job_assignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No technicians assigned</p>
              ) : (
                job.job_assignments.map((a) => (
                  <div key={a.user_id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{a.user?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{a.user?.email}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Hours Tracked</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {job.time_sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sessions yet</p>
              ) : (
                job.time_sessions.filter((s) => s.start_time && s.end_time).map((s) => {
                  const hrs = ((new Date(s.end_time!).getTime() - new Date(s.start_time!).getTime()) / 3_600_000).toFixed(1)
                  return (
                    <div key={s.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{s.technician?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(s.end_time!).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-medium">{hrs}h</span>
                    </div>
                  )
                })
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

      {/* Put On Hold dialog */}
      <Dialog open={holdDialogOpen} onOpenChange={setHoldDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Put Job On Hold</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <p className="text-sm text-muted-foreground">Provide a reason for putting this job on hold.</p>
            <Textarea
              placeholder="e.g. Waiting for equipment delivery"
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHoldDialogOpen(false)}>Cancel</Button>
            <Button disabled={!holdReason.trim() || saving} onClick={putOnHold}>
              {saving ? 'Saving...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
