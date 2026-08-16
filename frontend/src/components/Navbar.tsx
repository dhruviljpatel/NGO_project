import { Link, useNavigate } from "react-router-dom"
import { Heart } from "lucide-react"
import { Button } from "./ui/button"
import { useAuth } from "@/lib/auth"

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 bg-background/20 backdrop-blur-[24px] border-b border-white/20 dark:border-white/10 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-foreground group transition-all duration-300 hover:scale-[1.03] active:scale-95 active:opacity-80 hover:drop-shadow-[0_0_12px_rgba(236,72,153,0.4)]">
          <Heart className="h-6 w-6 text-primary fill-primary group-hover:animate-pulse" />
          <span><span className="text-gradient">Hope</span><span className="text-foreground">Bridge</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/events" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
            Events
          </Link>
          <Link to="/donate" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
            Donate
          </Link>
          <div className="h-4 w-px bg-border/50" />
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" className="bg-white hover:bg-white/90" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="secondary" className="bg-white hover:bg-white/90" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
