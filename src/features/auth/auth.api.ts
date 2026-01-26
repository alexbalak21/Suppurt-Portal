import { apiClient } from "../../shared/lib";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const response = await apiClient.post("/api/auth/login", payload);
  if (!response.ok) {
    // Prefer backend-provided message when available
    let message = "Login failed";
    try {
      const errorBody = await response.json();
      message = errorBody?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return response.json();
};

export const register = async (payload: RegisterPayload) => {
  const response = await apiClient.post("/api/auth/register", payload);
  if (!response.ok) {
    // Prefer backend-provided message when available (e.g., email already in use)
    let message = "Registration failed";
    try {
      const errorBody = await response.json();
      message = errorBody?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return response.json();
};