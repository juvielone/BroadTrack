'use client'

import { getTechnicianProjects } from '@/lib/mockData'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign } from 'lucide-react'

export default function TechnicianExpensesPage() {
  const { user } = useAuthStore()
  const projects = user ? getTechnicianProjects(user.id) : []

  const allExpenses = projects.flatMap((p) =>
    p.jobs.flatMap((j) =>
      j.expenses
        .filter((e) => e.technicianId === user?.id)
        .map((e) => ({ ...e, jobTitle: j.title, projectName: p.name }))
    )
  )

  const totals = {
    pending: allExpenses.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0),
    approved: allExpenses.filter((e) => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0),
    rejected: allExpenses.filter((e) => e.status === 'rejected').reduce((sum, e) => sum + e.amount, 0),
  }

  const expenseStatusColors = {
    pending: 'text-amber-600 bg-amber-500/10',
    approved: 'text-green-600 bg-green-500/10',
    rejected: 'text-red-600 bg-red-500/10',
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Expenses</h1>
        <p className="text-sm text-muted-foreground">Track your submitted expenses</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-lg font-bold text-amber-600">${totals.pending.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Approved</p>
            <p className="text-lg font-bold text-green-600">${totals.approved.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Rejected</p>
            <p className="text-lg font-bold text-red-600">${totals.rejected.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Expense History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {allExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No expenses submitted yet</p>
          ) : (
            allExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{expense.description}</p>
                    <Badge variant="secondary" className={expenseStatusColors[expense.status]}>
                      {expense.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {expense.jobTitle} &middot; {expense.projectName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(expense.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-lg font-semibold">${expense.amount.toFixed(2)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
