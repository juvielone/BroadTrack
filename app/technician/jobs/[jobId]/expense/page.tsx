'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { getJobById, getProjectByJobId } from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Camera, Upload, X, Receipt, AlertCircle } from 'lucide-react'

export default function ExpenseFormPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = use(params)
  const job = getJobById(jobId)
  const project = getProjectByJobId(jobId)
  const router = useRouter()

  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [hasReceipt, setHasReceipt] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!job || !project) {
    notFound()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push(`/technician/jobs/${job.id}`)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/technician/jobs/${job.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Add Expense</h1>
          <p className="text-sm text-muted-foreground">{job.title}</p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 text-blue-500" />
          <div className="text-sm">
            <p className="font-medium text-blue-700">Reimbursement Process</p>
            <p className="text-blue-600">
              Expenses will be reviewed by Finance. Approved expenses are reimbursed
              within 5 business days.
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
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

        {/* Description */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
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

        {/* Receipt Upload */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Receipt <span className="text-destructive">*</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload a photo of your receipt
            </p>
          </CardHeader>
          <CardContent>
            {!hasReceipt ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => setHasReceipt(true)}
                >
                  <Camera className="h-6 w-6" />
                  <span>Take Photo</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => setHasReceipt(true)}
                >
                  <Upload className="h-6 w-6" />
                  <span>Upload</span>
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-[3/4] max-w-[200px] rounded-lg bg-muted flex items-center justify-center mx-auto">
                  <Receipt className="h-12 w-12 text-muted-foreground" />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-1/2 translate-x-[100px] -top-2 h-6 w-6 rounded-full"
                  onClick={() => setHasReceipt(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  receipt.jpg
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Context */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project</span>
              <span className="font-medium">{project.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Job</span>
              <span className="font-medium">{job.title}</span>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link href={`/technician/jobs/${job.id}`}>Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!hasReceipt || !amount || !description || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Expense'}
          </Button>
        </div>
      </form>
    </div>
  )
}
