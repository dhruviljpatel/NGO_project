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

const MOCK_VOLUNTEERS = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", skills: "Teaching, First Aid", hours: 120, status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", skills: "Event Management", hours: 45, status: "Active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", skills: "Photography", hours: 0, status: "Inactive" },
]

export function Volunteers() {
  const { user } = useAuth()
  const [volunteers] = useState(MOCK_VOLUNTEERS)

  if (user?.role !== 'Admin' && user?.role !== 'NGO Staff') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volunteers</h1>
          <p className="text-muted-foreground">Manage and track your volunteer base.</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.map((vol) => (
              <TableRow key={vol.id}>
                <TableCell className="font-medium">{vol.name}</TableCell>
                <TableCell>{vol.email}</TableCell>
                <TableCell>{vol.skills}</TableCell>
                <TableCell>{vol.hours} hrs</TableCell>
                <TableCell>
                  <Badge variant={vol.status === 'Active' ? 'default' : 'secondary'}>
                    {vol.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
