import { DesktopSidebar } from "./shared/desktop-sidebar"

export function CreateJobWireframe() {
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
            <span>Create New Job</span>
          </p>
          <h1 className="text-2xl font-bold text-foreground">Create New Job</h1>
          <p className="text-sm text-muted-foreground mt-1">Add a new job to Downtown Office Tower</p>
        </div>

        {/* Form */}
        <div className="max-w-4xl space-y-6">
          {/* Project Selection Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold text-card-foreground mb-4">Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Select Project <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-10 px-3 text-sm border border-input rounded-md bg-background text-foreground">
                  <option>Downtown Office Tower (Acme Corporation)</option>
                  <option>Riverside Mall Expansion (Riverside LLC)</option>
                  <option>Central Hospital Wing (Metro Health)</option>
                  <option>Harbor View Condos (Harbor Dev)</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1.5">Jobs must belong to a project</p>
              </div>
              
              {/* Selected Project Info */}
              <div className="p-3 bg-muted/50 border border-border rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Downtown Office Tower</p>
                    <p className="text-xs text-muted-foreground">Customer: Acme Corporation</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">65% complete</p>
                    <p className="text-xs text-muted-foreground">8 of 12 jobs done</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold text-card-foreground mb-4">Job Information</h2>
            <div className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Floor 4 - Electrical Install"
                  className="w-full h-10 px-3 text-sm border border-input rounded-md bg-background"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Describe the scope of work, location details, and any special requirements..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
                />
              </div>

              {/* Location (Optional) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Specific Location / Area
                </label>
                <input
                  type="text"
                  placeholder="e.g., 4th Floor, East Wing"
                  className="w-full h-10 px-3 text-sm border border-input rounded-md bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1.5">Optional - Project address is inherited from the parent project</p>
              </div>
            </div>
          </div>

          {/* Procedure Steps Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-card-foreground">Procedure Steps</h2>
                <p className="text-sm text-muted-foreground mt-1">Define the structured steps technicians will follow</p>
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-3 mb-4">
              {[
                { num: "1", title: "Site preparation & safety check", subs: [] },
                { num: "2", title: "Run main conduit from panel", subs: [] },
                { num: "3", title: "Install junction boxes", subs: ["Mark positions", "Mount boxes", "Run ground wire"] },
                { num: "4", title: "Pull wire through conduit", subs: [] },
                { num: "5", title: "Install outlets & switches", subs: [] },
              ].map((step, i) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{step.num}</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        defaultValue={step.title}
                        className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background"
                      />
                    </div>
                    <button className="text-xs text-muted-foreground hover:text-red-500">Remove</button>
                  </div>

                  {/* Sub-steps */}
                  {step.subs.length > 0 && (
                    <div className="ml-11 mt-3 space-y-2">
                      {step.subs.map((sub, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-6">{step.num}.{j + 1}</span>
                          <input
                            type="text"
                            defaultValue={sub}
                            className="flex-1 h-8 px-3 text-sm border border-input rounded-md bg-background"
                          />
                          <button className="text-xs text-muted-foreground hover:text-red-500">x</button>
                        </div>
                      ))}
                      <button className="text-xs text-primary ml-6">+ Add Sub-step</button>
                    </div>
                  )}

                  {step.subs.length === 0 && (
                    <div className="ml-11 mt-2">
                      <button className="text-xs text-primary">+ Add Sub-steps</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Step Button */}
            <button className="w-full h-10 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              + Add Procedure Step
            </button>
          </div>

          {/* Assign Technicians Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-card-foreground">Assign Technicians</h2>
                <p className="text-sm text-muted-foreground mt-1">Select one or more technicians for this job</p>
              </div>
            </div>

            {/* Search/Select Technicians */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search technicians..."
                className="w-full h-10 px-3 text-sm border border-input rounded-md bg-background"
              />
            </div>

            {/* Selected Technicians */}
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium text-foreground">Selected:</p>
              <div className="flex flex-wrap gap-2">
                {["Mike Chen", "Lisa Wong"].map((tech, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full"
                  >
                    <span className="text-sm text-primary">{tech}</span>
                    <button className="text-primary hover:text-red-500">x</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Technicians */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Available Technicians:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "James Rodriguez", jobs: 3 },
                  { name: "Emily Chen", jobs: 2 },
                  { name: "David Kim", jobs: 4 },
                  { name: "Sarah Thompson", jobs: 1 },
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
                  >
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-foreground">
                        {tech.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">{tech.jobs} active jobs</p>
                    </div>
                    <div className="w-5 h-5 border-2 border-border rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button className="h-10 px-6 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted">
              Cancel
            </button>
            <button className="h-10 px-6 bg-secondary text-secondary-foreground rounded-md text-sm font-medium">
              Save as Draft
            </button>
            <button className="h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium">
              Create Job
            </button>
          </div>

          {/* Annotation */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
            <strong>Wireframe Note:</strong> Jobs must be created within a Project. The project selector is required. 
            When accessed from Project Detail, the project is pre-selected and locked.
          </div>
        </div>
      </main>
    </div>
  )
}
