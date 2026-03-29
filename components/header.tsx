import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between max-w-7xl mx-auto">
      <Link href="/" className="font-serif text-xl italic">
        outbuild.io
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Use cases
        </Link>
        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Pricing
        </Link>
        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Help center
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          Login
        </Button>
        <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
          Sign up
        </Button>
      </div>
    </header>
  )
}
