"use client";

import { useLocalStorage } from "./use-local-storage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { useCallback } from "react";

interface RecentItem {
  type: "video" | "clip";
  id: string;
  title: string;
  viewedAt: string;
}

const MAX_ITEMS = 20;

export function useRecentlyViewed() {
  const [items, setItems] = useLocalStorage<RecentItem[]>(LOCAL_STORAGE_KEYS.RECENTLY_VIEWED, []);

  const addViewed = useCallback(
    (item: Omit<RecentItem, "viewedAt">) => {
      setItems((prev) => {
        const filtered = prev.filter((i) => !(i.id === item.id && i.type === item.type));
        return [{ ...item, viewedAt: new Date().toISOString() }, ...filtered].slice(0, MAX_ITEMS);
      });
    },
    [setItems]
  );

  return { recentItems: items, addViewed };
}
