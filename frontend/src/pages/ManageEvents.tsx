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

const MOCK_EVENTS = [
  {
    id: "1",
    name: "School Book Distribution",
    date: "25 August 2026",
    location: "Ahmedabad",
    requiredVolunteers: 20,
    registeredVolunteers: 15,
    status: "Upcoming",
  },
  {
    id: "2",
    name: "Community Food Drive",
    date: "10 September 2026",
    location: "Surat",
    requiredVolunteers: 50,
    registeredVolunteers: 50,
    status: "Full",
  }
]

export function ManageEvents() {
  const { user } = useAuth()
  const [events] = useState(MOCK_EVENTS)

  if (user?.role !== 'Admin' && user?.role !== 'NGO Staff') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
          <p className="text-muted-foreground">Create and manage NGO events and attendance.</p>
        </div>
        <Button>Create Event</Button>
      </div>

      <div className="rounded-md border">
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
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.registeredVolunteers} / {event.requiredVolunteers}</TableCell>
                <TableCell>
                  <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">Attendance</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
