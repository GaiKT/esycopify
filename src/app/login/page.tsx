"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleAuth = async (type: 'login' | 'signup') => {
    setLoading(true)
    setError(null)
    
    if (!supabase) {
      setError("Supabase not configured")
      setLoading(false)
      return
    }

    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push("/")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4 w-1/2">
      <Card className="w-full max-w-md glass">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Esycopify</CardTitle>
          <CardDescription>Sign in or create an account to start managing templates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => handleAuth('login')} disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleAuth('signup')} disabled={loading}>
            Create Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
