import { API_ENDPOINTS } from "@/app/constants/common";

import { get, post } from "./api";

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

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  profile_pic: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthResponse = {
  message?: string;
  token?: string;
  user?: AuthUser;
};

export const login = (payload: LoginPayload) => {
  return post<AuthResponse, LoginPayload>(API_ENDPOINTS.auth.login, payload);
};

export const signup = (payload: SignupPayload) => {
  return post<AuthResponse, SignupPayload>(API_ENDPOINTS.auth.signup, payload);
};

export const me = () => {
  return get<{ user: AuthUser }>(API_ENDPOINTS.auth.me, { withAuth: true });
};

export const authApi = {
  login,
  signup,
  me,
};
