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
  created_at: string;
  updated_at: string;
};

export type GetPublishedStoriesResponse = {
  stories: AdminStory[];
  message?: string;
  count?: number;
};

export type GetSingleStoryResponse = {
  story: AdminStory;
  message?: string;
};

export type FeatureStoryResponse = {
  message: string;
  story: AdminStory;
  currentFeaturedStory?: {
    id: number;
    title: string;
    is_featured: boolean;
  };
};

export type BlockStoryResponse = {
  message: string;
  story: AdminStory;
};

export type DeleteStoryResponse = {
  message: string;
};

export const getPublishedStories = async (): Promise<AdminStory[]> => {
  const response = await axiosInstance.get<GetPublishedStoriesResponse>(
    API_ENDPOINTS.stories.base
  );
  return response.data.stories || [];
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

export const storyService = {
  getPublishedStories,
  getSingleStory,
  featureStory,
  blockStory,
  deleteStory,
};
