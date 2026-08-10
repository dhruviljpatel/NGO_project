import { Link } from "react-router-dom"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-8 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-foreground mb-4">
            <Heart className="h-6 w-6 text-accent" fill="currentColor" />
            HopeBridge
          </Link>
          <p className="text-muted/80 max-w-sm">
            Empowering communities through education, food distribution, and sustainable development.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/events" className="hover:text-accent transition-colors">Events</Link></li>
            <li><Link to="/donate" className="hover:text-accent transition-colors">Donate</Link></li>
            <li><Link to="/volunteer" className="hover:text-accent transition-colors">Become a Volunteer</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-2 text-muted/80 text-sm">
            <li>Ahmedabad, Gujarat</li>
            <li>info@hopebridge.org</li>
            <li>+91 98765 43210</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-4 border-t border-background/20 text-center text-sm text-muted/60">
        &copy; {new Date().getFullYear()} HopeBridge Foundation. All rights reserved.
      </div>
    </footer>
  )
}
