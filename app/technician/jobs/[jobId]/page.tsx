'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getJobById, getProjectByJobId, calculateJobCompletion } from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Plus,
  Camera,
  CheckCircle2,
} from 'lucide-react'

export default function TechnicianJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = use(params)
  const job = getJobById(jobId)
  const project = getProjectByJobId(jobId)

  if (!job || !project) {
    notFound()
  }

  const completion = calculateJobCompletion(job)
  const completedSteps = job.procedureSteps.filter((s) => s.completed).length
  const totalHours = job.hoursTracked.reduce((sum, h) => sum + h.hours, 0)

  const statusColors = {
    in_progress: 'bg-blue-500/10 text-blue-600',
    on_hold: 'bg-amber-500/10 text-amber-600',
    completed: 'bg-green-500/10 text-green-600',
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/technician/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{job.title}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{project.name}</p>
        </div>
        <Badge variant="secondary" className={statusColors[job.status]}>
          {job.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Quick Info */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {totalHours.toFixed(1)}h logged
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps}/{job.procedureSteps.length} steps
            </span>
          </div>
          <Progress value={completion} className="h-2" />
          <p className="mt-2 text-center text-2xl font-bold">{completion}%</p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {job.status === 'in_progress' && (
        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="h-12">
            <Link href={`/technician/jobs/${job.id}/add-work`}>
              <Camera className="mr-2 h-4 w-4" />
              Add Work
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-12">
            <Link href={`/technician/jobs/${job.id}/expense`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Link>
          </Button>
        </div>
      )}

      {/* Procedure Steps */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Procedure Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {job.procedureSteps.map((step, index) => (
            <div
              key={step.id}
              className={`rounded-lg border p-3 ${step.completed ? 'bg-green-500/5 border-green-500/20' : ''}`}
            >
              <div className="flex items-start gap-3">
                {step.completed ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                ) : (
                  <Checkbox disabled className="mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Step {index + 1}
                    </span>
                    <span className="font-medium">{step.title}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>

                  {/* Sub-steps */}
                  <div className="mt-2 space-y-1">
                    {step.subSteps.map((subStep) => (
                      <div
                        key={subStep.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox checked={subStep.completed} disabled className="h-3.5 w-3.5" />
                        <span
                          className={
                            subStep.completed ? 'text-muted-foreground line-through' : ''
                          }
                        >
                          {subStep.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {step.completed && step.completedAt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Completed {new Date(step.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Time Entries */}
      {job.hoursTracked.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Time Entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {job.hoursTracked.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
                <span className="font-medium">{entry.hours}h</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
