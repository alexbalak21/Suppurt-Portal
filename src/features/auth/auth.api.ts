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
    throw new Error("Login failed");
  }
  return response.json();
};

export const register = async (payload: RegisterPayload) => {
  const response = await apiClient.post("/api/auth/register", payload);
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  return response.json();
};