"use client";

import { useLocalStorage } from "./use-local-storage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";

interface UIPreferences {
  sortOrder: "top" | "new" | "controversial";
  viewMode: "grid" | "list";
}

const defaults: UIPreferences = {
  sortOrder: "top",
  viewMode: "grid",
};

export function useUIPreferences() {
  const [preferences, setPreferences] = useLocalStorage<UIPreferences>(LOCAL_STORAGE_KEYS.UI_PREFERENCES, defaults);

  const [collapsedIds, setCollapsedIds] = useLocalStorage<string[]>(LOCAL_STORAGE_KEYS.COLLAPSED_COMMENTS, []);

  const toggleCollapsed = (commentId: string) => {
    setCollapsedIds((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
    );
  };

  return { preferences, setPreferences, collapsedIds, toggleCollapsed };
}
