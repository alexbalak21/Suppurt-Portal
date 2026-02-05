// Utility map for all Tailwind CSS color names to their main bg classes (500/400 for light, 600/500 for dark)
// Add or adjust as needed for your palette and Tailwind config

export const tailwindColors: Record<string, { light: string; dark: string }> = {
  red: { light: "bg-red-400", dark: "dark:bg-red-500" },
  orange: { light: "bg-orange-400", dark: "dark:bg-orange-500" },
  amber: { light: "bg-amber-400", dark: "dark:bg-amber-500" },
  yellow: { light: "bg-yellow-400", dark: "dark:bg-yellow-500" },
  lime: { light: "bg-lime-400", dark: "dark:bg-lime-500" },
  green: { light: "bg-green-400", dark: "dark:bg-green-500" },
  emerald: { light: "bg-emerald-400", dark: "dark:bg-emerald-500" },
  teal: { light: "bg-teal-400", dark: "dark:bg-teal-500" },
  cyan: { light: "bg-cyan-400", dark: "dark:bg-cyan-500" },
  sky: { light: "bg-sky-400", dark: "dark:bg-sky-500" },
  blue: { light: "bg-blue-400", dark: "dark:bg-blue-500" },
  indigo: { light: "bg-indigo-400", dark: "dark:bg-indigo-500" },
  violet: { light: "bg-violet-400", dark: "dark:bg-violet-500" },
  purple: { light: "bg-purple-400", dark: "dark:bg-purple-500" },
  fuchsia: { light: "bg-fuchsia-400", dark: "dark:bg-fuchsia-500" },
  pink: { light: "bg-pink-400", dark: "dark:bg-pink-500" },
  rose: { light: "bg-rose-400", dark: "dark:bg-rose-500" },
  slate: { light: "bg-slate-400", dark: "dark:bg-slate-500" },
  gray: { light: "bg-gray-400", dark: "dark:bg-gray-500" },
  zinc: { light: "bg-zinc-400", dark: "dark:bg-zinc-500" },
  neutral: { light: "bg-neutral-400", dark: "dark:bg-neutral-500" },
  stone: { light: "bg-stone-400", dark: "dark:bg-stone-500" },
  brown: { light: "bg-yellow-900", dark: "dark:bg-yellow-800" }, // closest to brown
};
