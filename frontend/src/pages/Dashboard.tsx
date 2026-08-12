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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}. Here's what's happening.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === 'VOLUNTEER' ? 'Total Hours' : 'Total Volunteers'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === 'VOLUNTEER' ? '0' : isLoadingVolunteers ? '...' : volunteers.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingEvents ? '...' : upcomingEventsCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingProjects ? '...' : activeProjectsCount}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
