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
        <Card className="lg:col-span-5 hover:-translate-y-1 transition-transform duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70 uppercase tracking-wider">
              {user?.role === 'VOLUNTEER' ? 'Total Hours' : 'Total Volunteers'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold tracking-tighter text-primary">
              {user?.role === 'VOLUNTEER' ? '0' : isLoadingVolunteers ? '...' : volunteers.length}
            </div>
            <p className="text-sm text-foreground/60 mt-2">Currently registered in the system</p>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-4 hover:-translate-y-1 transition-transform duration-300 bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wider">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold tracking-tighter">
              {isLoadingEvents ? '...' : upcomingEventsCount}
            </div>
            <p className="text-sm text-primary-foreground/80 mt-2">Events requiring attention</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 hover:-translate-y-1 transition-transform duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tighter">
              {isLoadingProjects ? '...' : activeProjectsCount}
            </div>
            <p className="text-sm text-foreground/60 mt-2">Ongoing initiatives</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
