import { BrowserRouter, Routes, Route, Outlet, useLocation, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import bgImage from "./assets/background.webp"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./lib/auth"
import { Toaster } from "@/components/ui/sonner"
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
import { Reports } from "./pages/Reports"

// Create a client
const queryClient = new QueryClient()

const RootLayout = () => {
  const location = useLocation()
  
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* Light Ambient Blobs */}
      <div className="pointer-events-none fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[128px] -z-10 mix-blend-multiply"></div>
      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[128px] -z-10 mix-blend-multiply"></div>
      
      <Navbar />
      <main key={location.pathname} className="flex-1 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function HomePage() {
  return (
    <div 
      className="relative flex flex-col items-center lg:items-start justify-center min-h-[100dvh] py-20 -mt-16 w-full overflow-hidden"
    >
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'grayscale(20%)'
        }}
      >
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] dark:bg-background/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent dark:from-background dark:via-background/90"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
            ✨ Joining forces for a better tomorrow
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground drop-shadow-sm leading-[1.1] text-balance">
            Empowering Communities, <br/><span className="text-primary italic font-serif">Together.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-xl font-medium drop-shadow-sm text-balance">
            Join the HopeBridge Foundation in making a real impact. Volunteer for events, donate to projects, and help us build a better future.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <Button size="lg" asChild className="h-12 px-8 rounded-full shadow-xl shadow-primary/20 hover:-translate-y-1">
              <Link to="/register">Join as Volunteer</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-12 px-8 rounded-full bg-background/50 backdrop-blur-md shadow-lg hover:-translate-y-1">
              <Link to="/donate">Make a Donation</Link>
            </Button>
          </div>
        </div>
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
              <Route path="reports" element={<Reports />} />
              {/* Other dashboard routes will go here */}
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App

