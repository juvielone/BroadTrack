'use client'

import { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Camera, Upload, X } from 'lucide-react'

type SubStep = { id: string; title: string; completed: boolean }
type Step = { id: string; title: string; description: string | null; completed: boolean; sub_steps: SubStep[] }
type Job = { id: string; title: string; procedure_steps: Step[] }

export default function AddWorkPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const { user } = useAuthStore()
  const router = useRouter()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStep, setSelectedStep] = useState('')
  const [markComplete, setMarkComplete] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, procedure_steps(id, title, description, completed, sub_steps(id, title, completed))')
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
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job || !photoFile || !selectedStep || !user) return
    setIsSubmitting(true)
    setError(null)

    const ext = photoFile.name.split('.').pop() ?? 'jpg'
    const path = `${jobId}/${selectedStep}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('job-photos')
      .upload(path, photoFile, { contentType: photoFile.type })

    if (uploadError) {
      setError('Photo upload failed. Please try again.')
      setIsSubmitting(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('job-photos').getPublicUrl(path)

    const update: Record<string, unknown> = { photo_url: publicUrl }
    if (markComplete) {
      update.completed = true
      update.completed_at = new Date().toISOString()
      update.completed_by = user.id
    }

    await supabase.from('procedure_steps').update(update).eq('id', selectedStep)
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Procedure Step</CardTitle></CardHeader>
          <CardContent>
            <Select value={selectedStep} onValueChange={setSelectedStep}>
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
              <label className="flex cursor-pointer items-start gap-3">
                <Checkbox
                  checked={markComplete}
                  onCheckedChange={(v) => setMarkComplete(v as boolean)}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium">Mark step as complete</p>
                  <p className="text-sm text-muted-foreground">Check this if all sub-steps are finished</p>
                </div>
              </label>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link href={`/technician/jobs/${job.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" className="flex-1" disabled={!photoFile || !selectedStep || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Work'}
          </Button>
        </div>
      </form>
    </div>
  )
}
