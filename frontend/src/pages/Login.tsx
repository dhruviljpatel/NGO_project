import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import heroImage from '@/assets/d.png'

export function Login() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login({ email, password })
      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="glass-panel w-full max-w-5xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Left Image Column */}
        <div className="md:w-1/2 relative hidden md:block min-h-[500px]">
          <img src={heroImage} alt="Login form" className="absolute inset-0 w-full h-full object-cover rounded-l-[2rem]" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
        </div>

        {/* Right Form Column */}
        <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none z-0"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-foreground w-max mb-8 transition-transform hover:scale-105">
              <Heart className="h-7 w-7 text-primary fill-primary" />
              <span><span className="text-gradient">Hope</span><span className="text-foreground">Bridge</span></span>
            </Link>

            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2" style={{letterSpacing: '1px'}}>Sign into your account</h2>
              <p className="text-muted-foreground">Access your dashboard to manage your activities.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5 flex-1">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm focus-visible:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm focus-visible:ring-primary/50"
                />
              </div>

              <div className="pt-2 pb-4">
                <Button type="submit" size="lg" className="w-full md:w-auto px-10 h-12 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>

              <div className="space-y-3">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors block" href="#!">Forgot password?</a>
                <p className="text-sm text-foreground">
                  Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register here</Link>
                </p>
              </div>
            </form>

            <div className="flex flex-row gap-4 mt-8 pt-4 border-t border-white/20 dark:border-white/10">
              <a href="#!" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of use</a>
              <a href="#!" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy policy</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
