import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useMockData } from "@/lib/MockDataContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { toast } from "sonner"

export function Events() {
  const { user } = useAuth()
  const { events, setEvents } = useMockData()
  const [registered, setRegistered] = useState<Record<string, boolean>>({})

  const handleRegister = (eventId: string) => {
    if (!user) {
      toast.error("Please login to register for events")
      return
    }
    
    // Update the event registration count locally
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          registeredVolunteers: (event.registeredVolunteers || 0) + 1,
          status: (event.registeredVolunteers || 0) + 1 >= event.requiredVolunteers ? "Full" : event.status
        }
      }
      return event
    }))

    setRegistered(prev => ({ ...prev, [eventId]: true }))
    toast.success("Successfully registered for the event!")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Events</h1>
        <p className="text-muted-foreground">Discover and register for upcoming volunteer opportunities.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <div className="col-span-full text-center p-8 border rounded-lg bg-card text-muted-foreground">
            No events found.
          </div>
        ) : (
          events.map(event => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={event.status === "Full" ? "secondary" : "default"}>
                    {event.status}
                  </Badge>
                  <Badge variant="outline" className="flex gap-1 items-center">
                    <Users className="w-3 h-3" />
                    {event.registeredVolunteers || 0}/{event.requiredVolunteers}
                  </Badge>
                </div>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription className="flex flex-col gap-2 mt-2">
                  <span className="flex items-center gap-2 text-foreground/80">
                    <Calendar className="w-4 h-4 text-primary" /> {event.date}
                  </span>
                  <span className="flex items-center gap-2 text-foreground/80">
                    <MapPin className="w-4 h-4 text-primary" /> {event.location}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md" 
                  disabled={event.status === "Full" || registered[event.id] || (user && user.role !== 'Volunteer')}
                  onClick={() => handleRegister(event.id)}
                >
                  {registered[event.id] ? "Registered" : event.status === "Full" ? "Event Full" : "Register Now"}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
