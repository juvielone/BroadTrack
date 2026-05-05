"use client";

import { DesktopSidebar } from "./shared/desktop-sidebar";

export function CreateProjectWireframe() {
  return (
    <div className="flex h-full bg-muted/30">
      <DesktopSidebar activeItem="Projects" />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary cursor-pointer hover:underline">Projects</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Create New Project</span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Create New Project</h1>
            <p className="text-sm text-muted-foreground mt-1">Set up a new project for a customer</p>
          </div>

          {/* Form */}
          <div className="bg-background border border-border rounded-lg p-6 space-y-6">
            {/* Project Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">Project Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Downtown Office Tower"
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    placeholder="Brief description of the project scope..."
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Status
                    </label>
                    <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background">
                      <option>Active</option>
                      <option>On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Project Manager
                    </label>
                    <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background">
                      <option>Select manager...</option>
                      <option>Sarah Johnson</option>
                      <option>John Smith</option>
                      <option>Emily Davis</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">Customer Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Acme Corporation"
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@customer.com"
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">Project Location</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Street address"
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="State"
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="ZIP"
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted">
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                Create Project
              </button>
            </div>
          </div>

          {/* Annotation */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
            <strong>Wireframe Note:</strong> After creating a project, user is redirected to the Project Detail screen where they can add jobs. 
            Jobs cannot exist without a parent project.
          </div>
        </div>
      </main>
    </div>
  );
}
