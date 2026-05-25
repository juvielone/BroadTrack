'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2, GripVertical, ChevronRight } from 'lucide-react'

interface SubStep { id: string; title: string }
interface ProcedureStep { id: string; title: string; description: string; subSteps: SubStep[] }
type Technician = { id: string; name: string; email: string }
type Project = { id: string; name: string; location: string }

export default function CreateJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundFlag, setNotFoundFlag] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [priority, setPriority] = useState('medium')
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set())
  const [steps, setSteps] = useState<ProcedureStep[]>([
    { id: '1', title: '', description: '', subSteps: [{ id: '1-1', title: '' }] },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const [projectRes, techRes] = await Promise.all([
        supabase.from('projects').select('id, name, location').eq('id', id).single(),
        supabase.from('users').select('id, name, email').eq('role', 'technician').order('name'),
      ])
      if (!projectRes.data) { setNotFoundFlag(true); return }
      setProject(projectRes.data as Project)
      setLocation(projectRes.data.location ?? '')
      setTechnicians((techRes.data as Technician[]) ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  if (notFoundFlag) notFound()

  const addStep = () => {
    const newId = String(Date.now())
    setSteps((prev) => [...prev, { id: newId, title: '', description: '', subSteps: [{ id: `${newId}-1`, title: '' }] }])
  }

  const removeStep = (stepId: string) => {
    if (steps.length > 1) setSteps((prev) => prev.filter((s) => s.id !== stepId))
  }

  const addSubStep = (stepId: string) => {
    setSteps((prev) => prev.map((step) =>
      step.id === stepId
        ? { ...step, subSteps: [...step.subSteps, { id: `${stepId}-${Date.now()}`, title: '' }] }
        : step
    ))
  }

  const removeSubStep = (stepId: string, subStepId: string) => {
    setSteps((prev) => prev.map((step) =>
      step.id === stepId && step.subSteps.length > 1
        ? { ...step, subSteps: step.subSteps.filter((ss) => ss.id !== subStepId) }
        : step
    ))
  }

  const toggleTech = (userId: string) => {
    setSelectedTechs((prev) => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return
    setIsSubmitting(true)
    setError(null)

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({ project_id: id, title: title.trim(), description: description.trim() || null, location: location.trim(), priority, status: 'in_progress' })
      .select('id')
      .single()

    if (jobError || !job) {
      setError('Failed to create job. Please try again.')
      setIsSubmitting(false)
      return
    }

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      if (!step.title.trim()) continue

      const { data: stepData } = await supabase
        .from('procedure_steps')
        .insert({ job_id: job.id, title: step.title.trim(), description: step.description.trim() || null, sort_order: i, completed: false })
        .select('id')
        .single()

      if (!stepData) continue

      const validSubSteps = step.subSteps.filter((ss) => ss.title.trim())
      if (validSubSteps.length > 0) {
        await supabase.from('sub_steps').insert(
          validSubSteps.map((ss) => ({ step_id: stepData.id, title: ss.title.trim(), completed: false }))
        )
      }
    }

    if (selectedTechs.size > 0) {
      await supabase.from('job_assignments').insert(
        [...selectedTechs].map((userId) => ({ job_id: job.id, user_id: userId }))
      )
    }

    router.push(`/pm/projects/${id}/jobs/${job.id}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/pm/projects" className="hover:text-foreground">Projects</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/pm/projects/${project.id}`} className="hover:text-foreground">{project.name}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">New Job</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/pm/projects/${project.id}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Job</h1>
          <p className="text-muted-foreground">Add a new job to {project.name}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" placeholder="e.g., Building A - Floors 1-5" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Brief description of the job scope..." rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" placeholder="e.g., Building A, Level 3" required value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Procedure Steps</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                <Plus className="mr-2 h-4 w-4" />Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, stepIndex) => (
              <div key={step.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start gap-3">
                  <GripVertical className="mt-2 h-4 w-4 cursor-move text-muted-foreground" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {stepIndex + 1}
                      </span>
                      <Input
                        placeholder="Step title..."
                        className="flex-1"
                        value={step.title}
                        onChange={(e) => setSteps((prev) => prev.map((s) => s.id === step.id ? { ...s, title: e.target.value } : s))}
                      />
                      {steps.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeStep(step.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      placeholder="Step description (optional)..."
                      rows={2}
                      value={step.description}
                      onChange={(e) => setSteps((prev) => prev.map((s) => s.id === step.id ? { ...s, description: e.target.value } : s))}
                    />
                    <div className="space-y-2 pl-4">
                      <p className="text-sm font-medium text-muted-foreground">Sub-steps</p>
                      {step.subSteps.map((subStep) => (
                        <div key={subStep.id} className="flex items-center gap-2">
                          <Checkbox disabled className="h-4 w-4" />
                          <Input
                            placeholder="Sub-step title..."
                            className="flex-1"
                            value={subStep.title}
                            onChange={(e) => setSteps((prev) => prev.map((s) =>
                              s.id === step.id
                                ? { ...s, subSteps: s.subSteps.map((ss) => ss.id === subStep.id ? { ...ss, title: e.target.value } : ss) }
                                : s
                            ))}
                          />
                          {step.subSteps.length > 1 && (
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSubStep(step.id, subStep.id)}>
                              <Trash2 className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => addSubStep(step.id)}>
                        <Plus className="mr-1 h-3 w-3" />Add sub-step
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Assign Technicians</CardTitle></CardHeader>
          <CardContent>
            {technicians.length === 0 ? (
              <p className="text-sm text-muted-foreground">No technicians available</p>
            ) : (
              <div className="space-y-3">
                {technicians.map((tech) => (
                  <label key={tech.id} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50">
                    <Checkbox
                      checked={selectedTechs.has(tech.id)}
                      onCheckedChange={() => toggleTech(tech.id)}
                    />
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-muted-foreground">{tech.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/pm/projects/${project.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Job'}
          </Button>
        </div>
      </form>
    </div>
  )
}
