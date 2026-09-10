import { API_ENDPOINTS } from "@/app/consts/common";
import axiosInstance, {
  setAdminAuthToken,
  clearAdminAuthToken,
  getAdminAuthToken,
} from "./config";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminSignupPayload = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export type AdminAuthResponse = {
  message?: string;
  token?: string;
  admin?: AdminUser;
};

export const login = async (payload: AdminLoginPayload): Promise<AdminAuthResponse> => {
  const response = await axiosInstance.post<AdminAuthResponse>(
    API_ENDPOINTS.admin.login,
    payload
  );
  if (response.data?.token) {
    setAdminAuthToken(response.data.token);
  }
  return response.data;
};

export const register = async (payload: AdminSignupPayload): Promise<AdminAuthResponse> => {
  const response = await axiosInstance.post<AdminAuthResponse>(
    API_ENDPOINTS.admin.register,
    payload
  );
  if (response.data?.token) {
    setAdminAuthToken(response.data.token);
  }
  return response.data;
};

export const me = async (): Promise<{ admin: AdminUser }> => {
  const response = await axiosInstance.get<{ admin: AdminUser }>(
    API_ENDPOINTS.admin.me
  );
  return response.data;
};

export const logout = (): void => {
  clearAdminAuthToken();
};

export const authService = {
  login,
  register,
  me,
  logout,
};

export { getAdminAuthToken };
