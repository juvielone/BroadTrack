'use client'

import { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Camera, Upload, X, AlertCircle } from 'lucide-react'

type Job = { id: string; title: string; project: { name: string } | null }

export default function ExpenseFormPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const { user } = useAuthStore()
  const router = useRouter()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, project:projects!project_id(name)')
        .eq('id', jobId)
        .single()
      if (!data) { notFound(); return }
      setJob(data as unknown as Job)
      setLoading(false)
    }
    load()
  }, [jobId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReceiptFile(file)
    setReceiptPreview(URL.createObjectURL(file))
  }

  const clearReceipt = () => {
    if (receiptPreview) URL.revokeObjectURL(receiptPreview)
    setReceiptFile(null)
    setReceiptPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job || !receiptFile || !user) return
    setIsSubmitting(true)
    setError(null)

    const ext = receiptFile.name.split('.').pop() ?? 'jpg'
    const path = `${jobId}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('expense-receipts')
      .upload(path, receiptFile, { contentType: receiptFile.type })

    if (uploadError) {
      setError('Receipt upload failed. Please try again.')
      setIsSubmitting(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('expense-receipts').getPublicUrl(path)

    const { error: insertError } = await supabase.from('expenses').insert({
      job_id: jobId,
      description: description.trim(),
      amount: parseFloat(amount),
      status: 'pending',
      submitted_by: user.id,
      receipt_url: publicUrl,
      submitted_at: new Date().toISOString(),
    })

    if (insertError) {
      setError('Failed to submit expense. Please try again.')
      setIsSubmitting(false)
      return
    }

    router.push(`/technician/jobs/${job.id}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!job) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/technician/jobs/${job.id}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Add Expense</h1>
          <p className="text-sm text-muted-foreground">{job.title}</p>
        </div>
      </div>

      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 text-blue-500" />
          <div className="text-sm">
            <p className="font-medium text-blue-700">Reimbursement Process</p>
            <p className="text-blue-600">
              Expenses will be reviewed by Finance. Approved expenses are reimbursed within 5 business days.
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Amount</CardTitle></CardHeader>
          <CardContent>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-7 text-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Description</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              placeholder="What was this expense for? e.g., Cable ties from Bunnings"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Receipt <span className="text-destructive">*</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Upload a photo of your receipt</p>
          </CardHeader>
          <CardContent>
            {!receiptPreview ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-6 w-6" /><span>Take Photo</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-6 w-6" /><span>Upload</span>
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-[3/4] max-w-[200px] overflow-hidden rounded-lg mx-auto">
                  <img src={receiptPreview} alt="Receipt" className="h-full w-full object-cover" />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-1/2 translate-x-[100px] -top-2 h-6 w-6 rounded-full"
                  onClick={clearReceipt}
                >
                  <X className="h-3 w-3" />
                </Button>
                <p className="mt-2 text-center text-sm text-muted-foreground">{receiptFile?.name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Job Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project</span>
              <span className="font-medium">{job.project?.name ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Job</span>
              <span className="font-medium">{job.title}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link href={`/technician/jobs/${job.id}`}>Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!receiptFile || !amount || !description || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Expense'}
          </Button>
        </div>
      </form>
    </div>
  )
}
