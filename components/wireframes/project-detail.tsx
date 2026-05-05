"use client";

import { DesktopSidebar } from "./shared/desktop-sidebar";

export function ProjectDetailWireframe() {
  return (
    <div className="flex h-full bg-muted/30">
      <DesktopSidebar activeItem="Projects" />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary cursor-pointer hover:underline">Projects</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Downtown Office Tower</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">Downtown Office Tower</h1>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Active</span>
              </div>
              <p className="text-muted-foreground mt-1">Acme Corporation</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-background border border-border rounded-md text-sm font-medium hover:bg-muted">
                Edit Project
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                + Add Job
              </button>
            </div>
          </div>

          {/* Project Info Card */}
          <div className="bg-background border border-border rounded-lg p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium text-foreground">Acme Corporation</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">123 Main St, Downtown</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium text-foreground">Jan 15, 2025</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Project Manager</p>
                <p className="font-medium text-foreground">Sarah Johnson</p>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Overall Completion</span>
                <span className="text-sm font-semibold text-foreground">65% (8 of 12 jobs completed)</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
              </div>
            </div>
          </div>

          {/* Jobs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Jobs</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm">All (12)</button>
                <button className="px-3 py-1.5 bg-background border border-border rounded-md text-sm text-muted-foreground">In Progress (3)</button>
                <button className="px-3 py-1.5 bg-background border border-border rounded-md text-sm text-muted-foreground">Completed (8)</button>
                <button className="px-3 py-1.5 bg-background border border-border rounded-md text-sm text-muted-foreground">On Hold (1)</button>
              </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-background border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Job Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Assigned To</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Hours</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">Floor 1 - Electrical Install</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Completed</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground">100%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">Mike Chen</td>
                    <td className="px-4 py-3 text-sm text-foreground">24h</td>
                    <td className="px-4 py-3">
                      <button className="text-sm text-primary hover:underline">View</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">Floor 2 - Electrical Install</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">In Progress</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "60%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground">60%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">Mike Chen, Lisa Wong</td>
                    <td className="px-4 py-3 text-sm text-foreground">18h</td>
                    <td className="px-4 py-3">
                      <button className="text-sm text-primary hover:underline">View</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">Floor 3 - Electrical Install</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">In Progress</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "30%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground">30%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">James Rodriguez</td>
                    <td className="px-4 py-3 text-sm text-foreground">8h</td>
                    <td className="px-4 py-3">
                      <button className="text-sm text-primary hover:underline">View</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">HVAC System Setup</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">On Hold</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: "20%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground">20%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">Unassigned</td>
                    <td className="px-4 py-3 text-sm text-foreground">4h</td>
                    <td className="px-4 py-3">
                      <button className="text-sm text-primary hover:underline">View</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">Security System Install</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Completed</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground">100%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">Lisa Wong</td>
                    <td className="px-4 py-3 text-sm text-foreground">32h</td>
                    <td className="px-4 py-3">
                      <button className="text-sm text-primary hover:underline">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-background border border-border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Financial Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-xl font-semibold text-foreground">156h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-xl font-semibold text-foreground">$4,250</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Reimbursements</p>
                <p className="text-xl font-semibold text-amber-600">$850</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved Reimbursements</p>
                <p className="text-xl font-semibold text-green-600">$3,400</p>
              </div>
            </div>
          </div>

          {/* Annotation */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
            <strong>Wireframe Note:</strong> Jobs are now scoped within a Project. Clicking a job row navigates to Job Detail. 
            The Add Job button opens the Create Job form pre-filled with this project.
          </div>
        </div>
      </main>
    </div>
  );
}
