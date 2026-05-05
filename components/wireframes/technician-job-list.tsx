import { MobileBottomNav } from "./shared/mobile-bottom-nav"

export function TechnicianJobListWireframe() {
  return (
    <div className="min-h-[700px] bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">BT</span>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">My Jobs</p>
            <p className="text-xs text-muted-foreground">Mike Chen</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-foreground">MC</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 overflow-y-auto">
        {/* Active Work Banner */}
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Currently Working</p>
              <p className="text-xs text-muted-foreground">Floor 2 - Electrical Install</p>
              <p className="text-xs text-green-600">Downtown Office Tower</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-green-600">2h 15m</p>
              <button className="text-xs text-red-600 font-medium">Clock Out</button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-medium whitespace-nowrap">
            All (7)
          </button>
          <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
            In Progress (4)
          </button>
          <button className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium whitespace-nowrap">
            On Hold (1)
          </button>
          <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
            Completed (2)
          </button>
        </div>

        {/* Job Cards Grouped by Project */}
        <div className="space-y-6">
          {/* Project Group 1 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h2 className="text-sm font-semibold text-foreground">Downtown Office Tower</h2>
              <span className="text-xs text-muted-foreground">65% complete</span>
            </div>
            <div className="space-y-3 pl-4 border-l-2 border-blue-200">
              {[
                {
                  title: "Floor 2 - Electrical Install",
                  status: "In Progress",
                  progress: 60,
                  steps: "6/10 steps",
                  active: true,
                },
                {
                  title: "Floor 3 - Electrical Install",
                  status: "In Progress",
                  progress: 30,
                  steps: "3/10 steps",
                  active: false,
                },
                {
                  title: "HVAC System Setup",
                  status: "On Hold",
                  progress: 20,
                  steps: "2/8 steps",
                  active: false,
                  holdReason: "Waiting for equipment",
                },
              ].map((job, i) => (
                <div
                  key={i}
                  className={`bg-card border rounded-lg p-4 ${
                    job.active ? "border-green-500 bg-green-50/50" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{job.title}</p>
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

                  {job.holdReason && (
                    <p className="text-xs text-amber-600 mb-2">Paused: {job.holdReason}</p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{job.steps}</span>
                      <span className="text-muted-foreground">{job.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          job.status === "Completed" ? "bg-green-500" : job.status === "On Hold" ? "bg-amber-500" : "bg-primary"
                        }`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {job.status === "In Progress" && (
                      <>
                        <button className="flex-1 h-9 bg-primary text-primary-foreground rounded-md text-xs font-medium">
                          Add Work
                        </button>
                        <button className="flex-1 h-9 border border-border text-foreground rounded-md text-xs font-medium">
                          Add Expense
                        </button>
                      </>
                    )}
                    {job.status === "On Hold" && (
                      <button className="flex-1 h-9 border border-border text-muted-foreground rounded-md text-xs font-medium" disabled>
                        On Hold - Contact PM
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Group 2 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <h2 className="text-sm font-semibold text-foreground">Central Hospital Wing</h2>
              <span className="text-xs text-muted-foreground">80% complete</span>
            </div>
            <div className="space-y-3 pl-4 border-l-2 border-purple-200">
              {[
                {
                  title: "ICU Monitoring Setup",
                  status: "In Progress",
                  progress: 85,
                  steps: "6/7 steps",
                  active: false,
                },
                {
                  title: "Emergency Lighting",
                  status: "Completed",
                  progress: 100,
                  steps: "5/5 steps",
                  active: false,
                },
              ].map((job, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{job.title}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        job.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{job.steps}</span>
                      <span className="text-muted-foreground">{job.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${job.status === "Completed" ? "bg-green-500" : "bg-primary"}`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {job.status === "In Progress" && (
                      <>
                        <button className="flex-1 h-9 bg-primary text-primary-foreground rounded-md text-xs font-medium">
                          Add Work
                        </button>
                        <button className="flex-1 h-9 border border-border text-foreground rounded-md text-xs font-medium">
                          Add Expense
                        </button>
                      </>
                    )}
                    {job.status === "Completed" && (
                      <button className="flex-1 h-9 border border-border text-foreground rounded-md text-xs font-medium">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Group 3 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <h2 className="text-sm font-semibold text-foreground">Riverside Mall Expansion</h2>
              <span className="text-xs text-muted-foreground">25% complete</span>
            </div>
            <div className="space-y-3 pl-4 border-l-2 border-orange-200">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Food Court Electrical</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    In Progress
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">1/8 steps</span>
                    <span className="text-muted-foreground">10%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: "10%" }} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 h-9 bg-primary text-primary-foreground rounded-md text-xs font-medium">
                    Add Work
                  </button>
                  <button className="flex-1 h-9 border border-border text-foreground rounded-md text-xs font-medium">
                    Add Expense
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Annotation */}
        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          <strong>Wireframe Note:</strong> Technician view now shows jobs grouped under their parent Project. 
          Each project shows its overall completion %. The project grouping helps technicians understand the bigger picture of their work.
        </div>
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav activeItem="jobs" />
    </div>
  )
}
