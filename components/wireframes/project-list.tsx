"use client";

import { DesktopSidebar } from "./shared/desktop-sidebar";

export function ProjectListWireframe() {
  return (
    <div className="flex h-full bg-muted/30">
      <DesktopSidebar activeItem="Projects" />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
              <p className="text-sm text-muted-foreground">Manage all customer projects</p>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
              + Create Project
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm">All</button>
              <button className="px-3 py-1.5 bg-background border border-border rounded-md text-sm text-muted-foreground hover:bg-muted">Active</button>
              <button className="px-3 py-1.5 bg-background border border-border rounded-md text-sm text-muted-foreground hover:bg-muted">Completed</button>
              <button className="px-3 py-1.5 bg-background border border-border rounded-md text-sm text-muted-foreground hover:bg-muted">On Hold</button>
            </div>
            <div className="flex-1" />
            <input
              type="text"
              placeholder="Search projects..."
              className="px-3 py-1.5 border border-border rounded-md text-sm w-64 bg-background"
            />
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project Card 1 - Active */}
            <div className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">Downtown Office Tower</h3>
                  <p className="text-sm text-muted-foreground">Acme Corporation</p>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Active</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium text-foreground">65%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jobs</span>
                  <span className="text-foreground">8 / 12 completed</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">Jan 15, 2025</span>
                </div>
              </div>
            </div>

            {/* Project Card 2 - Active */}
            <div className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">Riverside Mall Expansion</h3>
                  <p className="text-sm text-muted-foreground">Riverside Properties LLC</p>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Active</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium text-foreground">25%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "25%" }} />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jobs</span>
                  <span className="text-foreground">2 / 8 completed</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">Feb 3, 2025</span>
                </div>
              </div>
            </div>

            {/* Project Card 3 - On Hold */}
            <div className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">Harbor View Condos</h3>
                  <p className="text-sm text-muted-foreground">Harbor Development Co</p>
                </div>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">On Hold</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium text-foreground">40%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "40%" }} />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jobs</span>
                  <span className="text-foreground">2 / 5 completed</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">Dec 10, 2024</span>
                </div>
              </div>
            </div>

            {/* Project Card 4 - Completed */}
            <div className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">Tech Park Building A</h3>
                  <p className="text-sm text-muted-foreground">Innovation Tech Inc</p>
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Completed</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium text-foreground">100%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jobs</span>
                  <span className="text-foreground">6 / 6 completed</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">Nov 5, 2024</span>
                </div>
              </div>
            </div>

            {/* Project Card 5 - Active */}
            <div className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">Central Hospital Wing</h3>
                  <p className="text-sm text-muted-foreground">Metro Health Systems</p>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Active</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium text-foreground">80%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jobs</span>
                  <span className="text-foreground">4 / 5 completed</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">Jan 28, 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Annotation */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
            <strong>Wireframe Note:</strong> Project completion % is auto-calculated from (completed jobs / total jobs). 
            Clicking a project card navigates to Project Detail screen.
          </div>
        </div>
      </main>
    </div>
  );
}
