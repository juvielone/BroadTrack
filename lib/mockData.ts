// Types
export type UserRole = 'pm' | 'technician' | 'finance'

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  avatar?: string
}

export interface SubStep {
  id: string
  title: string
  completed: boolean
}

export interface ProcedureStep {
  id: string
  title: string
  description: string
  completed: boolean
  completedAt?: string
  completedBy?: string
  photoUrl?: string
  subSteps: SubStep[]
}

export interface HoursTracked {
  id: string
  technicianId: string
  technicianName: string
  hours: number
  date: string
  description: string
}

export type ExpenseStatus = 'pending' | 'approved' | 'rejected'

export interface Expense {
  id: string
  jobId: string
  technicianId: string
  technicianName: string
  amount: number
  description: string
  receiptUrl: string
  status: ExpenseStatus
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export type JobStatus = 'in_progress' | 'on_hold' | 'completed'

export interface Job {
  id: string
  projectId: string
  title: string
  description: string
  location: string
  status: JobStatus
  priority: 'low' | 'medium' | 'high'
  assignedTechnicians: string[]
  procedureSteps: ProcedureStep[]
  hoursTracked: HoursTracked[]
  expenses: Expense[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export type ProjectStatus = 'active' | 'on_hold' | 'completed'

export interface Project {
  id: string
  name: string
  description: string
  customer: string
  customerContact: string
  customerEmail: string
  location: string
  status: ProjectStatus
  jobs: Job[]
  createdAt: string
  updatedAt: string
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-pm-1',
    email: 'sarah.pm@broadtrack.com',
    password: 'password123',
    name: 'Sarah Mitchell',
    role: 'pm',
  },
  {
    id: 'user-tech-1',
    email: 'mike.tech@broadtrack.com',
    password: 'password123',
    name: 'Mike Chen',
    role: 'technician',
  },
  {
    id: 'user-finance-1',
    email: 'lisa.finance@broadtrack.com',
    password: 'password123',
    name: 'Lisa Thompson',
    role: 'finance',
  },
]

// Helper to create procedure steps
function createProcedureSteps(jobId: string, completedCount: number): ProcedureStep[] {
  const steps: ProcedureStep[] = [
    {
      id: `${jobId}-step-1`,
      title: 'Site Assessment',
      description: 'Conduct initial site survey and document existing infrastructure',
      completed: completedCount >= 1,
      completedAt: completedCount >= 1 ? '2024-01-15T10:30:00Z' : undefined,
      completedBy: completedCount >= 1 ? 'user-tech-1' : undefined,
      photoUrl: completedCount >= 1 ? '/photos/site-assessment.jpg' : undefined,
      subSteps: [
        { id: `${jobId}-step-1-sub-1`, title: 'Check existing cabling', completed: completedCount >= 1 },
        { id: `${jobId}-step-1-sub-2`, title: 'Document access points', completed: completedCount >= 1 },
        { id: `${jobId}-step-1-sub-3`, title: 'Take reference photos', completed: completedCount >= 1 },
      ],
    },
    {
      id: `${jobId}-step-2`,
      title: 'Cable Installation',
      description: 'Run new cables according to site plan specifications',
      completed: completedCount >= 2,
      completedAt: completedCount >= 2 ? '2024-01-16T14:45:00Z' : undefined,
      completedBy: completedCount >= 2 ? 'user-tech-1' : undefined,
      photoUrl: completedCount >= 2 ? '/photos/cable-install.jpg' : undefined,
      subSteps: [
        { id: `${jobId}-step-2-sub-1`, title: 'Route cables through conduits', completed: completedCount >= 2 },
        { id: `${jobId}-step-2-sub-2`, title: 'Secure cable runs', completed: completedCount >= 2 },
        { id: `${jobId}-step-2-sub-3`, title: 'Label all connections', completed: completedCount >= 2 },
      ],
    },
    {
      id: `${jobId}-step-3`,
      title: 'Testing & Certification',
      description: 'Test all connections and generate certification report',
      completed: completedCount >= 3,
      completedAt: completedCount >= 3 ? '2024-01-17T16:00:00Z' : undefined,
      completedBy: completedCount >= 3 ? 'user-tech-1' : undefined,
      photoUrl: completedCount >= 3 ? '/photos/testing.jpg' : undefined,
      subSteps: [
        { id: `${jobId}-step-3-sub-1`, title: 'Continuity test', completed: completedCount >= 3 },
        { id: `${jobId}-step-3-sub-2`, title: 'Signal strength test', completed: completedCount >= 3 },
        { id: `${jobId}-step-3-sub-3`, title: 'Generate certification', completed: completedCount >= 3 },
      ],
    },
  ]
  return steps
}

// Helper to create expenses
function createExpenses(jobId: string): Expense[] {
  return [
    {
      id: `${jobId}-expense-1`,
      jobId,
      technicianId: 'user-tech-1',
      technicianName: 'Mike Chen',
      amount: 85.50,
      description: 'Cable ties and mounting hardware from Bunnings',
      receiptUrl: '/receipts/bunnings-001.jpg',
      status: 'approved',
      submittedAt: '2024-01-15T12:00:00Z',
      reviewedAt: '2024-01-16T09:00:00Z',
      reviewedBy: 'user-finance-1',
    },
    {
      id: `${jobId}-expense-2`,
      jobId,
      technicianId: 'user-tech-1',
      technicianName: 'Mike Chen',
      amount: 42.00,
      description: 'Parking fees - site visit',
      receiptUrl: '/receipts/parking-001.jpg',
      status: 'pending',
      submittedAt: '2024-01-17T08:30:00Z',
    },
  ]
}

// Helper to create hours tracked
function createHoursTracked(jobId: string): HoursTracked[] {
  return [
    {
      id: `${jobId}-hours-1`,
      technicianId: 'user-tech-1',
      technicianName: 'Mike Chen',
      hours: 4.5,
      date: '2024-01-15',
      description: 'Site assessment and planning',
    },
    {
      id: `${jobId}-hours-2`,
      technicianId: 'user-tech-1',
      technicianName: 'Mike Chen',
      hours: 6.0,
      date: '2024-01-16',
      description: 'Cable installation',
    },
    {
      id: `${jobId}-hours-3`,
      technicianId: 'user-tech-1',
      technicianName: 'Mike Chen',
      hours: 3.0,
      date: '2024-01-17',
      description: 'Testing and certification',
    },
  ]
}

// Mock Projects with Jobs
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Lane Cove MDU Install',
    description: 'Multi-dwelling unit fiber installation for residential complex',
    customer: 'Lane Cove Property Group',
    customerContact: 'John Williams',
    customerEmail: 'j.williams@lanecovepg.com.au',
    location: '42 Longueville Road, Lane Cove NSW 2066',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z',
    jobs: [
      {
        id: 'job-1-1',
        projectId: 'project-1',
        title: 'Building A - Floors 1-5',
        description: 'Install fiber to all units on floors 1-5 of Building A',
        location: 'Building A, 42 Longueville Road',
        status: 'completed',
        priority: 'high',
        assignedTechnicians: ['user-tech-1'],
        procedureSteps: createProcedureSteps('job-1-1', 3),
        hoursTracked: createHoursTracked('job-1-1'),
        expenses: createExpenses('job-1-1'),
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-17T00:00:00Z',
        completedAt: '2024-01-17T16:00:00Z',
      },
      {
        id: 'job-1-2',
        projectId: 'project-1',
        title: 'Building A - Floors 6-10',
        description: 'Install fiber to all units on floors 6-10 of Building A',
        location: 'Building A, 42 Longueville Road',
        status: 'in_progress',
        priority: 'high',
        assignedTechnicians: ['user-tech-1'],
        procedureSteps: createProcedureSteps('job-1-2', 1),
        hoursTracked: [createHoursTracked('job-1-2')[0]],
        expenses: [createExpenses('job-1-2')[1]],
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-18T00:00:00Z',
      },
      {
        id: 'job-1-3',
        projectId: 'project-1',
        title: 'Building B - Common Areas',
        description: 'Install network infrastructure in common areas of Building B',
        location: 'Building B, 42 Longueville Road',
        status: 'on_hold',
        priority: 'medium',
        assignedTechnicians: ['user-tech-1'],
        procedureSteps: createProcedureSteps('job-1-3', 0),
        hoursTracked: [],
        expenses: [],
        createdAt: '2024-01-12T00:00:00Z',
        updatedAt: '2024-01-14T00:00:00Z',
      },
    ],
  },
  {
    id: 'project-2',
    name: 'Chatswood Cabling',
    description: 'Commercial office cabling upgrade and modernization',
    customer: 'Chatswood Business Park',
    customerContact: 'Emma Davis',
    customerEmail: 'emma.davis@chatswoodbp.com.au',
    location: '100 Victoria Avenue, Chatswood NSW 2067',
    status: 'active',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    jobs: [
      {
        id: 'job-2-1',
        projectId: 'project-2',
        title: 'Level 3 - Open Plan Office',
        description: 'Complete cabling upgrade for open plan office area',
        location: 'Level 3, 100 Victoria Avenue',
        status: 'in_progress',
        priority: 'high',
        assignedTechnicians: ['user-tech-1'],
        procedureSteps: createProcedureSteps('job-2-1', 2),
        hoursTracked: createHoursTracked('job-2-1').slice(0, 2),
        expenses: createExpenses('job-2-1'),
        createdAt: '2024-01-06T00:00:00Z',
        updatedAt: '2024-01-18T00:00:00Z',
      },
      {
        id: 'job-2-2',
        projectId: 'project-2',
        title: 'Level 3 - Meeting Rooms',
        description: 'Install AV and data cabling in 4 meeting rooms',
        location: 'Level 3, 100 Victoria Avenue',
        status: 'completed',
        priority: 'medium',
        assignedTechnicians: ['user-tech-1'],
        procedureSteps: createProcedureSteps('job-2-2', 3),
        hoursTracked: createHoursTracked('job-2-2'),
        expenses: [
          {
            id: 'job-2-2-expense-1',
            jobId: 'job-2-2',
            technicianId: 'user-tech-1',
            technicianName: 'Mike Chen',
            amount: 156.00,
            description: 'HDMI cables and wall plates',
            receiptUrl: '/receipts/av-supplies.jpg',
            status: 'approved',
            submittedAt: '2024-01-14T10:00:00Z',
            reviewedAt: '2024-01-15T09:00:00Z',
            reviewedBy: 'user-finance-1',
          },
          {
            id: 'job-2-2-expense-2',
            jobId: 'job-2-2',
            technicianId: 'user-tech-1',
            technicianName: 'Mike Chen',
            amount: 28.50,
            description: 'Lunch on site',
            receiptUrl: '/receipts/lunch.jpg',
            status: 'rejected',
            submittedAt: '2024-01-14T14:00:00Z',
            reviewedAt: '2024-01-15T09:30:00Z',
            reviewedBy: 'user-finance-1',
          },
        ],
        createdAt: '2024-01-08T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        completedAt: '2024-01-15T17:00:00Z',
      },
      {
        id: 'job-2-3',
        projectId: 'project-2',
        title: 'Server Room Upgrade',
        description: 'Upgrade server room cabling and patch panels',
        location: 'Level 1, 100 Victoria Avenue',
        status: 'in_progress',
        priority: 'high',
        assignedTechnicians: ['user-tech-1'],
        procedureSteps: createProcedureSteps('job-2-3', 1),
        hoursTracked: [createHoursTracked('job-2-3')[0]],
        expenses: [
          {
            id: 'job-2-3-expense-1',
            jobId: 'job-2-3',
            technicianId: 'user-tech-1',
            technicianName: 'Mike Chen',
            amount: 320.00,
            description: 'Patch panel and rack accessories',
            receiptUrl: '/receipts/server-supplies.jpg',
            status: 'pending',
            submittedAt: '2024-01-17T16:00:00Z',
          },
        ],
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-18T00:00:00Z',
      },
    ],
  },
]

