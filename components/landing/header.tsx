import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="w-full max-w-6xl mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="hidden font-bold sm:inline-block">Finvase</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="#features">Features</Link>
            <Link href="#">Platform</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
