import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useNavigate, Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getDonations, createDonation } from "@/services/donations.service"
import { getProjects } from "@/services/projects.service"

export function Donations() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string>("general")

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const { data: donations = [], isLoading: isLoadingDonations } = useQuery({
    queryKey: ['donations'],
    queryFn: getDonations,
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => createDonation(data),
    onSuccess: (_, variables) => {
      toast.success(`Thank you for your generous donation of $${variables.amount}!`)
      setAmount("")
      queryClient.invalidateQueries({ queryKey: ['donations'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to process donation")
    }
  })

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid donation amount")
      return
    }

    createMutation.mutate({
      amount: Number(amount),
      paymentMethod: 'CREDIT_CARD', // Added to satisfy backend validation
      projectId: selectedProjectId === 'general' ? undefined : selectedProjectId,
    })
  }

  const isAdminOrStaff = user?.role === 'ADMIN' || user?.role === 'NGO_STAFF'
  const isDonor = user?.role === 'DONOR'

  return (
    <div className="space-y-8 max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-12rem)] justify-center py-8">
      <div>
        <Button variant="ghost" className="mb-4 -ml-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>

      {!user ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-6 text-center">
          <Heart className="w-16 h-16 text-primary mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Login to Donate</h1>
          <p className="text-muted-foreground max-w-md">
            To make a donation and track your impact, you need to be logged into your HopeBridge account.
          </p>
          <div className="flex gap-4 pt-4">
            <Button asChild size="lg">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Create an Account</Link>
            </Button>
          </div>
        </div>
      ) : !isAdminOrStaff ? (
        <div className="flex flex-col flex-1 justify-center space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Make a Donation</h1>
            <p className="text-muted-foreground">Your contribution helps us continue our mission and support communities in need.</p>
          </div>

          <div className={`grid gap-8 w-full ${isDonor ? 'md:grid-cols-2' : 'max-w-md mx-auto'}`}>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>One-time Donation</CardTitle>
                <CardDescription>Support our general fund to be used where it's needed most.</CardDescription>
              </CardHeader>
              <form onSubmit={handleDonate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Project</Label>
                    <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                      <SelectTrigger>
                        <SelectValue placeholder="General Fund" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Fund</SelectItem>
                        {projects.map((p: any) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
                      >
                        ${preset}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full gap-2" disabled={createMutation.isPending}>
                    <Heart className="w-4 h-4" /> {createMutation.isPending ? "Processing..." : "Donate Now"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {isDonor && (
              <Card className="w-full h-fit">
                <CardHeader>
                  <CardTitle>Your Impact</CardTitle>
                  <CardDescription>Thank you for your continued support.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Total Donated</span>
                      <span className="font-bold text-xl">
                        ${donations.reduce((acc: number, d: any) => acc + d.amount, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Projects Supported</span>
                      <span className="font-bold text-xl">
                        {new Set(donations.map((d: any) => d.projectId)).size}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 w-full">
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
                {isLoadingDonations ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                      Loading donations...
                    </TableCell>
                  </TableRow>
                ) : donations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                      No donations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  donations.map((don: any) => (
                    <TableRow key={don.id}>
                      <TableCell className="font-medium">{don.id.substring(0, 8)}...</TableCell>
                      <TableCell>{don.donor?.name || 'Anonymous'}</TableCell>
                      <TableCell>{don.project?.name || 'General Fund'}</TableCell>
                      <TableCell className="font-bold text-green-600 dark:text-green-500">${don.amount}</TableCell>
                      <TableCell>{new Date(don.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={don.status === 'SUCCESSFUL' ? 'default' : don.status === 'PENDING' ? 'secondary' : 'destructive'}>
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
