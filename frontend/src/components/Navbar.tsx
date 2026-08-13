import { Link, useNavigate } from "react-router-dom"
import { Heart } from "lucide-react"
import { Button } from "./ui/button"
import { useAuth } from "@/lib/auth"

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="glass-panel sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-foreground">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          Hope<span className="text-primary font-serif italic">Bridge</span>
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
              <Button variant="ghost" className="font-semibold text-foreground/80 hover:text-primary" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" className="rounded-full px-6" onClick={() => { logout(); navigate('/'); }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="font-semibold text-foreground/80 hover:text-primary" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="rounded-full px-6 shadow-md shadow-primary/20 hover:-translate-y-0.5" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
