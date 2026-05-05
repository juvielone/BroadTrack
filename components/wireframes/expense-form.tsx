export function ExpenseFormWireframe() {
  return (
    <div className="min-h-[700px] bg-background flex flex-col">
      {/* Header - Works for both mobile and desktop */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button className="text-lg md:hidden">←</button>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm md:text-base">Log Expense</p>
          <p className="text-xs text-muted-foreground">MDU Installation - Building A</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          {/* Info Banner */}
          <div className="mb-4 p-3 bg-accent border border-border rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 All expenses require a receipt image. Your expense will be submitted for PM approval.
            </p>
          </div>

          {/* Amount Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Amount <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <div className="h-12 bg-muted border border-input rounded-md pl-8 pr-3 flex items-center">
                <span className="text-lg text-foreground">0.00</span>
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Item Description <span className="text-destructive">*</span>
            </label>
            <div className="h-10 bg-muted border border-input rounded-md px-3 flex items-center">
              <span className="text-sm text-muted-foreground">e.g., Fiber cables, Safety equipment, Fuel</span>
            </div>
          </div>

          {/* Category Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select className="w-full h-10 px-3 text-sm border border-input rounded-md bg-muted text-foreground">
              <option>Select category...</option>
              <option>Equipment</option>
              <option>Materials</option>
              <option>Transportation</option>
              <option>Safety Gear</option>
              <option>Tools</option>
              <option>Other</option>
            </select>
          </div>

          {/* Receipt Upload - MANDATORY */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Receipt Image <span className="text-destructive">* Required</span>
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">🧾</span>
              </div>
              <p className="text-sm text-foreground font-medium mb-1">Upload Receipt Image</p>
              <p className="text-xs text-muted-foreground mb-3">JPG, PNG up to 10MB</p>
              <div className="flex gap-2 justify-center flex-wrap">
                <button className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                  📷 Take Photo
                </button>
                <button className="h-9 px-4 border border-border text-foreground rounded-md text-sm font-medium">
                  📁 Choose File
                </button>
              </div>
            </div>
            <p className="text-xs text-destructive mt-2">
              ⚠️ Receipt is mandatory - expense cannot be submitted without it
            </p>
          </div>

          {/* Optional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes <span className="text-xs text-muted-foreground">(Optional)</span>
            </label>
            <div className="h-20 bg-muted border border-input rounded-md p-3">
              <span className="text-sm text-muted-foreground">Additional details about this expense...</span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="space-y-2">
            <button className="w-full h-12 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
              Submit Expense for Approval
            </button>
            <button className="w-full h-10 border border-border text-foreground rounded-lg text-sm font-medium">
              Cancel
            </button>
          </div>

          {/* Status Info */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Reimbursement Process:</p>
            <ol className="text-xs text-muted-foreground space-y-1">
              <li>1. Submit expense with receipt → <span className="text-chart-5">Pending</span></li>
              <li>2. PM reviews and approves/rejects</li>
              <li>3. If approved → <span className="text-chart-1">Approved</span> → Reimbursement processed</li>
              <li>4. If rejected → <span className="text-destructive">Rejected</span> with reason</li>
            </ol>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav - Only visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 flex justify-around">
        {[
          { id: "jobs", label: "Jobs", icon: "📋" },
          { id: "expenses", label: "Expenses", icon: "💰", active: true },
          { id: "profile", label: "Profile", icon: "👤" },
        ].map((item) => (
          <button
            key={item.id}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-lg ${
              item.active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
