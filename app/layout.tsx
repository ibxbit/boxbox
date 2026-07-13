import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "BOXBOX — rate every Grand Prix",
  description:
    "The Letterboxd for Formula 1. Discover, rate and review every F1 race since 1950.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-8">
              <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-4 text-xs text-muted-foreground">
                <span className="font-black uppercase tracking-tighter">
                  BOXBOX <span className="font-medium normal-case tracking-normal">— the Letterboxd for Formula 1</span>
                </span>
                <span>fan project · race data via the Jolpica F1 API · not affiliated with F1</span>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
