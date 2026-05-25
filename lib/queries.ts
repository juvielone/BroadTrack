// Pure computation helpers shared across pages

export function computeHoursFromSessions(
  sessions: { start_time: string | null; end_time: string | null }[]
): number {
  return sessions.reduce((sum, s) => {
    if (!s.start_time || !s.end_time) return sum
    return sum + (new Date(s.end_time).getTime() - new Date(s.start_time).getTime()) / 3_600_000
  }, 0)
}

export function computeJobCompletion(steps: { completed: boolean }[]): number {
  if (!steps.length) return 0
  return Math.round((steps.filter((s) => s.completed).length / steps.length) * 100)
}

export function computeProjectCompletion(jobs: { status: string }[]): number {
  if (!jobs.length) return 0
  return Math.round((jobs.filter((j) => j.status === 'completed').length / jobs.length) * 100)
}
