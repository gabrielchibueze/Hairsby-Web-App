"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");

  // Check if current path is a dashboard path
  const isDashboardPath =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/provider");

  // Toggle theme only for dashboard paths
  const toggleTheme = () => {
    if (isDashboardPath) {
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }
  };

  // Apply theme class to HTML element
  useEffect(() => {
    const html = document.documentElement;
    if (isDashboardPath) {
      html.classList.remove("light", "dark");
      html.classList.add(theme);
    } else {
      // Force light theme for non-dashboard paths
      html.classList.remove("dark");
      html.classList.add("light");
    }
  }, [theme, pathname]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
