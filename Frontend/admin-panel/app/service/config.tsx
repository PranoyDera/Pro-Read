import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  API_BASE_URL,
  ADMIN_AUTH_TOKEN_KEY,
  ADMIN_AUTH_TOKEN_EVENT,
} from "@/app/consts/common";

const isBrowser = typeof window !== "undefined";

export const getStoredAdminToken = (): string | null => {
  if (!isBrowser) return null;
  return window.localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
};

export const setAdminAuthToken = (token: string): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
  window.dispatchEvent(new Event(ADMIN_AUTH_TOKEN_EVENT));
};

export const clearAdminAuthToken = (): void => {
  if (!isBrowser) return;
  window.localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event(ADMIN_AUTH_TOKEN_EVENT));
};

export const getAdminAuthToken = (): string | null => getStoredAdminToken();

// Create Axios Instance for Admin Panel
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Admin Bearer Token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAdminToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If body is FormData, delete default Content-Type so browser sets boundary automatically
    if (isBrowser && config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle unauthenticated or forbidden responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearAdminAuthToken();
      if (isBrowser && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
