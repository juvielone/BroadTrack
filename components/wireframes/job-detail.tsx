import { DesktopSidebar } from "./shared/desktop-sidebar"

export function JobDetailWireframe() {
  return (
    <div className="min-h-[700px] flex">
      {/* Sidebar */}
      <DesktopSidebar activeItem="Jobs" role="pm" />

      {/* Main Content */}
      <main className="flex-1 bg-muted p-6 overflow-y-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="cursor-pointer hover:underline text-primary">Projects</span>
            {" / "}
            <span className="cursor-pointer hover:underline text-primary">Downtown Office Tower</span>
            {" / "}
            <span>Floor 2 - Electrical Install</span>
          </p>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Floor 2 - Electrical Install</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Project: <span className="text-primary cursor-pointer hover:underline">Downtown Office Tower</span> 
                {" | "}Created May 1, 2026
              </p>
            </div>
            <div className="flex gap-2">
              <select className="h-9 px-3 text-sm border border-input rounded-md bg-background text-foreground">
                <option>In Progress</option>
                <option>On Hold</option>
                <option>Completed</option>
              </select>
              <button className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                Close Job
              </button>
            </div>
          </div>
        </div>

        {/* Job Info Cards Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="text-lg font-semibold text-blue-600 mt-1">In Progress</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-lg font-semibold text-foreground mt-1">6 of 10 steps</p>
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary rounded-full" style={{ width: "60%" }} />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-lg font-semibold text-foreground mt-1">18h 30m</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-semibold text-foreground mt-1">$650.00</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Procedure Steps */}
          <div className="col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="font-semibold text-card-foreground mb-2">Job Description</h2>
              <p className="text-sm text-muted-foreground">
                Complete electrical installation for Floor 2 of the Downtown Office Tower. Includes running conduit, 
                installing outlets, switches, and lighting fixtures per approved blueprints.
              </p>
            </div>

            {/* Procedure Steps */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-card-foreground">Procedure Steps</h2>
                <span className="text-sm text-muted-foreground">6 of 10 complete</span>
              </div>
              <div className="space-y-3">
                {[
                  { step: "1", title: "Site preparation & safety check", status: "done", by: "Mike C.", date: "May 2" },
                  { step: "2", title: "Run main conduit from panel", status: "done", by: "Mike C.", date: "May 2" },
                  { step: "3", title: "Install junction boxes", status: "done", by: "Lisa W.", date: "May 3" },
                  { step: "4", title: "Pull wire through conduit", status: "done", by: "Mike C.", date: "May 3" },
                  { step: "5", title: "Install outlets - North wing", status: "done", by: "Lisa W.", date: "May 4" },
                  { step: "6", title: "Install outlets - South wing", status: "done", by: "Mike C.", date: "May 4" },
                  { step: "7", title: "Install switches", status: "pending", by: "—", date: "—" },
                  { step: "8", title: "Install lighting fixtures", status: "pending", by: "—", date: "—" },
                  { step: "9", title: "Connect to main panel", status: "pending", by: "—", date: "—" },
                  { step: "10", title: "Final testing & inspection", status: "pending", by: "—", date: "—" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      item.status === "done"
                        ? "bg-green-50 border-green-200"
                        : "bg-muted/50 border-border"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        item.status === "done"
                          ? "bg-green-500 text-white"
                          : "bg-muted border border-border text-muted-foreground"
                      }`}
                    >
                      {item.status === "done" ? "✓" : item.step}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${item.status === "done" ? "text-foreground" : "text-muted-foreground"}`}>
                        {item.title}
                      </p>
                      {item.status === "done" && (
                        <p className="text-xs text-muted-foreground">
                          Completed by {item.by} on {item.date}
                        </p>
                      )}
                    </div>
                    {item.status === "done" && (
                      <button className="text-xs text-primary hover:underline">View Photo</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Expenses Section */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-card-foreground">Expenses</h2>
                <button className="text-sm text-primary font-medium">+ Add Expense</button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Description</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Submitted By</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Amount</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: "May 2", desc: "Electrical wire (200ft)", by: "Mike C.", amount: "$185.00", status: "Approved" },
                    { date: "May 3", desc: "Junction boxes (x12)", by: "Lisa W.", amount: "$96.00", status: "Approved" },
                    { date: "May 4", desc: "Outlets & switches", by: "Mike C.", amount: "$245.00", status: "Approved" },
                    { date: "May 4", desc: "Wire nuts & connectors", by: "Lisa W.", amount: "$34.00", status: "Pending" },
                  ].map((exp, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2 text-foreground">{exp.date}</td>
                      <td className="py-2 text-foreground">{exp.desc}</td>
                      <td className="py-2 text-foreground">{exp.by}</td>
                      <td className="py-2 text-foreground text-right">{exp.amount}</td>
                      <td className="py-2 text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            exp.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Assigned Technicians & Time */}
          <div className="space-y-6">
            {/* Project Context Card */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="font-semibold text-card-foreground mb-3">Project Context</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project</span>
                  <span className="text-primary cursor-pointer hover:underline">Downtown Office Tower</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="text-foreground">Acme Corporation</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project Progress</span>
                  <span className="text-foreground">65%</span>
                </div>
              </div>
            </div>

            {/* Assigned Technicians */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-card-foreground">Assigned Technicians</h2>
                <button className="text-sm text-primary font-medium">+ Assign</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Mike Chen", role: "Lead Tech", hours: "12h 15m", active: true },
                  { name: "Lisa Wong", role: "Technician", hours: "6h 15m", active: false },
                ].map((tech, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {tech.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">{tech.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{tech.hours}</p>
                      {tech.active && (
                        <span className="text-xs text-green-600">Active</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours Tracked */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="font-semibold text-card-foreground mb-4">Hours Tracked</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mike Chen</span>
                  <span className="text-foreground font-medium">12h 15m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lisa Wong</span>
                  <span className="text-foreground font-medium">6h 15m</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-sm">
                  <span className="text-foreground font-medium">Total</span>
                  <span className="text-foreground font-bold">18h 30m</span>
                </div>
              </div>
            </div>

            {/* Job Status Controls */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="font-semibold text-card-foreground mb-4">Job Controls</h2>
              <div className="space-y-2">
                <button className="w-full h-9 border border-amber-500 text-amber-600 rounded-md text-sm font-medium hover:bg-amber-50">
                  Put On Hold
                </button>
                <button className="w-full h-9 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                  Mark as Completed
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Completing this job will update the project completion percentage.
              </p>
            </div>
          </div>
        </div>

        {/* Annotation */}
        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          <strong>Wireframe Note:</strong> Job Detail now shows its parent Project context with a link back to the project. 
          When a job is marked as Completed, the parent project completion % is automatically recalculated.
        </div>
      </main>
    </div>
  )
}
