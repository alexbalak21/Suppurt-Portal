// shared/lib/apiClient.ts

// Base URL configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8100';

const buildUrl = (path: string): string => {
  return `${BASE_URL}${path}`;
};

export const apiClient = {
  get: (url: string) =>
    fetch(buildUrl(url), { credentials: "include" }),

  post: (url: string, body: unknown) =>
    fetch(buildUrl(url), {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }),

  put: (url: string, body: unknown) =>
    fetch(buildUrl(url), {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }),

  delete: (url: string) =>
    fetch(buildUrl(url), {
      method: "DELETE",
      credentials: "include",
    }),
};