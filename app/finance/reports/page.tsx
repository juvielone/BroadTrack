'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { computeHoursFromSessions, computeProjectCompletion } from '@/lib/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { FileBarChart } from 'lucide-react'

type ProjectRow = {
  id: string; name: string; customer: string; status: string
  jobs: {
    id: string; status: string
    time_sessions: { start_time: string | null; end_time: string | null; status: string }[]
    expenses: { amount: number; status: string }[]
  }[]
}

export default function FinanceReportsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, name, customer, status, jobs(id, status, time_sessions(start_time, end_time, status), expenses(amount, status))')
        .order('name')
      setProjects((data as unknown as ProjectRow[]) ?? [])
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

  const allExpenses = projects.flatMap((p) => p.jobs.flatMap((j) => j.expenses))

  const expenseTotals = {
    pending: allExpenses.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0),
    approved: allExpenses.filter((e) => e.status === 'approved').reduce((s, e) => s + e.amount, 0),
    rejected: allExpenses.filter((e) => e.status === 'rejected').reduce((s, e) => s + e.amount, 0),
  }
  const grandTotal = allExpenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Financial reports and analytics (read-only view)</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5" />
              Project Cost Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Completion</TableHead>
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
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{completion}%</TableCell>
                      <TableCell>{totalHours.toFixed(1)}h</TableCell>
                      <TableCell>${totalExpenses.toFixed(2)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5" />
              Expense Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(['pending', 'approved', 'rejected'] as const).map((status) => {
                const total = expenseTotals[status]
                const pct = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0
                const colors = { pending: 'bg-amber-500', approved: 'bg-green-500', rejected: 'bg-red-500' }
                return (
                  <div key={status}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="capitalize">{status}</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full ${colors[status]}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileBarChart className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-semibold">More Reports Coming Soon</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Additional financial reports including monthly summaries, technician performance,
            and expense trends will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
