'use client'

import {
  mockProjects,
  getAllExpenses,
  getTotalExpensesByStatus,
  calculateProjectCompletion,
} from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DollarSign, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default function FinanceDashboard() {
  const expenses = getAllExpenses()
  const totals = getTotalExpensesByStatus()

  const pendingExpenses = expenses.filter((e) => e.status === 'pending')

  const expenseStatusColors = {
    pending: 'text-amber-600 bg-amber-500/10',
    approved: 'text-green-600 bg-green-500/10',
    rejected: 'text-red-600 bg-red-500/10',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of expenses and project costs (read-only)
        </p>
      </div>

      {/* Stats */}
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
            <div className="text-2xl font-bold">
              ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{expenses.length} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Expenses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {pendingExpenses.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No pending expenses to review
            </div>
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
                {pendingExpenses.map((expense) => {
                  const job = mockProjects
                    .flatMap((p) => p.jobs)
                    .find((j) => j.id === expense.jobId)
                  return (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>{expense.technicianName}</TableCell>
                      <TableCell>{job?.title || 'Unknown'}</TableCell>
                      <TableCell>
                        {new Date(expense.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={expenseStatusColors[expense.status]}>
                          {expense.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Project Costs Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Cost Summary</CardTitle>
        </CardHeader>
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
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.customer}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{completion}%</TableCell>
                    <TableCell>{project.jobs.length}</TableCell>
                    <TableCell>{totalHours.toFixed(1)}h</TableCell>
                    <TableCell className="font-medium">
                      ${totalExpenses.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* All Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
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
              {expenses.map((expense) => {
                const job = mockProjects
                  .flatMap((p) => p.jobs)
                  .find((j) => j.id === expense.jobId)
                return (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.technicianName}</TableCell>
                    <TableCell>{job?.title || 'Unknown'}</TableCell>
                    <TableCell>
                      {new Date(expense.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={expenseStatusColors[expense.status]}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
