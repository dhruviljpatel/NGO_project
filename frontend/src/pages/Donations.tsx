import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"

export function Donations() {
  const { user } = useAuth()
  const [amount, setAmount] = useState("")

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid donation amount")
      return
    }
    alert(`Thank you for your generous donation of $${amount}!`)
    setAmount("")
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Make a Donation</h1>
        <p className="text-muted-foreground">Your contribution helps us continue our mission and support communities in need.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>One-time Donation</CardTitle>
            <CardDescription>Support our general fund to be used where it's needed most.</CardDescription>
          </CardHeader>
          <form onSubmit={handleDonate}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="50" 
                    className="pl-8"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[10, 25, 50, 100].map(preset => (
                  <Button 
                    key={preset} 
                    type="button" 
                    variant="outline" 
                    onClick={() => setAmount(preset.toString())}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full gap-2">
                <Heart className="w-4 h-4" /> Donate Now
              </Button>
            </CardFooter>
          </form>
        </Card>

        {user?.role === 'Donor' && (
          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>Thank you for your continued support.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Total Donated</span>
                  <span className="font-bold text-xl">$1,250</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Projects Supported</span>
                  <span className="font-bold text-xl">3</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-bold text-xl">2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
