import { Link } from "react-router-dom"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white py-12 mt-auto shadow-2xl overflow-hidden w-full">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative z-10">
        <div className="md:col-span-5">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white group transition-all duration-300 hover:scale-[1.03] active:scale-95 active:opacity-80 hover:drop-shadow-[0_0_12px_rgba(236,72,153,0.4)] mb-4 w-max">
            <Heart className="h-6 w-6 text-primary fill-primary group-hover:animate-pulse" />
            <span><span className="text-gradient">Hope</span><span className="text-white">Bridge</span></span>
          </Link>
          <p className="text-white/80 max-w-sm text-balance leading-relaxed">
            Empowering communities through education, food distribution, and sustainable development. Join us in building a better future.
          </p>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <h3 className="font-semibold text-lg mb-6 tracking-tight text-white">Navigation</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/events" className="group relative text-white/80 hover:text-primary transition-colors duration-300 inline-block">
                Events
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link to="/donate" className="group relative text-white/80 hover:text-primary transition-colors duration-300 inline-block">
                Donate
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link to="/register" className="group relative text-white/80 hover:text-primary transition-colors duration-300 inline-block">
                Become a Volunteer
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h3 className="font-semibold text-lg mb-6 tracking-tight text-white">Contact</h3>
          <ul className="space-y-3 text-white/80 text-sm">
            <li>Ahmedabad, Gujarat</li>
            <li><a href="mailto:info@hopebridge.org" className="hover:text-primary transition-colors">info@hopebridge.org</a></li>
            <li><a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60 relative z-10">
        <div>
          &copy; {new Date().getFullYear()} HopeBridge Foundation. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
