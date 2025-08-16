import React from "react";
import { Button } from "@/components/shadcn/button";
import { Logo } from "@/components/ui/logo";
import { COLORS } from "@/lib/constants/COLORS";

function LandingHeader() {
  return (
    <>
      {" "}
      <div className="fixed top-0 left-0 right-0 z-40 p-4 sm:p-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-card/80 backdrop-blur-lg border border-border rounded-2xl shadow-lg">
            <div
              className={`${COLORS.indigo.light_variant_with_border.class} rounded-2xl px-6 py-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Logo size={32} className="text-foreground" />
                    <h1 className="text-xl text-foreground">Finvase</h1>
                  </div>
                  <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <a
                      href="#features"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Features
                    </a>
                    <a
                      href="#platform"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Platform
                    </a>
                    <a
                      href="#pricing"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </a>
                  </nav>
                </div>
                <div className="hidden sm:flex items-center space-x-4">
                  <a
                    href="/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Login
                  </a>
                  <Button size="sm" className="px-6">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative bg-background overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top Right Circle */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-red-400/20 via-orange-400/20 to-yellow-400/20 blur-3xl"></div>

        {/* Bottom Left Circle */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-teal-400/20 via-blue-400/20 to-indigo-400/20 blur-3xl"></div>

        {/* Middle Right Circle */}
        <div className="absolute top-1/2 -right-48 w-80 h-80 rounded-full bg-gradient-to-l from-purple-400/15 via-pink-400/15 to-rose-400/15 blur-2xl"></div>

        {/* Subtle geometric lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 1200 800"
        >
          <path
            d="M0,400 Q300,200 600,400 T1200,400"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M0,200 Q400,100 800,200 T1200,200"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M0,600 Q200,500 400,600 T800,600"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </div>

      <LandingHeader />
      {children}
    </div>
  );
}
