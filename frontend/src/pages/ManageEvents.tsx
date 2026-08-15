import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Navigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEvents, createEvent, updateEvent } from "@/services/events.service"

const eventSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  date: z.string().min(1, "Date is required."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  requiredVolunteers: z.coerce.number().min(1, "Must require at least 1 volunteer."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  status: z.enum(["Upcoming", "Open for Registration", "Full", "Completed", "Cancelled"]).optional(),
})

export function ManageEvents() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => createEvent(data),
    onSuccess: () => {
      toast.success("Event created successfully!")
      setIsFormOpen(false)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create event")
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateEvent(selectedEvent?.id, data),
    onSuccess: () => {
      toast.success("Event updated successfully!")
      setIsFormOpen(false)
      form.reset()
      setSelectedEvent(null)
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update event")
    }
  })

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      date: "",
      location: "",
      requiredVolunteers: 10,
      description: "",
      status: "Upcoming",
    },
  })

  if (user?.role !== 'ADMIN' && user?.role !== 'NGO_STAFF') {
    return <Navigate to="/dashboard" replace />
  }

  function onSubmit(values: z.infer<typeof eventSchema>) {
    // Format date if needed, though backend should accept string date
    const payload = {
        name: values.name,
        date: new Date(values.date).toISOString(),
        location: values.location,
        description: values.description,
        capacity: values.requiredVolunteers,
        duration: 2,
        status: values.status ? values.status.toUpperCase().replace(/ /g, '_') : 'UPCOMING'
    }

    if (isEditMode) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleCreateClick = () => {
    setIsEditMode(false)
    setSelectedEvent(null)
    form.reset({
      name: "",
      date: "",
      location: "",
      requiredVolunteers: 10,
      description: "",
      status: "Upcoming",
    })
    setIsFormOpen(true)
  }

  const handleEditClick = (event: any) => {
    setIsEditMode(true)
    setSelectedEvent(event)
    form.reset({
      name: event.name,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
      location: event.location,
      requiredVolunteers: event.capacity || 10,
      description: event.description,
      status: event.status ? event.status.replace(/_/g, ' ').replace(/\w\S*/g, (w: string) => (w.replace(/^\w/, (c) => c.toUpperCase()))) : "Upcoming",
    })
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient inline-block mb-1 pb-1">Manage Events</h1>
          <p className="text-muted-foreground">Create and manage NGO events and attendance.</p>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateClick}>Create Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Event" : "Create New Event"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Update the event details below." : "Add a new event to the platform. Fill in the details below."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. School Book Distribution" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City or Venue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requiredVolunteers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Volunteers</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="Open for Registration">Open for Registration</SelectItem>
                            <SelectItem value="Full">Full</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Details about the event..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Event"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border-t border-l border-white/40 dark:border-white/10 glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Volunteers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                  Loading events...
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                  No events found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event: any) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event._count?.registrations || 0} / {event.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={event.status === 'UPCOMING' ? 'default' : 'secondary'}>
                      {event.status ? event.status.replace(/_/g, ' ') : ''}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Attendance</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Mark Attendance</DialogTitle>
                          <DialogDescription>
                            Record attendance for {event.name}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="text-sm text-muted-foreground mb-4">
                            Note: This is a mocked list for demonstration.
                          </div>
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                              <div className="font-medium text-sm">Volunteer {i}</div>
                              <Select defaultValue="Present">
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Present">Present</SelectItem>
                                  <SelectItem value="Absent">Absent</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button onClick={() => toast.success("Attendance saved!")}>Save Attendance</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(event)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
