import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Esycopify",
  description: "Esycopify - จัดการงานของคุณอย่างง่าย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
            <div className="flex h-14 items-center justify-between px-4 md:px-8 lg:px-12 ">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Image
                    src="/main.svg"
                    alt="Esycopify"
                    width={24}
                    height={24}
                  />
                  Esycopify
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <ModeToggle />
                <UserNav />
              </div>
            </div>
          </header>
          <main className="min-h-[calc(100vh-3.5rem)] bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center justify-start ">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
