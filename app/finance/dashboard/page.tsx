'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { computeHoursFromSessions, computeProjectCompletion } from '@/lib/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { DollarSign, Clock, CheckCircle2, XCircle } from 'lucide-react'

type ExpenseRow = {
  id: string; description: string; amount: number; status: string; submitted_at: string
  submitter: { name: string } | null
  job: { title: string } | null
}
type ProjectRow = {
  id: string; name: string; customer: string; status: string
  jobs: {
    id: string; status: string
    time_sessions: { start_time: string | null; end_time: string | null; status: string }[]
    expenses: { amount: number }[]
  }[]
}

export default function FinanceDashboard() {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [expensesRes, projectsRes] = await Promise.all([
        supabase
          .from('expenses')
          .select('id, description, amount, status, submitted_at, submitter:users!submitted_by(name), job:jobs!job_id(title)')
          .order('submitted_at', { ascending: false }),
        supabase
          .from('projects')
          .select('id, name, customer, status, jobs(id, status, time_sessions(start_time, end_time, status), expenses(amount))')
          .order('name'),
      ])
      setExpenses((expensesRes.data as unknown as ExpenseRow[]) ?? [])
      setProjects((projectsRes.data as unknown as ProjectRow[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const totals = {
    pending: expenses.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0),
    approved: expenses.filter((e) => e.status === 'approved').reduce((s, e) => s + e.amount, 0),
    rejected: expenses.filter((e) => e.status === 'rejected').reduce((s, e) => s + e.amount, 0),
    all: expenses.reduce((s, e) => s + e.amount, 0),
  }

  const pendingExpenses = expenses.filter((e) => e.status === 'pending')

  const expenseStatusColors: Record<string, string> = {
    pending: 'text-amber-600 bg-amber-500/10',
    approved: 'text-green-600 bg-green-500/10',
    rejected: 'text-red-600 bg-red-500/10',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
        <p className="text-muted-foreground">Overview of expenses and project costs (read-only)</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.pending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.status === 'pending').length} expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.approved.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.status === 'approved').length} expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.rejected.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.status === 'rejected').length} expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.all.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{expenses.length} total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Pending Expenses</CardTitle></CardHeader>
        <CardContent className="p-0">
          {pendingExpenses.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No pending expenses to review</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.submitter?.name ?? '—'}</TableCell>
                    <TableCell>{expense.job?.title ?? '—'}</TableCell>
                    <TableCell>{new Date(expense.submitted_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={expenseStatusColors[expense.status] ?? ''}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Project Cost Summary</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Jobs</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Expenses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const completion = computeProjectCompletion(project.jobs)
                const totalHours = computeHoursFromSessions(project.jobs.flatMap((j) => j.time_sessions))
                const totalExpenses = project.jobs.flatMap((j) => j.expenses).reduce((s, e) => s + e.amount, 0)
                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.customer}</p>
                    </TableCell>
                    <TableCell>{completion}%</TableCell>
                    <TableCell>{project.jobs.length}</TableCell>
                    <TableCell>{totalHours.toFixed(1)}h</TableCell>
                    <TableCell className="font-medium">${totalExpenses.toFixed(2)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All Expenses</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>{expense.submitter?.name ?? '—'}</TableCell>
                  <TableCell>{expense.job?.title ?? '—'}</TableCell>
                  <TableCell>{new Date(expense.submitted_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={expenseStatusColors[expense.status] ?? ''}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
