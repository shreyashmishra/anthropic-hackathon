"use client";

import { useLocalStorage } from "./use-local-storage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { useCallback, useRef, useEffect } from "react";

export function useDraftComment(clipId: string) {
  const key = `${LOCAL_STORAGE_KEYS.DRAFT_COMMENT}:${clipId}`;
  const [draft, setDraft] = useLocalStorage<string>(key, "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setDraftDebounced = useCallback(
    (value: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setDraft(value), 1000);
    },
    [setDraft]
  );

  const clearDraft = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDraft("");
  }, [setDraft]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { draft, setDraft: setDraftDebounced, clearDraft };
}
