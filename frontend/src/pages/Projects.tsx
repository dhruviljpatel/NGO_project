import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Calendar, Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
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
import { Textarea } from "@/components/ui/textarea"
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
import { getProjects, createProject, updateProject } from "@/services/projects.service"

const projectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  goal: z.string().optional(),
  description: z.string().min(2, "Description must be at least 2 characters."),
  startDate: z.string().min(1, "Start Date is required."),
  endDate: z.string().optional(),
  targetBeneficiaries: z.coerce.number().min(1, "Target must be at least 1."),
  status: z.enum(["ACTIVE", "COMPLETED"]).optional(),
})

export function Projects() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => createProject(data),
    onSuccess: () => {
      toast.success("Project created successfully!")
      setIsFormOpen(false)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create project")
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateProject(selectedProject?.id, data),
    onSuccess: () => {
      toast.success("Project updated successfully!")
      setIsFormOpen(false)
      form.reset()
      setSelectedProject(null)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update project")
    }
  })

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      goal: "",
      description: "",
      startDate: "",
      endDate: "",
      targetBeneficiaries: 100,
      status: "ACTIVE",
    },
  })

  function onSubmit(values: z.infer<typeof projectSchema>) {
    const payload: any = {
      name: values.name,
      description: values.description,
      targetBeneficiaries: values.targetBeneficiaries,
      startDate: new Date(values.startDate).toISOString(),
    }
    if (values.endDate) payload.endDate = new Date(values.endDate).toISOString();
    if (values.goal) payload.goal = Number(values.goal);
    if (values.status) payload.status = values.status;

    if (isEditMode) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleCreateClick = () => {
    setIsEditMode(false)
    setSelectedProject(null)
    form.reset({
      name: "",
      goal: "",
      description: "",
      startDate: "",
      endDate: "",
      targetBeneficiaries: 100,
      status: "ACTIVE", // Updated default status to match options
    })
    setIsFormOpen(true)
  }

  const handleEditClick = (project: any) => {
    setIsEditMode(true)
    setSelectedProject(project)
    form.reset({
      name: project.name,
      description: project.description,
      targetBeneficiaries: project.targetBeneficiaries,
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
      status: project.status || "ACTIVE",
      goal: project.goal?.toString() || "",
    })
    setIsFormOpen(true)
  }

  const handleViewClick = (project: any) => {
    setSelectedProject(project)
    setIsViewOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient inline-block mb-1 pb-1">Projects</h1>
          <p className="text-muted-foreground">Monitor ongoing and past initiatives.</p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'NGO_STAFF') && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateClick}>Create Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Project" : "Create New Project"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "Update the project's details." : "Define a new initiative and set its goals."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Rural Education Initiative" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="targetBeneficiaries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Beneficiaries</FormLabel>
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
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Goal ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 5000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Details about this project..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Project"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="text-center p-8 border rounded-lg bg-card text-muted-foreground">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-card text-muted-foreground">
          No projects found.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project: any) => {
            const currentCount = project.beneficiaries?.length || 0;
            const progressPercent = Math.min(100, Math.round((currentCount / project.targetBeneficiaries) * 100))
            
            return (
              <Card key={project.id} className="glass-card flex flex-col rounded-none border border-white/20 dark:border-white/10 group overflow-hidden relative p-0 shadow-sm hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 hover:z-10 transition-all duration-300">
                {/* Generic Image Placeholder Section */}
                <div className="relative h-36 w-full bg-[#1F2937] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20 text-white" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
                  <Heart className="w-10 h-10 text-white/20 group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Top-left Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <Badge variant={project.status === "COMPLETED" ? "secondary" : "default"} className="bg-background/90 backdrop-blur-sm text-foreground border-none px-2 py-0.5 text-[10px] shadow-sm font-medium rounded-sm">
                      {project.status}
                    </Badge>
                  </div>
                  
                  {/* Curved overlay effect */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[150%] h-12 bg-background rounded-[100%] z-10"></div>
                  {/* Glassmorphism subtle overlay to blend with bg-background */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[150%] h-12 bg-background/50 backdrop-blur-xl rounded-[100%] z-10"></div>
                </div>

                {/* Overlapping Circular Progress */}
                <div className="relative z-20 flex justify-center -mt-8 mb-2">
                  <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center shadow border-[3px] border-background relative">
                     <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                        <circle cx="28" cy="28" r="25" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted/30" />
                        <circle 
                          cx="28" 
                          cy="28" 
                          r="25" 
                          stroke="url(#gradient)" 
                          strokeWidth="4" 
                          fill="none" 
                          strokeDasharray="157" 
                          strokeDashoffset={157 - (157 * progressPercent) / 100} 
                          strokeLinecap="round" 
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--secondary))" />
                          </linearGradient>
                        </defs>
                     </svg>
                     <span className="text-sm font-bold text-foreground">{progressPercent}%</span>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex flex-col flex-1 relative z-10">
                  {/* Date / Time Remaining */}
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium mb-2 justify-center bg-muted/30 w-max mx-auto px-2 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3 text-primary" />
                    {new Date(project.startDate).toLocaleDateString()} {project.endDate ? `- ${new Date(project.endDate).toLocaleDateString()}` : ''}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-base font-bold tracking-tight text-center mb-4 line-clamp-2 hover:text-primary transition-colors cursor-pointer leading-tight" onClick={() => handleViewClick(project)}>
                    {project.name}
                  </h3>
                  
                  {/* Stats Flex */}
                  <div className="flex justify-between items-center text-xs font-medium border-t border-border/50 pt-3 mt-auto mb-4">
                    <div className="text-center flex-1 border-r border-border/50 last:border-r-0">
                      <span className="block text-muted-foreground text-[10px] mb-0.5 uppercase tracking-wider">Goal</span>
                      <span className="text-foreground font-semibold">{project.targetBeneficiaries}</span>
                    </div>
                    <div className="text-center flex-1 border-r border-border/50 last:border-r-0">
                      <span className="block text-muted-foreground text-[10px] mb-0.5 uppercase tracking-wider">Reached</span>
                      <span className="text-foreground font-semibold">{currentCount}</span>
                    </div>
                    {project.goal && (
                      <div className="text-center flex-1 border-r border-border/50 last:border-r-0">
                        <span className="block text-muted-foreground text-[10px] mb-0.5 uppercase tracking-wider">Fund</span>
                        <span className="text-primary font-bold">${project.goal}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2 mt-auto">
                    <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => handleViewClick(project)}>View Details</Button>
                    {user?.role === 'DONOR' && project.status === 'ACTIVE' && (
                      <Button size="sm" className="w-full text-xs h-8" asChild>
                        <Link to={`/dashboard/donate?project=${project.id}`}>Donate Now</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              Detailed information about the project.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedProject.name}</h3>
                <div className="flex gap-2 mt-2">
                  <Badge variant={selectedProject.status === "COMPLETED" ? "secondary" : "default"}>
                    {selectedProject.status}
                  </Badge>
                  {selectedProject.goal && (
                    <Badge variant="outline">Goal: ${selectedProject.goal}</Badge>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Duration:</span> {new Date(selectedProject.startDate).toLocaleDateString()} 
                  {selectedProject.endDate ? ` - ${new Date(selectedProject.endDate).toLocaleDateString()}` : ' - Ongoing'}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-foreground">Target Beneficiaries:</span> {selectedProject.targetBeneficiaries}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedProject.description}</p>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                {(user?.role === 'ADMIN' || user?.role === 'NGO_STAFF') && (
                  <Button variant="outline" onClick={() => {
                    setIsViewOpen(false)
                    handleEditClick(selectedProject)
                  }}>
                    Edit Project
                  </Button>
                )}
                <Button onClick={() => setIsViewOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
