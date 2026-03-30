"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginButton({
  className,
  nextPath,
  label = "Log In",
  variant = "default",
}: {
  className?: string;
  nextPath?: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
}) {
  const pathname = usePathname();
  const target = nextPath ?? pathname ?? "/explore";
  const href = `/login?next=${encodeURIComponent(target)}`;

  return (
    <Button asChild className={className} variant={variant}>
      <Link href={href}>
        <LogIn className="h-4 w-4 mr-2" />
        {label}
      </Link>
    </Button>
  );
}
