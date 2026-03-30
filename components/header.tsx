"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { useSessionUser } from "@/components/auth/session-provider";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/sources", label: "Sources" },
  { href: "/topics", label: "Topics" },
  { href: "/about", label: "About" },
];

export function Header() {
  const { user, isLoading } = useSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            OF
          </span>
          <span>OpenFloor</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="rounded-full px-5">
            <Link href="/explore">Browse Public Clips</Link>
          </Button>
          {isLoading ? null : user ? (
            <Button asChild variant="outline" size="sm" className="rounded-full px-5 bg-background/80">
              <Link href="/submit">Submit a Debate</Link>
            </Button>
          ) : (
            <LoginButton variant="outline" className="rounded-full px-5 bg-background/80" label="Log In" />
          )}
        </div>
      </div>
    </header>
  );
}
