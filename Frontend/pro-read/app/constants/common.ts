export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const AUTH_TOKEN_KEY = "authToken";
export const AUTH_TOKEN_EVENT = "auth-token-changed";
export const PUBLIC_ROUTES = new Set(["/"]);
export const USER_ALLOWED_ROUTES = new Set([
  "/home",
  "/createStory",
  "/createNew",
  "/updateDraft/[id]",
  "/readStory/[id]"
]);

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    me: "/api/auth/me",
    becomeAuthor: "/api/auth/become-author",
  },
  user: {
    profile: "/api/user/profile",
    update: "/api/user/update",
    authors: "/api/user/authors",
    becomeAuthor: "/api/user/become-author",
  },
  stories: {
    base: "/api/stories",
    drafts: "/api/stories/drafts",
    draftUpdate: (id: string | number) => `/api/stories/drafts/${id}`,
    draftSingle: (authorId: string | number, id: string | number) => `/api/stories/drafts/${authorId}/${id}`,
    myPublished: "/api/stories/my-published",
    single: (id: string | number) => `/api/stories/${id}`,
    like: (id: string | number) => `/api/stories/${id}/like`,
    comments: (id: string | number) => `/api/stories/${id}/comments`,
    block: (id: string | number) => `/api/stories/${id}/block`,
  },
} as const;