// Helper functions
export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id)
}

export function getJobById(jobId: string): Job | undefined {
  for (const project of mockProjects) {
    const job = project.jobs.find((j) => j.id === jobId)
    if (job) return job
  }
  return undefined
}

export function getProjectByJobId(jobId: string): Project | undefined {
  return mockProjects.find((p) => p.jobs.some((j) => j.id === jobId))
}

export function calculateProjectCompletion(project: Project): number {
  if (project.jobs.length === 0) return 0
  const completedJobs = project.jobs.filter((j) => j.status === 'completed').length
  return Math.round((completedJobs / project.jobs.length) * 100)
}

export function calculateJobCompletion(job: Job): number {
  if (job.procedureSteps.length === 0) return 0
  const completedSteps = job.procedureSteps.filter((s) => s.completed).length
  return Math.round((completedSteps / job.procedureSteps.length) * 100)
}

export function getTechnicianJobs(technicianId: string): Job[] {
  const jobs: Job[] = []
  for (const project of mockProjects) {
    for (const job of project.jobs) {
      if (job.assignedTechnicians.includes(technicianId)) {
        jobs.push(job)
      }
    }
  }
  return jobs
}

export function getTechnicianProjects(technicianId: string): Project[] {
  return mockProjects.filter((project) =>
    project.jobs.some((job) => job.assignedTechnicians.includes(technicianId))
  )
}

export function getAllExpenses(): Expense[] {
  const expenses: Expense[] = []
  for (const project of mockProjects) {
    for (const job of project.jobs) {
      expenses.push(...job.expenses)
    }
  }
  return expenses
}

export function getExpensesByStatus(status: ExpenseStatus): Expense[] {
  return getAllExpenses().filter((e) => e.status === status)
}

export function getTotalExpensesByStatus(): { pending: number; approved: number; rejected: number } {
  const expenses = getAllExpenses()
  return {
    pending: expenses.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0),
    approved: expenses.filter((e) => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0),
    rejected: expenses.filter((e) => e.status === 'rejected').reduce((sum, e) => sum + e.amount, 0),
  }
}

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((u) => u.email === email)
}

export function authenticateUser(email: string, password: string): User | null {
  const user = mockUsers.find((u) => u.email === email && u.password === password)
  return user || null
}
