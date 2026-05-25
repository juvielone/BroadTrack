'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type ExpenseRow = {
  id: string; description: string; amount: number; status: string
  submitted_at: string; rejection_reason: string | null
  job: { title: string; project: { name: string } | null } | null
}

export default function TechnicianExpensesPage() {
  const { user } = useAuthStore()
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await supabase
        .from('expenses')
        .select('id, description, amount, status, submitted_at, rejection_reason, job:jobs!job_id(title, project:projects!project_id(name))')
        .eq('submitted_by', user.id)
        .order('submitted_at', { ascending: false })
      setExpenses((data as unknown as ExpenseRow[]) ?? [])
      setLoading(false)
    }
    load()
  }, [user])

  const totals = {
    pending: expenses.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0),
    approved: expenses.filter((e) => e.status === 'approved').reduce((s, e) => s + e.amount, 0),
    rejected: expenses.filter((e) => e.status === 'rejected').reduce((s, e) => s + e.amount, 0),
  }

  const expenseStatusColors: Record<string, string> = {
    pending: 'text-amber-600 bg-amber-500/10',
    approved: 'text-green-600 bg-green-500/10',
    rejected: 'text-red-600 bg-red-500/10',
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">My Expenses</h1>
        <p className="text-sm text-muted-foreground">Track your submitted expenses</p>
      </div>

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

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Expense History</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {expenses.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No expenses submitted yet</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{expense.description}</p>
                    <Badge variant="secondary" className={expenseStatusColors[expense.status] ?? ''}>
                      {expense.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {expense.job?.title ?? '—'} &middot; {expense.job?.project?.name ?? '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(expense.submitted_at).toLocaleDateString()}
                  </p>
                  {expense.status === 'rejected' && expense.rejection_reason && (
                    <p className="mt-1 text-xs text-red-600">Rejected: {expense.rejection_reason}</p>
                  )}
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
