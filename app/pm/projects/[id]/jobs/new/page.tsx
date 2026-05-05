'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectById, mockUsers } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2, GripVertical, ChevronRight } from 'lucide-react'

interface SubStep {
  id: string
  title: string
}

interface ProcedureStep {
  id: string
  title: string
  description: string
  subSteps: SubStep[]
}

export default function CreateJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const project = getProjectById(id)
  const router = useRouter()

  if (!project) {
    notFound()
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [steps, setSteps] = useState<ProcedureStep[]>([
    {
      id: '1',
      title: '',
      description: '',
      subSteps: [{ id: '1-1', title: '' }],
    },
  ])

  const technicians = mockUsers.filter((u) => u.role === 'technician')

  const addStep = () => {
    const newId = String(steps.length + 1)
    setSteps([
      ...steps,
      {
        id: newId,
        title: '',
        description: '',
        subSteps: [{ id: `${newId}-1`, title: '' }],
      },
    ])
  }

  const removeStep = (stepId: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((s) => s.id !== stepId))
    }
  }

  const addSubStep = (stepId: string) => {
    setSteps(
      steps.map((step) => {
        if (step.id === stepId) {
          const newSubId = `${stepId}-${step.subSteps.length + 1}`
          return {
            ...step,
            subSteps: [...step.subSteps, { id: newSubId, title: '' }],
          }
        }
        return step
      })
    )
  }

  const removeSubStep = (stepId: string, subStepId: string) => {
    setSteps(
      steps.map((step) => {
        if (step.id === stepId && step.subSteps.length > 1) {
          return {
            ...step,
            subSteps: step.subSteps.filter((ss) => ss.id !== subStepId),
          }
        }
        return step
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push(`/pm/projects/${project.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/pm/projects" className="hover:text-foreground">
          Projects
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/pm/projects/${project.id}`} className="hover:text-foreground">
          {project.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">New Job</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/pm/projects/${project.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Job</h1>
          <p className="text-muted-foreground">Add a new job to {project.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" placeholder="e.g., Building A - Floors 1-5" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the job scope..."
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Building A, Level 3"
                  defaultValue={project.location}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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

        {/* Procedure Steps */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Procedure Steps</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                <Plus className="mr-2 h-4 w-4" />
                Add Step
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
                        onChange={(e) =>
                          setSteps(
                            steps.map((s) =>
                              s.id === step.id ? { ...s, title: e.target.value } : s
                            )
                          )
                        }
                      />
                      {steps.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStep(step.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      placeholder="Step description (optional)..."
                      rows={2}
                      value={step.description}
                      onChange={(e) =>
                        setSteps(
                          steps.map((s) =>
                            s.id === step.id ? { ...s, description: e.target.value } : s
                          )
                        )
                      }
                    />

                    {/* Sub-steps */}
                    <div className="space-y-2 pl-4">
                      <p className="text-sm font-medium text-muted-foreground">Sub-steps</p>
                      {step.subSteps.map((subStep) => (
                        <div key={subStep.id} className="flex items-center gap-2">
                          <Checkbox disabled className="h-4 w-4" />
                          <Input
                            placeholder="Sub-step title..."
                            className="flex-1"
                            value={subStep.title}
                            onChange={(e) =>
                              setSteps(
                                steps.map((s) =>
                                  s.id === step.id
                                    ? {
                                        ...s,
                                        subSteps: s.subSteps.map((ss) =>
                                          ss.id === subStep.id
                                            ? { ...ss, title: e.target.value }
                                            : ss
                                        ),
                                      }
                                    : s
                                )
                              )
                            }
                          />
                          {step.subSteps.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeSubStep(step.id, subStep.id)}
                            >
                              <Trash2 className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => addSubStep(step.id)}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add sub-step
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assign Technicians */}
        <Card>
          <CardHeader>
            <CardTitle>Assign Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {technicians.map((tech) => (
                <label
                  key={tech.id}
                  className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox id={tech.id} />
                  <div>
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-sm text-muted-foreground">{tech.email}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
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
