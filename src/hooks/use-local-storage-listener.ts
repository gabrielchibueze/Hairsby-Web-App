"use client";

import { useEffect, useState } from "react";

export function useLocalStorageListener(key: string) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    // Initial read
    setValue(localStorage.getItem(key));

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setValue(e.newValue);
      }
    };

    // Listen for changes from other tabs
    window.addEventListener("storage", handleStorageChange);

    // Listen for changes in the same tab
    const interval = setInterval(() => {
      const newValue = localStorage.getItem(key);
      if (newValue !== value) {
        setValue(newValue);
      }
    }, 100); // Check every 100ms

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [key, value]);

  return value;
}
