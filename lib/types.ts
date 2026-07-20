export type UserRole = 'pm' | 'technician' | 'finance' | 'admin'

export interface AppUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatar_url?: string
}

export type ProjectStatus = 'active' | 'on_hold' | 'completed'
export type JobStatus     = 'in_progress' | 'on_hold' | 'completed'
export type JobPriority   = 'low' | 'medium' | 'high'
export type ExpenseStatus = 'pending' | 'approved' | 'rejected'
export type SessionStatus = 'pending_approval' | 'active' | 'ended'

export interface Project {
  id: string
  name: string
  description: string | null
  location: string
  customer: string
  customer_contact: string | null
  customer_email: string | null
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  project_id: string
  title: string
  description: string | null
  location: string | null
  status: JobStatus
  priority: JobPriority
  on_hold_reason: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface ProcedureStep {
  id: string
  job_id: string
  title: string
  description: string | null
  completed: boolean
  completed_at: string | null
  completed_by: string | null
  photo_url: string | null
  sort_order: number
}

export interface SubStep {
  id: string
  step_id: string
  title: string
  completed: boolean
  sort_order: number
}

export interface StepPhoto {
  id: string
  step_id: string
  url: string
  created_at: string
}

export interface Expense {
  id: string
  job_id: string
  submitted_by: string
  amount: number
  description: string
  receipt_url: string
  status: ExpenseStatus
  rejection_reason: string | null
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
}

export interface TimeSession {
  id: string
  job_id: string
  technician_id: string
  approved_by: string | null
  start_time: string | null
  end_time: string | null
  status: SessionStatus
}
