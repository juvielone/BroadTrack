export function LoginWireframe() {
  return (
    <div className="min-h-[600px] flex items-center justify-center bg-muted p-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">BT</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">BroadTrack</h1>
          <p className="text-sm text-muted-foreground mt-1">Field Technician Job Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-6">Sign In</h2>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email Address
            </label>
            <div className="h-10 bg-muted border border-input rounded-md px-3 flex items-center">
              <span className="text-sm text-muted-foreground">email@example.com</span>
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <div className="h-10 bg-muted border border-input rounded-md px-3 flex items-center">
              <span className="text-sm text-muted-foreground">••••••••</span>
            </div>
          </div>

          {/* Sign In Button */}
          <button className="w-full h-10 bg-primary text-primary-foreground rounded-md font-medium text-sm">
            Sign In
          </button>

          {/* Forgot Password Link */}
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Forgot your password?{" "}
            <span className="text-primary underline cursor-pointer">Reset it</span>
          </p>
        </div>

        {/* Role Redirect Note */}
        <div className="mt-6 p-4 bg-accent/50 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Note:</strong> After login, users are redirected based on role:
          </p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
            <li>• <strong>PM / Admin</strong> → PM Dashboard</li>
            <li>• <strong>Technician</strong> → Technician Job List (Mobile)</li>
            <li>• <strong>Finance</strong> → Finance Dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
