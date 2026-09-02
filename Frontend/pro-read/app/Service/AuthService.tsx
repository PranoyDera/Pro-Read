import { API_ENDPOINTS } from "@/app/Constants/Common";
import axiosInstance from "@/app/api/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  profilePic?: string;
};

export type BecomeAuthorPayload = {
  birthDate: string;
  bio?: string;
  reason?: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  profile_pic: string | null;
  role: "reader" | "author";
  is_verified: boolean;
  bio?: string | null;
  reason?: string | null;
  birth_date?: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthResponse = {
  message?: string;
  token?: string;
  user?: AuthUser;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.auth.login,
    payload
  );
  return response.data;
};

export const signup = async (payload: SignupPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.auth.signup,
    payload
  );
  return response.data;
};

export const me = async (): Promise<{ user: AuthUser }> => {
  const response = await axiosInstance.get<{ user: AuthUser }>(
    API_ENDPOINTS.auth.me
  );
  return response.data;
};

export const authService = {
  login,
  signup,
  me,
};
