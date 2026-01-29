import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");

  // Apply theme to <html>
  const applyTheme = (t: Theme) => {
    if (t === "light") {
      console.log('🌙 applyTheme: Applying light mode')
      document.documentElement.classList.remove("dark");
    } else if (t === "dark") {
      console.log('🌙 applyTheme: Applying dark mode')
      document.documentElement.classList.add("dark");
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      console.log('🌙 applyTheme: System mode - OS prefers:', isDark ? 'dark' : 'light')
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Load saved theme mode on mount
  useEffect(() => {
    const saved = localStorage.getItem("themeMode") as Theme | null;
    const initial = saved || "system";
    console.log('🌙 useTheme initialized:')
    console.log('  - Saved in localStorage (themeMode):', saved)
    console.log('  - Using mode:', initial)
    setTheme(initial);
    applyTheme(initial);
  }, []);

  // Sync with OS theme when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  // Public setter
  const changeTheme = (t: Theme) => {
    console.log('🌙 changeTheme called:')
    console.log('  - New mode:', t)
    setTheme(t);
    localStorage.setItem("themeMode", t);
    console.log('  - Saved to localStorage: themeMode =', t)
    applyTheme(t);
  };

  return { theme, setTheme: changeTheme };
}