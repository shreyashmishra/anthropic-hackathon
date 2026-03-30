"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { SessionUser } from "@/lib/auth";

interface SessionContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  setUser: (user: SessionUser | null) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/session", { cache: "no-store" });
      const data = await response.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      refresh,
      setUser,
    }),
    [user, isLoading, refresh]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionUser() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSessionUser must be used within a SessionProvider");
  }

  return context;
}
