import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  API_BASE_URL,
  AUTH_TOKEN_EVENT,
  AUTH_TOKEN_KEY,
} from "@/app/Constants/Common";

const isBrowser = typeof window !== "undefined";

const getStoredToken = (): string | null => {
  if (!isBrowser) return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
};

export const clearAuthToken = (): void => {
  if (!isBrowser) return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
};

export const getAuthToken = (): string | null => getStoredToken();

// Create Axios Instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to attach Authorization header dynamically
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for handling unified errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
