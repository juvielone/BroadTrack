'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

type ExpenseRow = {
  id: string
  description: string
  amount: number
  status: string
  submitted_at: string
  rejection_reason: string | null
  submitter: { name: string } | null
  job: { title: string } | null
}

export default function PMExpensesPage() {
  const { user } = useAuthStore()
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase
      .from('expenses')
      .select('id, description, amount, status, submitted_at, rejection_reason, submitter:users!submitted_by(name), job:jobs(title)')
      .order('submitted_at', { ascending: false })
    setExpenses((data as unknown as ExpenseRow[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const approve = async (id: string) => {
    setSaving(true)
    await supabase
      .from('expenses')
      .update({ status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: user?.id })
      .eq('id', id)
    await load()
    setSaving(false)
  }

  const reject = async () => {
    if (!rejectTarget || !rejectionReason.trim()) return
    setSaving(true)
    await supabase
      .from('expenses')
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason.trim(),
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      })
      .eq('id', rejectTarget)
    setRejectTarget(null)
    setRejectionReason('')
    await load()
    setSaving(false)
  }

  const totals = {
    pending: expenses.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0),
    approved: expenses.filter((e) => e.status === 'approved').reduce((s, e) => s + e.amount, 0),
    rejected: expenses.filter((e) => e.status === 'rejected').reduce((s, e) => s + e.amount, 0),
  }

  const statusColors: Record<string, string> = {
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
        <p className="text-muted-foreground">Review and approve reimbursement requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {(['pending', 'approved', 'rejected'] as const).map((status) => (
          <Card key={status}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">{status}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totals[status].toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {expenses.filter((e) => e.status === status).length} expenses
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle>All Expenses</CardTitle></CardHeader>
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
                <TableHead />
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
                    <Badge variant="secondary" className={statusColors[expense.status]}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {expense.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          disabled={saving}
                          onClick={() => approve(expense.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          disabled={saving}
                          onClick={() => setRejectTarget(expense.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {expense.status === 'rejected' && expense.rejection_reason && (
                      <p className="text-xs text-muted-foreground max-w-[180px] truncate" title={expense.rejection_reason}>
                        {expense.rejection_reason}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={(open) => { if (!open) { setRejectTarget(null); setRejectionReason('') } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <p className="text-sm text-muted-foreground">
              Provide a reason for rejection. This will be visible to the technician.
            </p>
            <Textarea
              placeholder="e.g. Personal expense not covered by policy"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectionReason('') }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectionReason.trim() || saving}
              onClick={reject}
            >
              {saving ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
