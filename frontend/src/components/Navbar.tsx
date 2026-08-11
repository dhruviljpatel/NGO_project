import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import { Button } from "./ui/button"

export function Navbar() {
  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Heart className="h-6 w-6 text-accent" fill="currentColor" />
          HopeBridge
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/events" className="text-sm font-medium hover:text-primary transition-colors">
            Events
          </Link>
          <Link to="/donate" className="text-sm font-medium hover:text-primary transition-colors">
            Donate
          </Link>
          <div className="h-4 w-px bg-border" />
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
