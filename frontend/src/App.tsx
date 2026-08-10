import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./lib/auth"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { DashboardLayout } from "./components/DashboardLayout"
import { Dashboard } from "./pages/Dashboard"
import { Events } from "./pages/Events"
import { ManageEvents } from "./pages/ManageEvents"
import { Volunteers } from "./pages/Volunteers"
import { Projects } from "./pages/Projects"
import { Donations } from "./pages/Donations"
import { Beneficiaries } from "./pages/Beneficiaries"

// Create a client
const queryClient = new QueryClient()

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
        Empowering Communities, <span className="text-primary">Together.</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
        Join the HopeBridge Foundation in making a real impact. Volunteer for events, donate to projects, and help us build a better future.
      </p>
      <div className="flex justify-center gap-4">
        <a href="/register" className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-medium text-accent-foreground shadow transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Join as Volunteer
        </a>
        <a href="/donate" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Make a Donation
        </a>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="events" element={<Events />} />
              <Route path="donate" element={<Donations />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="volunteers" element={<Volunteers />} />
              <Route path="projects" element={<Projects />} />
              <Route path="donations" element={<Donations />} />
              <Route path="beneficiaries" element={<Beneficiaries />} />
              {/* Other dashboard routes will go here */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
