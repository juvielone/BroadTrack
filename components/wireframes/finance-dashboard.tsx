import { DesktopSidebar } from "./shared/desktop-sidebar"

export function FinanceDashboardWireframe() {
  return (
    <div className="min-h-[700px] flex">
      {/* Sidebar */}
      <DesktopSidebar activeItem="dashboard" role="finance" />

      {/* Main Content */}
      <main className="flex-1 bg-muted p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Finance Dashboard</h1>
          <p className="text-sm text-muted-foreground">View-only access to financial data</p>
        </div>

        {/* Read-Only Banner */}
        <div className="mb-6 p-3 bg-accent border border-border rounded-lg flex items-center gap-2">
          <span className="text-lg">🔒</span>
          <p className="text-sm text-muted-foreground">
            <strong>Read-Only Mode:</strong> Finance users can view all expense and reimbursement data but cannot approve or modify records.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Expenses (MTD)</p>
            <p className="text-2xl font-bold text-foreground mt-1">$12,450</p>
            <p className="text-xs text-chart-1 mt-1">↑ 8% from last month</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Pending Reimbursements</p>
            <p className="text-2xl font-bold text-chart-5 mt-1">$2,350</p>
            <p className="text-xs text-muted-foreground mt-1">12 requests</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Approved (MTD)</p>
            <p className="text-2xl font-bold text-chart-1 mt-1">$8,900</p>
            <p className="text-xs text-muted-foreground mt-1">45 expenses</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Rejected (MTD)</p>
            <p className="text-2xl font-bold text-destructive mt-1">$1,200</p>
            <p className="text-xs text-muted-foreground mt-1">5 expenses</p>
          </div>
        </div>

        {/* Reimbursement Status Overview */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-semibold text-card-foreground mb-4">Reimbursement Status Breakdown</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="text-foreground">$2,350 (12)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-chart-5 rounded-full" style={{ width: "19%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Approved</span>
                  <span className="text-foreground">$8,900 (45)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-chart-1 rounded-full" style={{ width: "71%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Rejected</span>
                  <span className="text-foreground">$1,200 (5)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-destructive rounded-full" style={{ width: "10%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-semibold text-card-foreground mb-4">Job Cost Summary</h2>
            <div className="space-y-3">
              {[
                { job: "MDU Installation - Building A", expenses: "$3,200", hours: "45h" },
                { job: "Fiber Repair - Site 12", expenses: "$1,800", hours: "28h" },
                { job: "Network Setup - Office Park", expenses: "$4,500", hours: "62h" },
                { job: "Cable Replacement - Unit 5", expenses: "$950", hours: "15h" },
              ].map((job, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{job.job}</p>
                    <p className="text-xs text-muted-foreground">Hours logged: {job.hours}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{job.expenses}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Expenses Table */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-card-foreground">All Expenses</h2>
            <div className="flex gap-2">
              <select className="h-8 px-3 text-sm border border-input rounded-md bg-background text-foreground">
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
              <select className="h-8 px-3 text-sm border border-input rounded-md bg-background text-foreground">
                <option>All Jobs</option>
                <option>MDU Installation</option>
                <option>Fiber Repair</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Job</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Description</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Submitted By</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Amount</th>
                  <th className="text-center py-2 text-muted-foreground font-medium">Receipt</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "May 2", job: "MDU Installation", desc: "Fiber cables (50m)", by: "John D.", amount: "$125.00", status: "Pending" },
                  { date: "May 2", job: "Fiber Repair", desc: "Equipment rental", by: "Sarah M.", amount: "$350.00", status: "Pending" },
                  { date: "May 1", job: "Network Setup", desc: "Router unit", by: "Mike R.", amount: "$450.00", status: "Approved" },
                  { date: "May 1", job: "MDU Installation", desc: "Safety equipment", by: "John D.", amount: "$89.00", status: "Approved" },
                  { date: "Apr 30", job: "Cable Replace", desc: "Invalid receipt", by: "Tech X", amount: "$200.00", status: "Rejected" },
                ].map((exp, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-2 text-foreground">{exp.date}</td>
                    <td className="py-2 text-foreground">{exp.job}</td>
                    <td className="py-2 text-foreground">{exp.desc}</td>
                    <td className="py-2 text-foreground">{exp.by}</td>
                    <td className="py-2 text-foreground text-right">{exp.amount}</td>
                    <td className="py-2 text-center">
                      <span className="text-xs text-primary cursor-pointer underline">View</span>
                    </td>
                    <td className="py-2 text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          exp.status === "Pending"
                            ? "bg-chart-5/20 text-chart-5"
                            : exp.status === "Approved"
                            ? "bg-chart-1/20 text-chart-1"
                            : "bg-destructive/20 text-destructive"
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
      </main>
    </div>
  )
}
