'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { getJobById, getProjectByJobId } from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Camera, Upload, X } from 'lucide-react'

export default function AddWorkPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = use(params)
  const job = getJobById(jobId)
  const project = getProjectByJobId(jobId)
  const router = useRouter()

  const [selectedStep, setSelectedStep] = useState<string>('')
  const [description, setDescription] = useState('')
  const [hasPhoto, setHasPhoto] = useState(false)
  const [markComplete, setMarkComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!job || !project) {
    notFound()
  }

  const incompleteSteps = job.procedureSteps.filter((s) => !s.completed)
  const currentStep = job.procedureSteps.find((s) => s.id === selectedStep)

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
          <h1 className="text-xl font-bold">Add Work</h1>
          <p className="text-sm text-muted-foreground">{job.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Step */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Procedure Step</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedStep} onValueChange={setSelectedStep} required>
              <SelectTrigger>
                <SelectValue placeholder="Select the step you worked on..." />
              </SelectTrigger>
              <SelectContent>
                {incompleteSteps.length === 0 ? (
                  <SelectItem value="" disabled>
                    All steps completed
                  </SelectItem>
                ) : (
                  incompleteSteps.map((step, index) => {
                    const originalIndex = job.procedureSteps.findIndex(
                      (s) => s.id === step.id
                    )
                    return (
                      <SelectItem key={step.id} value={step.id}>
                        Step {originalIndex + 1}: {step.title}
                      </SelectItem>
                    )
                  })
                )}
              </SelectContent>
            </Select>

            {currentStep && (
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                <div className="mt-2 space-y-1">
                  {currentStep.subSteps.map((subStep) => (
                    <div key={subStep.id} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={subStep.completed} disabled className="h-3.5 w-3.5" />
                      <span>{subStep.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Photo <span className="text-destructive">*</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Take a photo of the completed work
            </p>
          </CardHeader>
          <CardContent>
            {!hasPhoto ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => setHasPhoto(true)}
                >
                  <Camera className="h-6 w-6" />
                  <span>Take Photo</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => setHasPhoto(true)}
                >
                  <Upload className="h-6 w-6" />
                  <span>Upload</span>
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                  onClick={() => setHasPhoto(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe the work completed..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Mark Complete */}
        {selectedStep && (
          <Card>
            <CardContent className="p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={markComplete}
                  onCheckedChange={(checked) => setMarkComplete(checked as boolean)}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium">Mark step as complete</p>
                  <p className="text-sm text-muted-foreground">
                    Check this if all sub-steps are finished
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link href={`/technician/jobs/${job.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" className="flex-1" disabled={!hasPhoto || !selectedStep || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Work'}
          </Button>
        </div>
      </form>
    </div>
  )
}
