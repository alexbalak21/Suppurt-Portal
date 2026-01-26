export type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
  clearAccessToken: () => void;
  clearRefreshToken: () => void;
  authenticated: boolean;
  refreshAccessToken: () => Promise<string | null>;
  apiClient: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};