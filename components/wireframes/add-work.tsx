import { MobileBottomNav } from "./shared/mobile-bottom-nav"

export function AddWorkWireframe() {
  return (
    <div className="min-h-[700px] bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button className="text-lg">←</button>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm">Add Work</p>
          <p className="text-xs text-muted-foreground">MDU Installation - Building A</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 overflow-y-auto">
        {/* Current Timer */}
        <div className="mb-4 p-3 bg-chart-1/10 border border-chart-1/20 rounded-lg text-center">
          <p className="text-xs text-muted-foreground">Time on this job</p>
          <p className="text-2xl font-bold text-chart-1">2h 15m 32s</p>
        </div>

        {/* Step Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Procedure Step <span className="text-destructive">*</span>
          </label>
          <div className="space-y-2">
            {[
              { num: "1", title: "Site Survey", done: true },
              { num: "2", title: "Install MDU in Unit 1", done: true },
              { num: "2.1", title: "└ Run fiber cable", done: true, sub: true },
              { num: "2.2", title: "└ Install ONT", done: true, sub: true },
              { num: "2.3", title: "└ Test connection", done: true, sub: true },
              { num: "3", title: "Install MDU in Unit 2", done: true },
              { num: "4", title: "Install MDU in Unit 3", done: true },
              { num: "5", title: "Install MDU in Unit 4", done: false, selected: true },
              { num: "6", title: "Final Testing & Handover", done: false },
            ].map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  step.done
                    ? "bg-muted/50 border-border opacity-60"
                    : step.selected
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border"
                } ${step.sub ? "ml-4" : ""}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step.done
                      ? "bg-chart-1 text-white"
                      : step.selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted border border-border text-muted-foreground"
                  }`}
                >
                  {step.done ? "✓" : step.num}
                </div>
                <span
                  className={`text-sm ${
                    step.done
                      ? "text-muted-foreground line-through"
                      : step.selected
                      ? "text-foreground font-medium"
                      : "text-foreground"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Upload - MANDATORY */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Photo Evidence <span className="text-destructive">* Required</span>
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
            <p className="text-sm text-foreground font-medium mb-1">Tap to take photo</p>
            <p className="text-xs text-muted-foreground">or upload from gallery</p>
            <div className="mt-3 flex gap-2 justify-center">
              <button className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                📷 Camera
              </button>
              <button className="h-9 px-4 border border-border text-foreground rounded-md text-sm font-medium">
                📁 Gallery
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            ⚠️ A photo is required to mark this step as complete
          </p>
        </div>

        {/* Work Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Description of Work Done
          </label>
          <div className="h-24 bg-muted border border-input rounded-md p-3">
            <span className="text-sm text-muted-foreground">Describe what you did for this step...</span>
          </div>
        </div>

        {/* Optional Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Additional Notes <span className="text-xs text-muted-foreground">(Optional)</span>
          </label>
          <div className="h-16 bg-muted border border-input rounded-md p-3">
            <span className="text-sm text-muted-foreground">Any issues, observations, or comments...</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-2">
          <button className="w-full h-12 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            ✓ Mark Step as Complete
          </button>
          <button className="w-full h-10 border border-border text-foreground rounded-lg text-sm font-medium">
            Save Draft
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Completing this step will notify the Project Manager
        </p>
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav activeItem="jobs" />
    </div>
  )
}
