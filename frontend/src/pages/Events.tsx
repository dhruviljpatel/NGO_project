import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"
import { BackButton } from "@/components/BackButton"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEvents, registerForEvent } from "@/services/events.service"
import { EventCarousel } from "@/components/EventCarousel"

export function Events() {
  const { user } = useAuth()
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
      <div className="mb-10">
        <div className="mb-6 -ml-4">
          <BackButton className="scale-75 origin-left" />
        </div>
        <div className="text-center flex flex-col items-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-balance text-gradient inline-block pb-1">Volunteer Events</h1>
          <p className="text-foreground/70 text-lg max-w-2xl text-center">Discover and register for upcoming opportunities to make a difference.</p>
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
        <div className="-mx-6">
          <EventCarousel 
            events={events} 
            user={user} 
            registeredLocal={registeredLocal} 
            isPending={registerMutation.isPending} 
            onRegister={handleRegister} 
          />
        </div>
      )}
    </div>
  )
}
