'use client'

import { getTechnicianProjects } from '@/lib/mockData'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export default function TechnicianTimePage() {
  const { user } = useAuthStore()
  const projects = user ? getTechnicianProjects(user.id) : []

  const allHours = projects.flatMap((p) =>
    p.jobs
      .filter((j) => user && j.assignedTechnicians.includes(user.id))
      .flatMap((j) =>
        j.hoursTracked
          .filter((h) => h.technicianId === user?.id)
          .map((h) => ({ ...h, jobTitle: j.title, projectName: p.name }))
      )
  )

  const totalHours = allHours.reduce((sum, h) => sum + h.hours, 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Time Tracking</h1>
        <p className="text-sm text-muted-foreground">Your logged hours</p>
      </div>

      {/* Total Hours */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
          </div>
        </CardContent>
      </Card>

      {/* Time Entries */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {allHours.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hours logged yet</p>
          ) : (
            allHours.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{entry.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.jobTitle} &middot; {entry.projectName}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
                <span className="text-lg font-semibold">{entry.hours}h</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
