export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const ADMIN_AUTH_TOKEN_KEY = "adminAuthToken";
export const ADMIN_AUTH_TOKEN_EVENT = "admin-auth-token-changed";

export const API_ENDPOINTS = {
  admin: {
    login: "/api/admin/login",
    register: "/api/admin/register",
    me: "/api/admin/me",
  },
  stories: {
    base: "/api/stories",
    single: (id: string | number) => `/api/stories/${id}`,
    block: (id: string | number) => `/api/stories/${id}/block`,
    feature: (id: string | number) => `/api/stories/${id}/feature`,
  },
  users: {
    profile: "/api/user/profile",
    authors: "/api/user/authors",
  },
  achievements: {
    base: "/api/achievements",
    single: (id: string | number) => `/api/achievements/${id}`,
  },
} as const;
