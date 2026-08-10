import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useMockData } from "@/lib/MockDataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function Donations() {
  const { user } = useAuth()
  const { projects, donations, setDonations } = useMockData()
  const [amount, setAmount] = useState("")
  const [selectedProject, setSelectedProject] = useState("General Fund")

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid donation amount")
      return
    }
    const newDonation = {
      id: `DON-${Math.floor(Math.random() * 10000)}`,
      donor: user?.name || "Guest",
      amount: `$${Number(amount).toFixed(2)}`,
      date: new Date().toISOString().split('T')[0],
      project: selectedProject,
      status: "Success",
    }
    setDonations([newDonation, ...donations])
    toast.success(`Thank you for your generous donation of $${amount}!`)
    setAmount("")
  }

  const isAdminOrStaff = user?.role === 'Admin' || user?.role === 'NGO Staff'

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!isAdminOrStaff ? (
        <>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Make a Donation</h1>
            <p className="text-muted-foreground">Your contribution helps us continue our mission and support communities in need.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>One-time Donation</CardTitle>
                <CardDescription>Support our general fund to be used where it's needed most.</CardDescription>
              </CardHeader>
              <form onSubmit={handleDonate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Project</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger>
                        <SelectValue placeholder="General Fund" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Fund">General Fund</SelectItem>
                        {projects.map(p => (
                          <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input 
                        id="amount" 
                        type="number" 
                        placeholder="50" 
                        className="pl-8"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[10, 25, 50, 100].map(preset => (
                      <Button 
                        key={preset} 
                        type="button" 
                        variant="outline" 
                        onClick={() => setAmount(preset.toString())}
                        className="hover:-translate-y-0.5 transition-all"
                      >
                        ${preset}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full gap-2 hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md">
                    <Heart className="w-4 h-4" /> Donate Now
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {user?.role === 'Donor' && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Impact</CardTitle>
                  <CardDescription>Thank you for your continued support.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Total Donated</span>
                      <span className="font-bold text-xl">$1,250</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Projects Supported</span>
                      <span className="font-bold text-xl">3</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-bold text-xl">2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
              <p className="text-muted-foreground">View and manage incoming donations.</p>
            </div>
          </div>
          
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donation ID</TableHead>
                  <TableHead>Donor Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                      No donations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  donations.map((don) => (
                    <TableRow key={don.id}>
                      <TableCell className="font-medium">{don.id}</TableCell>
                      <TableCell>{don.donor}</TableCell>
                      <TableCell>{don.project}</TableCell>
                      <TableCell className="font-bold text-green-600 dark:text-green-500">{don.amount}</TableCell>
                      <TableCell>{don.date}</TableCell>
                      <TableCell>
                        <Badge variant={don.status === 'Success' ? 'default' : 'secondary'}>
                          {don.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
