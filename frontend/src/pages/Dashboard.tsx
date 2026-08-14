import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getEvents } from "@/services/events.service"
import { getProjects } from "@/services/projects.service"
import { getVolunteers } from "@/services/volunteers.service"

export function Dashboard() {
  const { user } = useAuth()

  const { data: events = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const { data: volunteers = [], isLoading: isLoadingVolunteers } = useQuery({
    queryKey: ['volunteers'],
    queryFn: getVolunteers,
    enabled: user?.role === 'ADMIN' || user?.role === 'NGO_STAFF',
  })

  const upcomingEventsCount = events.filter((e: any) => new Date(e.date) >= new Date()).length
  const activeProjectsCount = projects.filter((p: any) => p.status === 'Active').length

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-balance">Dashboard</h1>
        <p className="text-foreground/70 text-lg">Welcome back, <span className="font-semibold text-foreground">{user?.name || user?.email}</span>. Here's what's happening.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-12">
        <Card className="glass-card lg:col-span-5 relative overflow-hidden group border-t border-l border-white/40 dark:border-white/10 rounded-2xl">
          <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground/70 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {user?.role === 'VOLUNTEER' ? 'Total Hours' : 'Total Volunteers'}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary drop-shadow-sm">
              {user?.role === 'VOLUNTEER' ? '0' : isLoadingVolunteers ? '...' : volunteers.length}
            </div>
            <p className="text-sm font-medium text-foreground/60 mt-2">Currently registered in the system</p>
          </CardContent>
        </Card>
        <Card className="glass-card lg:col-span-4 relative overflow-hidden group border-t border-l border-white/40 dark:border-white/10 rounded-2xl bg-gradient-to-br from-primary/90 to-secondary/90 text-primary-foreground border-transparent shadow-xl shadow-primary/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-primary-foreground/90 uppercase tracking-widest">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-6xl font-black tracking-tighter drop-shadow-md">
              {isLoadingEvents ? '...' : upcomingEventsCount}
            </div>
            <p className="text-sm font-medium text-primary-foreground/80 mt-2">Events requiring attention</p>
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-3 relative overflow-hidden group border-t border-l border-white/40 dark:border-white/10 rounded-2xl">
          <div className="absolute -inset-2 bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground/70 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-secondary to-primary drop-shadow-sm">
              {isLoadingProjects ? '...' : activeProjectsCount}
            </div>
            <p className="text-sm font-medium text-foreground/60 mt-2">Ongoing initiatives</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
