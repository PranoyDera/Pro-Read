import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
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
    // If body is FormData, delete default Content-Type so browser sets boundary automatically
    if (typeof window !== "undefined" && config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Keep track of the last toast timestamp to avoid spamming the user on parallel requests
let lastNetworkToastTime = 0;
const TOAST_COOLDOWN_MS = 3000;

const showNetworkErrorToast = (message: string) => {
  if (!isBrowser) return;
  const now = Date.now();
  if (now - lastNetworkToastTime > TOAST_COOLDOWN_MS) {
    lastNetworkToastTime = now;
    toast.error(message);
  }
};

// Response Interceptor for handling unified errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // Check if network error or backend connection failed (no response from server)
    const isNetworkError =
      !error.response ||
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      error.message === "Network Error";

    // 5xx Server Error (backend is failing / crashed)
    const isServerError =
      Boolean(error.response?.status && error.response.status >= 500);

    if (isNetworkError) {
      showNetworkErrorToast("Server connection error. Please check your backend or network.");
      return new Promise(() => {});
    }

    if (isServerError) {
      showNetworkErrorToast(
        error.response?.data?.message || "Internal server error. Please try again later."
      );
      return new Promise(() => {});
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      clearAuthToken();
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
