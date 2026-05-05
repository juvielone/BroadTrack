import { DesktopSidebar } from "./shared/desktop-sidebar"

export function PMDashboardWireframe() {
  return (
    <div className="min-h-[700px] flex">
      {/* Sidebar */}
      <DesktopSidebar activeItem="Dashboard" role="pm" />

      {/* Main Content */}
      <main className="flex-1 bg-muted p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">PM Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Sarah</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Active Projects</p>
            <p className="text-2xl font-bold text-foreground mt-1">8</p>
            <p className="text-xs text-muted-foreground mt-1">+2 this month</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Jobs</p>
            <p className="text-2xl font-bold text-foreground mt-1">47</p>
            <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Jobs In Progress</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">12</p>
            <p className="text-xs text-muted-foreground mt-1">Active work</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Pending Reimbursements</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">$1,250</p>
            <p className="text-xs text-muted-foreground mt-1">6 pending</p>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-card-foreground">Active Projects</h2>
            <span className="text-xs text-primary cursor-pointer hover:underline">View All Projects</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Downtown Office Tower", customer: "Acme Corp", completion: 65, jobs: "8/12", status: "Active" },
              { name: "Riverside Mall Expansion", customer: "Riverside LLC", completion: 25, jobs: "2/8", status: "Active" },
              { name: "Central Hospital Wing", customer: "Metro Health", completion: 80, jobs: "4/5", status: "Active" },
              { name: "Harbor View Condos", customer: "Harbor Dev", completion: 40, jobs: "2/5", status: "On Hold" },
            ].map((project, i) => (
              <div key={i} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.customer}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    project.status === "Active" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium text-foreground">{project.completion}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${project.status === "On Hold" ? "bg-amber-500" : "bg-primary"}`} 
                      style={{ width: `${project.completion}%` }} 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Jobs: {project.jobs} completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-card-foreground">Recent Jobs</h2>
              <span className="text-xs text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-3">
              {[
                { title: "Floor 2 - Electrical Install", project: "Downtown Office Tower", status: "In Progress", tech: "Mike C." },
                { title: "HVAC System Setup", project: "Downtown Office Tower", status: "On Hold", tech: "Unassigned" },
                { title: "Lobby Wiring", project: "Riverside Mall", status: "In Progress", tech: "Lisa W." },
                { title: "Emergency Lighting", project: "Central Hospital", status: "Completed", tech: "James R." },
              ].map((job, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.project} - {job.tech}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      job.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : job.status === "On Hold"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Reimbursements */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-card-foreground">Pending Reimbursements</h2>
              <span className="text-xs text-muted-foreground">6 pending</span>
            </div>
            <div className="space-y-3">
              {[
                { desc: "Cable supplies", amount: "$125.00", by: "Mike C.", project: "Downtown Office" },
                { desc: "Equipment rental", amount: "$350.00", by: "Lisa W.", project: "Riverside Mall" },
                { desc: "Safety gear", amount: "$89.50", by: "James R.", project: "Central Hospital" },
                { desc: "Fuel expense", amount: "$45.00", by: "Mike C.", project: "Downtown Office" },
              ].map((expense, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{expense.desc}</p>
                    <p className="text-xs text-muted-foreground">
                      {expense.by} - {expense.project}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{expense.amount}</p>
                    <div className="flex gap-1 mt-1">
                      <button className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded hover:bg-green-200">
                        Approve
                      </button>
                      <button className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded hover:bg-red-200">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Annotation */}
        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          <strong>Wireframe Note:</strong> Dashboard now shows Projects with completion % (auto-calculated from completed jobs / total jobs). 
          Clicking a project card navigates to Project Detail. Jobs are displayed with their parent project context.
        </div>
      </main>
    </div>
  )
}
