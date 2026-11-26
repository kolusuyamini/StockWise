
import api from "./api";
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  User,
} from "../types/auth.types";

export const loginUser = async (data: LoginData) => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data
  );

  return response.data;
};

export const registerUser = async (data: RegisterData) => {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    data
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<{ success: boolean; user: User }>(
    "/auth/me"
  );

  return response.data;
};
