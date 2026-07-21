'use client'

import { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/auth-store'
import { updateStepCompletion } from '@/lib/step-completion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Camera, Upload, X } from 'lucide-react'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/heic', 'image/heif'])
const MAX_SIZE_BYTES = 15 * 1024 * 1024
const EXTENSION_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  heic: 'image/heic',
  heif: 'image/heif',
}

// Some browser/OS combinations (notably Windows without HEIF codecs installed)
// report an empty or generic File.type for HEIC/HEIF files instead of a real
// MIME type. Fall back to the filename extension only for those "I don't
// actually know" signals — never override a type the browser confidently
// reported as something specific and different (including other image
// formats we don't support), since that's a real answer, not a gap.
const UNKNOWN_TYPES = new Set(['', 'application/octet-stream'])

function resolveFileType(file: File): string | null {
  if (ALLOWED_TYPES.has(file.type)) return file.type
  if (!UNKNOWN_TYPES.has(file.type)) return null
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext ? EXTENSION_TO_MIME[ext] ?? null : null
}

type SubStep = { id: string; title: string; completed: boolean }
type Step = { id: string; title: string; description: string | null; completed: boolean; sub_steps: SubStep[] }
type Job = { id: string; title: string; project_id: string; procedure_steps: Step[] }

export default function AddWorkPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const { user } = useAuthStore()
  const router = useRouter()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStep, setSelectedStep] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoType, setPhotoType] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [completeError, setCompleteError] = useState<string | null>(null)
  const [completeSuccess, setCompleteSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, project_id, procedure_steps(id, title, description, completed, sub_steps(id, title, completed))')
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

    const resolvedType = resolveFileType(file)
    if (!resolvedType) {
      setError('Unsupported file type. Please use JPEG, PNG, HEIC, or HEIF.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('File exceeds the 15MB limit.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setError(null)
    setPhotoFile(file)
    setPhotoType(resolvedType)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null)
    setPhotoType(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job || !photoFile || !photoType || !selectedStep || !user) return
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const ext = photoFile.name.split('.').pop() ?? 'jpg'
    const stagingPath = `staging/${jobId}/${selectedStep}/${Date.now()}.${ext}`
    // storage-js wraps Blob/File bodies in FormData and ignores the `contentType`
    // fileOption in that path — the browser derives the part's Content-Type from
    // the Blob's own .type instead. Construct a corrected File so its intrinsic
    // type is what actually reaches Storage.
    const correctedFile = new File([photoFile], photoFile.name, { type: photoType })
    const { error: uploadError } = await supabase.storage
      .from('job-photos')
      .upload(stagingPath, correctedFile, { contentType: photoType })

    if (uploadError) {
      setError('Photo upload failed. Please try again.')
      setIsSubmitting(false)
      return
    }

    const res = await fetch('/api/step-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stagingPath,
        projectId: job.project_id,
        jobId,
        stepId: selectedStep,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setError(body?.error ?? 'Photo upload failed. Please try again.')
      setIsSubmitting(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push(`/technician/jobs/${job.id}`)
    }, 1500)
  }

  const handleMarkComplete = async () => {
    if (!selectedStep || !user) return
    setIsMarkingComplete(true)
    setCompleteError(null)
    setCompleteSuccess(false)

    const { error: updateError } = await updateStepCompletion(selectedStep, true, user.id)

    if (updateError) {
      setCompleteError('Failed to mark step complete. Please try again.')
      setIsMarkingComplete(false)
      return
    }

    setJob((prev) =>
      prev
        ? {
            ...prev,
            procedure_steps: prev.procedure_steps.map((s) =>
              s.id === selectedStep ? { ...s, completed: true } : s
            ),
          }
        : prev
    )
    setSelectedStep('')
    setCompleteSuccess(true)
    setIsMarkingComplete(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!job) return null

  const incompleteSteps = job.procedure_steps.filter((s) => !s.completed)
  const currentStep = job.procedure_steps.find((s) => s.id === selectedStep)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/technician/jobs/${job.id}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Add Work</h1>
          <p className="text-sm text-muted-foreground">{job.title}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Photo uploaded successfully.
        </div>
      )}

      {completeError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{completeError}</div>
      )}

      {completeSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Step marked complete.
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif"
        className="hidden"
        onChange={handleFileChange}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Procedure Step</CardTitle></CardHeader>
          <CardContent>
            <Select
              value={selectedStep}
              onValueChange={(v) => {
                setSelectedStep(v)
                setCompleteError(null)
                setCompleteSuccess(false)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the step you worked on..." />
              </SelectTrigger>
              <SelectContent>
                {incompleteSteps.length === 0
                  ? <SelectItem value="_none" disabled>All steps completed</SelectItem>
                  : incompleteSteps.map((step) => {
                    const originalIndex = job.procedure_steps.findIndex((s) => s.id === step.id)
                    return (
                      <SelectItem key={step.id} value={step.id}>
                        Step {originalIndex + 1}: {step.title}
                      </SelectItem>
                    )
                  })
                }
              </SelectContent>
            </Select>

            {currentStep && (
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                <div className="mt-2 space-y-1">
                  {currentStep.sub_steps.map((ss) => (
                    <div key={ss.id} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={ss.completed} disabled className="h-3.5 w-3.5" />
                      <span>{ss.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Photo <span className="text-destructive">*</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Take or upload a photo of the completed work</p>
          </CardHeader>
          <CardContent>
            {!photoPreview ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.setAttribute('capture', 'environment')
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Camera className="h-6 w-6" />
                  <span>Take Photo</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.removeAttribute('capture')
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Upload className="h-6 w-6" />
                  <span>Upload</span>
                </Button>
              </div>
            ) : (
              <div className="relative">
                <img src={photoPreview} alt="Work photo" className="aspect-video w-full rounded-lg object-cover" />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                  onClick={clearPhoto}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedStep && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Mark step as complete</p>
                  <p className="text-sm text-muted-foreground">
                    Independent of the photo above — finishes this step for the job.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMarkComplete}
                  disabled={isMarkingComplete}
                >
                  {isMarkingComplete ? 'Marking...' : 'Mark Complete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link href={`/technician/jobs/${job.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" className="flex-1" disabled={!photoFile || !photoType || !selectedStep || isSubmitting}>
            {success ? 'Saved' : isSubmitting ? 'Saving...' : 'Save Work'}
          </Button>
        </div>
      </form>
    </div>
  )
}
