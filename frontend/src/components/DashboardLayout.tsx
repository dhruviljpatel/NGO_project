import { Navigate, Outlet, Link, useLocation } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { Calendar, Users, Briefcase, LayoutDashboard, Heart, LogOut, FileText } from "lucide-react"
import { Button } from "./ui/button"

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const getLinksForRole = () => {
    switch (user.role) {
      case 'Admin':
      case 'NGO Staff':
        return [
          { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
          { name: "Volunteers", path: "/dashboard/volunteers", icon: Users },
          { name: "Events", path: "/dashboard/events", icon: Calendar },
          { name: "Projects", path: "/dashboard/projects", icon: Briefcase },
          { name: "Donations", path: "/dashboard/donations", icon: Heart },
          { name: "Beneficiaries", path: "/dashboard/beneficiaries", icon: Users },
          { name: "Reports", path: "/dashboard/reports", icon: FileText },
        ]
      case 'Volunteer':
        return [
          { name: "My Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "Available Events", path: "/events", icon: Calendar },
        ]
      case 'Donor':
        return [
          { name: "My Donations", path: "/dashboard", icon: Heart },
          { name: "Projects", path: "/dashboard/projects", icon: Briefcase },
        ]
      default:
        return [
          { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
        ]
    }
  }

  const links = getLinksForRole()

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 p-4 flex flex-col gap-2 hidden md:flex">
        <div className="mb-4 px-2">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.role}</p>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>
        <Button variant="outline" className="w-full justify-start gap-3 mt-auto" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto relative">
        <div key={location.pathname} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
