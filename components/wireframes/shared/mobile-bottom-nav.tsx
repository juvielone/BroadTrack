type MobileNavProps = {
  activeItem: string
}

const navItems = [
  { id: "jobs", label: "Jobs", icon: "📋" },
  { id: "expenses", label: "Expenses", icon: "💰" },
  { id: "profile", label: "Profile", icon: "👤" },
]

export function MobileBottomNav({ activeItem }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 flex justify-around">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-lg transition-colors ${
            activeItem === item.id
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
