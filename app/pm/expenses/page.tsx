'use client'

import { getAllExpenses, mockProjects } from '@/lib/mockData'
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

export default function PMExpensesPage() {
  const expenses = getAllExpenses()

  const expenseStatusColors = {
    pending: 'text-amber-600 bg-amber-500/10',
    approved: 'text-green-600 bg-green-500/10',
    rejected: 'text-red-600 bg-red-500/10',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground">View all submitted expenses</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenses
                .filter((e) => e.status === 'pending')
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.status === 'pending').length} expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenses
                .filter((e) => e.status === 'approved')
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.status === 'approved').length} expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenses
                .filter((e) => e.status === 'rejected')
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.status === 'rejected').length} expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
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
                <TableHead>Date</TableHead>
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
