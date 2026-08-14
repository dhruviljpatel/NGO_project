import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, type Role } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import heroImage from '@/assets/d.png'

export function Register() {
  const navigate = useNavigate()
  const { user, register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('VOLUNTEER')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await register({ name, email, password, role })
      toast.success('Registered successfully')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="glass-panel w-full max-w-5xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Left Image Column */}
        <div className="md:w-1/2 relative hidden md:block min-h-[500px]">
          <img src={heroImage} alt="Register form" className="absolute inset-0 w-full h-full object-cover rounded-l-[2rem]" />
          <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay"></div>
        </div>

        {/* Right Form Column */}
        <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none z-0"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-foreground w-max mb-8 transition-transform hover:scale-105">
              <Heart className="h-7 w-7 text-primary fill-primary" />
              <span><span className="text-gradient">Hope</span><span className="text-foreground">Bridge</span></span>
            </Link>

            <div className="mb-6">
              <h2 className="text-3xl font-bold tracking-tight mb-2" style={{letterSpacing: '1px'}}>Create an account</h2>
              <p className="text-muted-foreground">Join HopeBridge and make a difference.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm focus-visible:ring-primary/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm focus-visible:ring-primary/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm focus-visible:ring-primary/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label>I want to join as a</Label>
                <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                  <SelectTrigger className="h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm focus-visible:ring-primary/50">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                    <SelectItem value="DONOR">Donor</SelectItem>
                    <SelectItem value="BENEFICIARY">Beneficiary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 pb-2">
                <Button type="submit" size="lg" className="w-full md:w-auto px-10 h-12 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-foreground">
                  Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login here</Link>
                </p>
              </div>
            </form>

            <div className="flex flex-row gap-4 mt-6 pt-4 border-t border-white/20 dark:border-white/10">
              <a href="#!" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of use</a>
              <a href="#!" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy policy</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
