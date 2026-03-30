"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LoginButton } from "@/components/auth/login-button";
import { useSessionUser } from "@/components/auth/session-provider";
import { UserMenu } from "@/components/auth/user-menu";
import { Eye, Menu, Plus } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/topics", label: "Topics" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
];

export function AppHeader() {
  const { user, isLoading } = useSessionUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Eye className="h-5 w-5 text-primary" />
            <span>OpenFloor</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/submit">
                  <Plus className="h-4 w-4 mr-1" />
                  Submit Video
                </Link>
              </Button>
              <div className="hidden md:block">
                <UserMenu />
              </div>
            </>
          ) : isLoading ? null : (
            <div className="hidden md:block">
              <LoginButton label="Log In" />
            </div>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2" />
                {user ? (
                  <>
                    <Link href="/profile" className="text-lg" onClick={() => setOpen(false)}>
                      Profile
                    </Link>
                    <Link href="/bookmarks" className="text-lg" onClick={() => setOpen(false)}>
                      Bookmarks
                    </Link>
                  </>
                ) : isLoading ? null : (
                  <LoginButton label="Log In" />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
