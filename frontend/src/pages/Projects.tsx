import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const MOCK_PROJECTS = [
  {
    id: "1",
    name: "Rural Education Initiative",
    goal: "Provide educational resources to rural students.",
    startDate: "01/07/2026",
    endDate: "31/12/2026",
    targetBeneficiaries: 500,
    currentBeneficiaries: 320,
    status: "Active",
  },
  {
    id: "2",
    name: "Clean Water Access",
    goal: "Install water purifiers in remote villages.",
    startDate: "15/08/2026",
    endDate: "15/11/2026",
    targetBeneficiaries: 1000,
    currentBeneficiaries: 1000,
    status: "Completed",
  }
]

export function Projects() {
  const { user } = useAuth()
  const [projects] = useState(MOCK_PROJECTS)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Monitor ongoing and past initiatives.</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'NGO Staff') && (
          <Button>Create Project</Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => {
          const progressPercent = Math.min(100, Math.round((project.currentBeneficiaries / project.targetBeneficiaries) * 100))
          
          return (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={project.status === "Completed" ? "secondary" : "default"}>
                    {project.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{project.startDate} - {project.endDate}</span>
                </div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.goal}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Beneficiaries Reached</span>
                    <span className="font-medium">{project.currentBeneficiaries} / {project.targetBeneficiaries}</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" className="w-full">View Details</Button>
                {user?.role === 'Donor' && project.status === 'Active' && (
                  <Button className="w-full" asChild>
                    <Link to={`/donate?project=${project.id}`}>Support Project</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
