import { Link } from "react-router-dom"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="glass-panel py-12 mt-auto rounded-t-3xl border-b-0 border-x-0 mx-2">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-5">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-foreground mb-4">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            Hope<span className="text-primary font-serif italic">Bridge</span>
          </Link>
          <p className="text-foreground/70 max-w-sm text-balance leading-relaxed">
            Empowering communities through education, food distribution, and sustainable development. Join us in building a better future.
          </p>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <h3 className="font-semibold text-lg mb-6 tracking-tight">Navigation</h3>
          <ul className="space-y-3">
            <li><Link to="/events" className="text-foreground/70 hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300">Events</Link></li>
            <li><Link to="/donate" className="text-foreground/70 hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300">Donate</Link></li>
            <li><Link to="/register" className="text-foreground/70 hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300">Become a Volunteer</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h3 className="font-semibold text-lg mb-6 tracking-tight">Contact</h3>
          <ul className="space-y-3 text-foreground/70 text-sm">
            <li>Ahmedabad, Gujarat</li>
            <li><a href="mailto:info@hopebridge.org" className="hover:text-primary transition-colors">info@hopebridge.org</a></li>
            <li><a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
        <div>
          &copy; {new Date().getFullYear()} HopeBridge Foundation. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
