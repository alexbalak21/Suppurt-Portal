/**
 * Debug logger — only outputs in development builds.
 * Replace console.log / console.debug calls with these helpers
 * to keep production bundles silent.
 */

const isDev = import.meta.env.DEV;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debug = isDev ? console.log.bind(console) : (..._args: any[]) => {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debugWarn = isDev ? console.warn.bind(console) : (..._args: any[]) => {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debugError = isDev ? console.error.bind(console) : (..._args: any[]) => {};
