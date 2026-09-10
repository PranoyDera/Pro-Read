import { API_ENDPOINTS } from "@/app/consts/common";
import axiosInstance from "./config";

export interface UserStory {
  id: number;
  title: string;
  description: string;
  cover_pic: string | null;
  genre: string;
  read_time: string;
  status: "draft" | "published";
  likes_count: number;
  comments_count: number;
  reads_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string | null;
  gender?: string | null;
  profilePic?: string | null;
  coverPic?: string | null;
  role: "admin" | "author" | "reader" | "moderator";
  isVerified?: boolean;
  bio?: string | null;
  reason?: string | null;
  birthDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  tagline?: string;
}

export interface AuthorData {
  id: number;
  name: string;
  email: string;
  phone_number?: string | null;
  gender?: string | null;
  profile_pic?: string | null;
  cover_pic?: string | null;
  role: "author" | "admin" | "reader" | "moderator";
  is_verified?: boolean;
  bio?: string | null;
  reason?: string | null;
  birth_date?: string | null;
  created_at: string;
  updated_at: string;
  stories: UserStory[];
  total_stories_count: number;
  total_likes_count: number;
  total_reads_count: number;
}

export interface AuthorsApiResponse {
  message: string;
  count: number;
  authors: AuthorData[];
}

export interface UserProfileApiResponse {
  user: UserProfile;
  tags?: string[];
  readingStats?: Record<string, unknown>;
  unlockedAchievements?: unknown[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  profilePic?: string;
  coverPic?: string;
  bio?: string;
  reason?: string;
  birthDate?: string;
}

/**
 * Fetch all authors/creators with their stories and aggregate statistics
 * Endpoint: /api/user/authors
 */
export const getAuthors = async (): Promise<AuthorData[]> => {
  const response = await axiosInstance.get<AuthorsApiResponse>(
    API_ENDPOINTS.users.authors
  );
  return response.data.authors || [];
};

/**
 * Fetch the authenticated user's profile details
 * Endpoint: /api/user/profile
 */
export const getUserProfile = async (): Promise<UserProfileApiResponse> => {
  const response = await axiosInstance.get<UserProfileApiResponse>(
    API_ENDPOINTS.users.profile
  );
  return response.data;
};

/**
 * Update user details (name, email, phone, bio, pictures, etc.)
 * Endpoint: /api/user/update
 */
export const updateUser = async (
  payload: UpdateUserPayload
): Promise<{ message: string; user: UserProfile }> => {
  const response = await axiosInstance.patch<{
    message: string;
    user: UserProfile;
  }>("/api/user/update", payload);
  return response.data;
};

export const userService = {
  getAuthors,
  getUserProfile,
  updateUser,
};

export default userService;
