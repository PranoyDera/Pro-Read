import { API_ENDPOINTS } from "@/app/Constants/Common";
import axiosInstance from "@/app/api/api";

export type AuthorStory = {
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
};

export type AuthorData = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  profile_pic: string | null;
  cover_pic?: string | null;
  role: "author";
  is_verified: boolean;
  bio?: string | null;
  reason?: string | null;
  birth_date?: string | null;
  created_at: string;
  updated_at: string;
  stories: AuthorStory[];
  total_stories_count: number;
  total_likes_count: number;
  total_reads_count: number;
};

export type BecomeAuthorPayload = {
  birthDate: string;
  bio?: string;
  reason?: string;
};

export type AuthorsResponse = {
  message: string;
  count: number;
  authors: AuthorData[];
};

export const getAuthors = async (): Promise<AuthorsResponse> => {
  const response = await axiosInstance.get<AuthorsResponse>(
    API_ENDPOINTS.user.authors
  );
  return response.data;
};

export const becomeAuthor = async (
  payload: BecomeAuthorPayload
): Promise<any> => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.user.becomeAuthor,
    payload
  );
  return response.data;
};

export const userService = {
  getAuthors,
  becomeAuthor,
};
