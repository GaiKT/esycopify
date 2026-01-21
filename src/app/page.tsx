"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Copy,
  FileText,
  Zap,
  ArrowRight,
  CheckCircle2,
  LayoutTemplate,
  Variable,
  MousePointerClick,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);

    // Check if user is already logged in
    const checkAuth = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        // User is logged in, redirect to dashboard
        router.push("/dashboard");
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, supabase]);

  // Loading state
  if (!isMounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-purple-500" />
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: LayoutTemplate,
      title: "จัดการเทมเพลตง่ายๆ",
      description:
        "สร้างและจัดระเบียบเทมเพลตข้อความด้วย Kanban Board ที่ใช้งานง่าย",
    },
    {
      icon: Variable,
      title: "ตัวแปรอัจฉริยะ",
      description: "ใช้ {{ตัวแปร}} ในข้อความ แล้วกรอกค่าตอนคัดลอกได้เลย",
    },
    {
      icon: MousePointerClick,
      title: "คัดลอกด้วยคลิกเดียว",
      description: "คลิกที่การ์ดเพื่อคัดลอกข้อความได้ทันที พร้อมใช้งานได้เลย",
    },
    {
      icon: Zap,
      title: "ลากและวางได้",
      description: "จัดเรียงและย้ายการ์ดระหว่างรายการด้วยการลากและวาง",
    },
  ];

  const useCases = [
    "ข้อความตอบลูกค้า",
    "เทมเพลตอีเมล",
    "ข้อความขายสินค้า",
    "FAQ ที่ใช้บ่อย",
    "ข้อความทักทาย",
    "ข้อมูลติดต่อ",
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 dark:from-purple-500/20 dark:via-pink-500/10 dark:to-blue-500/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              จัดการเทมเพลตข้อความอย่างมืออาชีพ
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Esycopify
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              สร้าง จัดการ และคัดลอกข้อความเทมเพลตได้ง่ายๆ
              <br className="hidden md:block" />
              พร้อมระบบตัวแปรที่ช่วยประหยัดเวลาในการทำงาน
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
                onClick={() => router.push("/login")}
              >
                เริ่มต้นใช้งาน
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => router.push("/login")}
              >
                เข้าสู่ระบบ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ทำไมต้องใช้ Esycopify?
            </h2>
            <p className="text-lg text-muted-foreground">
              เครื่องมือที่ช่วยให้การจัดการข้อความเทมเพลตเป็นเรื่องง่าย
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "p-6 rounded-2xl border bg-white dark:bg-slate-800/50",
                  "hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300",
                  "hover:-translate-y-1"
                )}
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                ใช้ตัวแปรในข้อความ
                <br />
                <span className="text-purple-600">ประหยัดเวลาได้มาก</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                เพียงใส่ตัวแปรในรูปแบบ {"{{ชื่อ}}"} ในข้อความของคุณ เมื่อคัดลอก
                ระบบจะให้คุณกรอกค่าได้ทันที
              </p>

              <div className="space-y-3">
                {[
                  "รองรับตัวแปรไม่จำกัด",
                  "กรอกค่าและคัดลอกในขั้นตอนเดียว",
                  "บันทึกค่าที่ใช้บ่อยได้",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-20" />
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl border shadow-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  ตัวอย่างเทมเพลต
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 font-mono text-sm">
                  <p>
                    สวัสดีคุณ{" "}
                    <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-1 rounded">
                      {"{{ชื่อลูกค้า}}"}
                    </span>
                    ,
                  </p>
                  <p className="mt-2">ขอบคุณที่สั่งซื้อสินค้ากับเรา</p>
                  <p>
                    รหัสออเดอร์:{" "}
                    <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-1 rounded">
                      {"{{รหัสออเดอร์}}"}
                    </span>
                  </p>
                  <p className="mt-2">
                    หากมีคำถามติดต่อ{" "}
                    <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-1 rounded">
                      {"{{เบอร์โทร}}"}
                    </span>
                  </p>
                </div>
                <Button className="w-full" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  คลิกเพื่อคัดลอก (พร้อมกรอกค่า)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            เหมาะสำหรับทุกการใช้งาน
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            ไม่ว่าจะเป็นงานประเภทไหน Esycopify ก็ช่วยคุณได้
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {useCases.map((useCase, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full border text-sm font-medium hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-default"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-12 text-center text-white">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
            <div className="relative space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                พร้อมเริ่มต้นใช้งานแล้วหรือยัง?
              </h2>
              <p className="text-lg text-white/80">
                สร้างบัญชีฟรีและเริ่มจัดการเทมเพลตข้อความของคุณได้เลย
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
                onClick={() => router.push("/login")}
              >
                เริ่มต้นใช้งาน
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>
            © 2026 Esycopify. สร้างด้วย ❤️
            สำหรับทุกคนที่ต้องการจัดการเทมเพลตข้อความ
          </p>
        </div>
      </footer>
    </div>
  );
}
