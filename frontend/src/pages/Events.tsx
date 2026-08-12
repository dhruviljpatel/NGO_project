import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEvents, registerForEvent } from "@/services/events.service"

export function Events() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [registeredLocal, setRegisteredLocal] = useState<Record<string, boolean>>({})

  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  const registerMutation = useMutation({
    mutationFn: (eventId: string) => registerForEvent(eventId),
    onSuccess: (_, eventId) => {
      toast.success("Successfully registered for the event!")
      setRegisteredLocal(prev => ({ ...prev, [eventId]: true }))
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to register for the event")
    }
  })

  const handleRegister = (eventId: string) => {
    if (!user) {
      toast.error("Please login to register for events")
      return
    }
    
    registerMutation.mutate(eventId)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div>
        <Button variant="ghost" className="mb-4 -ml-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Events</h1>
        <p className="text-muted-foreground">Discover and register for upcoming volunteer opportunities.</p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground bg-card border rounded-lg">
          Loading upcoming events...
        </div>
      ) : isError ? (
        <div className="p-12 text-center text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          Failed to load events. Please try again later.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full text-center p-12 border rounded-lg bg-card text-muted-foreground">
              No events found at the moment.
            </div>
          ) : (
            events.map((event: any) => (
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
                      <Calendar className="w-4 h-4 text-primary" /> {new Date(event.date).toLocaleDateString()}
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
                    className="w-full gap-2" 
                    disabled={event.status === "Full" || registeredLocal[event.id] || (user && user.role !== 'VOLUNTEER') || registerMutation.isPending}
                    onClick={() => handleRegister(event.id)}
                  >
                    {registeredLocal[event.id] ? "Registered" : event.status === "Full" ? "Event Full" : registerMutation.isPending ? "Registering..." : "Register Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
