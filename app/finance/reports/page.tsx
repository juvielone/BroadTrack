'use client'

import { mockProjects, calculateProjectCompletion } from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileBarChart } from 'lucide-react'

export default function FinanceReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Financial reports and analytics (read-only view)</p>
      </div>

      {/* Summary Cards */}
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
                {mockProjects.map((project) => {
                  const completion = calculateProjectCompletion(project)
                  const totalHours = project.jobs.reduce(
                    (sum, job) =>
                      sum + job.hoursTracked.reduce((h, t) => h + t.hours, 0),
                    0
                  )
                  const totalExpenses = project.jobs.reduce(
                    (sum, job) =>
                      sum + job.expenses.reduce((e, exp) => e + exp.amount, 0),
                    0
                  )
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
              {['pending', 'approved', 'rejected'].map((status) => {
                const expenses = mockProjects.flatMap((p) =>
                  p.jobs.flatMap((j) => j.expenses.filter((e) => e.status === status))
                )
                const total = expenses.reduce((sum, e) => sum + e.amount, 0)
                const colors = {
                  pending: 'bg-amber-500',
                  approved: 'bg-green-500',
                  rejected: 'bg-red-500',
                }
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{status}</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[status as keyof typeof colors]}`}
                        style={{ width: `${Math.min((total / 1000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for more reports */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileBarChart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">More Reports Coming Soon</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Additional financial reports including monthly summaries, technician performance,
            and expense trends will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
