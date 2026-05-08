export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const AUTH_TOKEN_KEY = "authToken";
export const AUTH_TOKEN_EVENT = "auth-token-changed";
export const PUBLIC_ROUTES = new Set(["/"]);
export const USER_ALLOWED_ROUTES = new Set(["/home"]);

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    me: "/api/auth/me",
  },
} as const;
