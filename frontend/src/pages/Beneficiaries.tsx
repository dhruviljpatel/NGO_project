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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import { getBeneficiaries, createBeneficiary, updateBeneficiary } from "@/services/beneficiaries.service"
import { getProjects } from "@/services/projects.service"

const beneficiarySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  program: z.string().min(2, "Needs must be at least 2 characters."),
  status: z.enum(["Supported", "Pending", "In Progress", "Active", "Completed"]).optional(),
  projectId: z.string().optional(),
})

export function Beneficiaries() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null)

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const { data: beneficiaries = [], isLoading } = useQuery({
    queryKey: ['beneficiaries'],
    queryFn: getBeneficiaries,
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => createBeneficiary(data),
    onSuccess: () => {
      toast.success("Beneficiary added successfully!")
      setIsFormOpen(false)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['beneficiaries'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add beneficiary")
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateBeneficiary(selectedBeneficiary?.id, data),
    onSuccess: () => {
      toast.success("Beneficiary updated successfully!")
      setIsFormOpen(false)
      form.reset()
      setSelectedBeneficiary(null)
      queryClient.invalidateQueries({ queryKey: ['beneficiaries'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update beneficiary")
    }
  })

  const form = useForm<z.infer<typeof beneficiarySchema>>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      name: "",
      location: "",
      program: "",
      status: "Pending",
    },
  })

  if (user?.role !== 'ADMIN' && user?.role !== 'NGO_STAFF') {
    return <Navigate to="/dashboard" replace />
  }

  function onSubmit(values: z.infer<typeof beneficiarySchema>) {
    const payload = {
      ...values,
      needs: values.program,
    }
    
    if (isEditMode) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleCreateClick = () => {
    setIsEditMode(false)
    setSelectedBeneficiary(null)
    form.reset({
      name: "",
      location: "",
      program: "",
      status: "Pending",
      projectId: "",
    })
    setIsFormOpen(true)
  }

  const handleEditClick = (beneficiary: any) => {
    setIsEditMode(true)
    setSelectedBeneficiary(beneficiary)
    form.reset({
      name: beneficiary.name || "",
      location: beneficiary.location || "",
      program: beneficiary.needs || beneficiary.program || "",
      status: beneficiary.status || "Pending",
      projectId: beneficiary.projectId || "",
    })
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient inline-block mb-1 pb-1">Beneficiaries</h1>
          <p className="text-muted-foreground">Manage and track individuals and communities receiving aid.</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateClick}>Add Beneficiary</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Update Beneficiary" : "Add New Beneficiary"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Update beneficiary details." : "Register a new beneficiary in the system."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Rahul Patel" {...field} />
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
                        <Input placeholder="City or Village" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Needs / Program</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Education Materials" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((p: any) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Supported">Supported</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Beneficiary"}
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
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Primary Needs / Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  Loading beneficiaries...
                </TableCell>
              </TableRow>
            ) : beneficiaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  No beneficiaries found.
                </TableCell>
              </TableRow>
            ) : (
              beneficiaries.map((ben: any) => (
                <TableRow key={ben.id}>
                  <TableCell className="font-medium">{ben.name || ben.user?.email}</TableCell>
                  <TableCell>{ben.location || 'N/A'}</TableCell>
                  <TableCell>{ben.needs || ben.program || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={ben.status === 'Supported' || ben.status === 'Completed' || ben.status === 'Active' ? 'default' : ben.status === 'Pending' ? 'destructive' : 'secondary'}>
                      {ben.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(ben)}>Update</Button>
                    <Button variant="outline" size="sm">View History</Button>
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
