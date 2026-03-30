import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between max-w-7xl mx-auto">
      <Link href="/" className="font-serif text-xl italic flex items-center gap-2">
        <span className="text-blue-700">Civic</span>
        <span>Brief</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          How it works
        </Link>
        <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          FAQ
        </Link>
        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          About
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          Log in
        </Button>
        <Button size="sm" asChild className="rounded-full bg-blue-700 text-white hover:bg-blue-800 px-5">
          <Link href="/demo">Try Demo</Link>
        </Button>
      </div>
    </header>
  )
}
