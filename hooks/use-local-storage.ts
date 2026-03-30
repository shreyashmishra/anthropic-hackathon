"use client";

import { useState, useEffect, useCallback } from "react";
import { getItem, setItem } from "@/lib/local-storage";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    setStoredValue(getItem(key, initialValue));
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        setItem(key, newValue);
        return newValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
