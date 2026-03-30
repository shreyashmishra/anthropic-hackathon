"use client";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  action?: string;
}

export function AuthGuard({ children }: AuthGuardProps) {
  return <>{children}</>;
}
