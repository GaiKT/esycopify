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
      <Card className="w-full max-w-lg glass shadow-2xl border-t-white/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            ยินดีต้อนรับสู่ Esycopify
          </CardTitle>
          <CardDescription className="text-center text-lg">
            เข้าสู่ระบบหรือสร้างบัญชีใหม่เพื่อเริ่มจัดการเทมเพลตของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg text-center font-medium">{error}</p>}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-lg">อีเมล</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="h-12 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="password"className="text-lg">รหัสผ่าน</Label>
            <Input 
              id="password" 
              type="password" 
              className="h-12 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button size="lg" className="w-full text-lg shadow-lg hover:shadow-primary/20" onClick={() => handleAuth('login')} disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
          <Button variant="outline" size="lg" className="w-full text-lg" onClick={() => handleAuth('signup')} disabled={loading}>
            สร้างบัญชีใหม่
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
