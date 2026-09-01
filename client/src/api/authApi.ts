import api from "./axios";

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

export const registerUser = async (
  userData: RegisterData,
): Promise<AuthUser> => {
  const response = await api.post<RegisterResponse>("/auth/register", userData);

  return response.data.data;
};

export const loginUser = async (
  loginData: LoginData,
): Promise<AuthResponse["data"]> => {
  const response = await api.post<AuthResponse>("/auth/login", loginData);

  return response.data.data;
};
