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
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button variant="ghost" className="mb-4 -ml-4 text-foreground/60 hover:text-foreground" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-balance">Volunteer Events</h1>
          <p className="text-foreground/70 text-lg">Discover and register for upcoming opportunities to make a difference.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col h-[300px] animate-pulse bg-card/40 border-border/30">
              <CardHeader className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-16 h-6 bg-primary/10 rounded-full"></div>
                  <div className="w-12 h-6 bg-border/40 rounded-full"></div>
                </div>
                <div className="w-3/4 h-6 bg-border/40 rounded"></div>
                <div className="space-y-2 mt-4">
                  <div className="w-1/2 h-4 bg-border/30 rounded"></div>
                  <div className="w-2/3 h-4 bg-border/30 rounded"></div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <div className="w-full h-3 bg-border/20 rounded"></div>
                <div className="w-5/6 h-3 bg-border/20 rounded"></div>
              </CardContent>
              <CardFooter>
                <div className="w-full h-10 bg-border/30 rounded-xl"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="p-12 text-center text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl">
          <p className="font-semibold text-lg">Connection failed.</p>
          <p className="text-sm opacity-80 mt-1">Please try again later.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-20 border border-dashed rounded-3xl bg-card/30 text-foreground/70">
              <Calendar className="w-12 h-12 text-primary/40 mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No upcoming events</h3>
              <p className="text-sm mt-2 text-center max-w-sm">We are currently planning our next initiatives. Check back soon or ensure you are registered to receive updates.</p>
            </div>
          ) : (
            events.map((event: any, index: number) => (
              <Card key={event.id} className="flex flex-col hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant={event.status === "Full" ? "secondary" : "default"} className="px-3 py-1 text-xs">
                      {event.status}
                    </Badge>
                    <Badge variant="outline" className="flex gap-1.5 items-center px-3 py-1">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-medium text-xs">{event.registeredVolunteers || 0}/{event.requiredVolunteers}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-xl leading-tight">{event.name}</CardTitle>
                  <CardDescription className="flex flex-col gap-2.5 mt-4">
                    <span className="flex items-center gap-2.5 text-foreground/80 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-primary" /> {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2.5 text-foreground/80 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-primary" /> {event.location}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-foreground/60 leading-relaxed">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full gap-2 rounded-xl h-11 text-sm font-semibold shadow-md" 
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
