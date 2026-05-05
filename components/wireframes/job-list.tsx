import { DesktopSidebar } from "./shared/desktop-sidebar"

export function JobListWireframe() {
  return (
    <div className="min-h-[700px] flex">
      {/* Sidebar */}
      <DesktopSidebar activeItem="Jobs" role="pm" />

      {/* Main Content */}
      <main className="flex-1 bg-muted p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Jobs</h1>
            <p className="text-sm text-muted-foreground">View jobs across all projects</p>
          </div>
          <button className="h-10 px-4 bg-primary text-primary-foreground rounded-md font-medium text-sm flex items-center gap-2">
            <span>+</span> Create Job
          </button>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search jobs..."
                className="h-10 w-full bg-background border border-input rounded-md px-3 text-sm"
              />
            </div>

            {/* Project Filter */}
            <select className="h-10 px-3 text-sm border border-input rounded-md bg-background text-foreground">
              <option>All Projects</option>
              <option>Downtown Office Tower</option>
              <option>Riverside Mall Expansion</option>
              <option>Central Hospital Wing</option>
              <option>Harbor View Condos</option>
            </select>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                All (47)
              </button>
              <button className="h-9 px-4 bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-sm font-medium">
                In Progress (18)
              </button>
              <button className="h-9 px-4 bg-amber-100 text-amber-700 border border-amber-200 rounded-md text-sm font-medium">
                On Hold (6)
              </button>
              <button className="h-9 px-4 bg-green-100 text-green-700 border border-green-200 rounded-md text-sm font-medium">
                Completed (23)
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Job Title</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Project</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Assigned To</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Progress</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: "Floor 2 - Electrical Install", project: "Downtown Office Tower", tech: "Mike Chen, Lisa Wong", progress: 60, status: "In Progress" },
                { title: "Floor 3 - Electrical Install", project: "Downtown Office Tower", tech: "James Rodriguez", progress: 30, status: "In Progress" },
                { title: "HVAC System Setup", project: "Downtown Office Tower", tech: "Unassigned", progress: 20, status: "On Hold" },
                { title: "Lobby Wiring", project: "Riverside Mall Expansion", tech: "Lisa Wong", progress: 45, status: "In Progress" },
                { title: "Food Court Electrical", project: "Riverside Mall Expansion", tech: "Mike Chen", progress: 10, status: "In Progress" },
                { title: "Emergency Lighting", project: "Central Hospital Wing", tech: "James Rodriguez", progress: 100, status: "Completed" },
                { title: "ICU Monitoring Setup", project: "Central Hospital Wing", tech: "Mike Chen", progress: 85, status: "In Progress" },
              ].map((job, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">{job.title}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-primary hover:underline cursor-pointer">{job.project}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{job.tech}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[100px]">
                        <div
                          className={`h-full rounded-full ${
                            job.progress === 100 ? "bg-green-500" : "bg-primary"
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{job.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
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
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs text-primary hover:underline mr-3">View</button>
                    <button className="text-xs text-muted-foreground hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1-7 of 47 jobs</p>
          <div className="flex gap-1">
            <button className="h-8 w-8 border border-border rounded-md text-muted-foreground">{"<"}</button>
            <button className="h-8 w-8 bg-primary text-primary-foreground rounded-md">1</button>
            <button className="h-8 w-8 border border-border rounded-md text-foreground">2</button>
            <button className="h-8 w-8 border border-border rounded-md text-foreground">3</button>
            <button className="h-8 w-8 border border-border rounded-md text-foreground">...</button>
            <button className="h-8 w-8 border border-border rounded-md text-foreground">7</button>
            <button className="h-8 w-8 border border-border rounded-md text-muted-foreground">{">"}</button>
          </div>
        </div>

        {/* Annotation */}
        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          <strong>Wireframe Note:</strong> Jobs are now shown with their parent Project. Clicking the project name navigates to Project Detail. 
          The Create Job button opens a form where the user must select a project first. Jobs cannot exist without a project.
        </div>
      </main>
    </div>
  )
}
