'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

type ExpenseRow = {
  id: string; description: string; amount: number; status: string; submitted_at: string
  submitter: { name: string } | null
  job: { title: string } | null
}

export default function FinanceExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('expenses')
        .select('id, description, amount, status, submitted_at, submitter:users!submitted_by(name), job:jobs!job_id(title)')
        .order('submitted_at', { ascending: false })
      setExpenses((data as unknown as ExpenseRow[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground">Review and manage all expenses (read-only view)</p>
      </div>

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
