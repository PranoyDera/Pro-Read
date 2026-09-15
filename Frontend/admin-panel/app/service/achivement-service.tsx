import { API_ENDPOINTS } from "@/app/consts/common";
import axiosInstance from "./config";

export interface AchievementItem {
  id: number;
  title: string;
  description: string;
  rule: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetAchievementsResponse {
  achievements: AchievementItem[];
  pagination?: PaginationMetadata;
}

export interface GetAchievementsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetSingleAchievementResponse {
  achievement: AchievementItem;
}

export interface CreateAchievementResponse {
  message: string;
  achievement: AchievementItem;
}

export interface UpdateAchievementResponse {
  message: string;
  achievement: AchievementItem;
}

export interface DeleteAchievementResponse {
  message: string;
}

export type AchievementPayload = FormData | Record<string, unknown>;

/**
 * Fetch all achievements with optional search & pagination
 * GET /api/achievements
 */
export const getAchievements = async (
  params?: GetAchievementsParams
): Promise<{ achievements: AchievementItem[]; pagination?: PaginationMetadata }> => {
  const response = await axiosInstance.get<GetAchievementsResponse>(
    API_ENDPOINTS.achievements.base,
    { params }
  );
  return {
    achievements: response.data.achievements || [],
    pagination: response.data.pagination,
  };
};

/**
 * Fetch a single achievement by ID
 * GET /api/achievements/:id
 */
export const getSingleAchievement = async (
  id: string | number
): Promise<AchievementItem> => {
  const response = await axiosInstance.get<GetSingleAchievementResponse>(
    API_ENDPOINTS.achievements.single(id)
  );
  return response.data.achievement;
};

/**
 * Create a new achievement
 * POST /api/achievements
 */
export const createAchievement = async (
  data: AchievementPayload
): Promise<CreateAchievementResponse> => {
  const response = await axiosInstance.post<CreateAchievementResponse>(
    API_ENDPOINTS.achievements.base,
    data
  );
  return response.data;
};

/**
 * Update an existing achievement by ID
 * PUT /api/achievements/:id
 */
export const updateAchievement = async (
  id: string | number,
  data: AchievementPayload
): Promise<UpdateAchievementResponse> => {
  const response = await axiosInstance.put<UpdateAchievementResponse>(
    API_ENDPOINTS.achievements.single(id),
    data
  );
  return response.data;
};

/**
 * Delete an achievement by ID
 * DELETE /api/achievements/:id
 */
export const deleteAchievement = async (
  id: string | number
): Promise<DeleteAchievementResponse> => {
  const response = await axiosInstance.delete<DeleteAchievementResponse>(
    API_ENDPOINTS.achievements.single(id)
  );
  return response.data;
};

export const achievementService = {
  getAchievements,
  getSingleAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};

export default achievementService;
