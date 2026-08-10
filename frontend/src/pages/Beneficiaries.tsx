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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const MOCK_BENEFICIARIES = [
  { id: "1", name: "Rahul Patel", location: "Ahmedabad", needs: "Education Materials", status: "Supported" },
  { id: "2", name: "Sunita Sharma", location: "Surat", needs: "Food Assistance", status: "Pending" },
  { id: "3", name: "Amit Kumar", location: "Vadodara", needs: "Medical Aid", status: "In Progress" },
]

export function Beneficiaries() {
  const { user } = useAuth()
  const [beneficiaries] = useState(MOCK_BENEFICIARIES)

  if (user?.role !== 'Admin' && user?.role !== 'NGO Staff') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beneficiaries</h1>
          <p className="text-muted-foreground">Manage and track individuals and communities receiving aid.</p>
        </div>
        <Button>Add Beneficiary</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Primary Needs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {beneficiaries.map((ben) => (
              <TableRow key={ben.id}>
                <TableCell className="font-medium">{ben.name}</TableCell>
                <TableCell>{ben.location}</TableCell>
                <TableCell>{ben.needs}</TableCell>
                <TableCell>
                  <Badge variant={ben.status === 'Supported' ? 'default' : ben.status === 'Pending' ? 'destructive' : 'secondary'}>
                    {ben.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">Update</Button>
                  <Button variant="outline" size="sm">View History</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
