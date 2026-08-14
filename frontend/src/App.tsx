import { BrowserRouter, Routes, Route, Outlet, useLocation, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
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
import heroImage from "./assets/d.png"

// Create a client
const queryClient = new QueryClient()

const RootLayout = () => {
  const location = useLocation()
  
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* Light Ambient Blobs */}
      <div className="pointer-events-none fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[128px] -z-10 mix-blend-multiply dark:mix-blend-screen opacity-70 animate-blob"></div>
      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/30 rounded-full blur-[128px] -z-10 mix-blend-multiply dark:mix-blend-screen opacity-70 animate-blob animation-delay-4000"></div>
      
      <Navbar />
      <main key={location.pathname} className="flex-1 relative z-10 pt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
      {/* Decorative background elements for glassmorphism */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/30 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[50px] dark:bg-background/60"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="glass-panel rounded-[2rem] border border-white/40 dark:border-white/10 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both flex flex-col lg:flex-row">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none z-0"></div>
          
          {/* Left Text Content */}
          <div className="flex-1 p-10 md:p-14 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-700">
              ✨ Joining forces for a better tomorrow
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground drop-shadow-sm leading-[1.1] text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
              Empowering Communities, <br/><span className="text-gradient italic font-serif">Together.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-xl font-medium drop-shadow-sm text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
              Join the HopeBridge Foundation in making a real impact. Volunteer for events, donate to projects, and help us build a better future.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
              <Button size="lg" asChild>
                <Link to="/register">Join as Volunteer</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/donate">Make a Donation</Link>
              </Button>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="flex-1 relative min-h-[300px] lg:min-h-full w-full overflow-hidden group">
            <img 
              src={heroImage} 
              alt="Community" 
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[10000ms] ease-out group-hover:scale-110"
            />
            {/* Subtle gradient overlay to blend the edge slightly if desired, though user said borderless. A very light overlay helps text legibility if they overlap, but since it's a flex-row they shouldn't. */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent lg:hidden pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-transparent hidden lg:block pointer-events-none"></div>
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

