import { API_ENDPOINTS } from "@/app/consts/common";
import axiosInstance from "./config";

export type AdminStory = {
  id: number;
  author_id: number;
  title: string;
  description: string;
  cover_pic: string | null;
  genre: string;
  read_time: string;
  status: "draft" | "published";
  is_featured?: boolean;
  is_blocked?: boolean;
  is_deleted?: boolean;
  author_name?: string;
  author_email?: string;
  author_profile_pic?: string | null;
  likes_count: number;
  comments_count: number;
  reads_count: number;
  reports?: number;
  created_at: string;
  updated_at: string;
};

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type GetPublishedStoriesResponse = {
  stories: AdminStory[];
  message?: string;
  count?: number;
  pagination?: PaginationMetadata;
};

export interface GetPublishedStoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
}

export const getPublishedStories = async (
  params?: GetPublishedStoriesParams
): Promise<{ stories: AdminStory[]; pagination?: PaginationMetadata }> => {
  const response = await axiosInstance.get<GetPublishedStoriesResponse>(
    API_ENDPOINTS.stories.base,
    { params }
  );
  return {
    stories: response.data.stories || [],
    pagination: response.data.pagination,
  };
};

export const getSingleStory = async (
  id: string | number
): Promise<AdminStory> => {
  const response = await axiosInstance.get<GetSingleStoryResponse>(
    API_ENDPOINTS.stories.single(id)
  );
  return response.data.story;
};

export const featureStory = async (
  id: string | number,
  isFeatured: boolean = true
): Promise<FeatureStoryResponse> => {
  const response = await axiosInstance.patch<FeatureStoryResponse>(
    API_ENDPOINTS.stories.feature(id),
    { isFeatured }
  );
  return response.data;
};

export const blockStory = async (
  id: string | number,
  isBlocked: boolean = true
): Promise<BlockStoryResponse> => {
  const response = await axiosInstance.patch<BlockStoryResponse>(
    API_ENDPOINTS.stories.block(id),
    { isBlocked }
  );
  return response.data;
};

export const deleteStory = async (
  id: string | number
): Promise<DeleteStoryResponse> => {
  const response = await axiosInstance.delete<DeleteStoryResponse>(
    API_ENDPOINTS.stories.single(id)
  );
  return response.data;
};

export interface StoryReport {
  id: number;
  story_id: number;
  user_id: number | null;
  reason: string;
  details: string | null;
  created_at: string;
  user_name?: string | null;
  user_email?: string | null;
}

export type GetStoryReportsResponse = {
  reports: StoryReport[];
  message?: string;
};

export const getStoryReports = async (
  id: string | number
): Promise<StoryReport[]> => {
  const response = await axiosInstance.get<GetStoryReportsResponse>(
    API_ENDPOINTS.stories.reports(id)
  );
  return response.data.reports || [];
};

export const storyService = {
  getPublishedStories,
  getSingleStory,
  getStoryReports,
  featureStory,
  blockStory,
  deleteStory,
};
