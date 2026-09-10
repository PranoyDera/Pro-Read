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

export interface GetAchievementsResponse {
  achievements: AchievementItem[];
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
 * Fetch all achievements
 * GET /api/achievements
 */
export const getAchievements = async (): Promise<AchievementItem[]> => {
  const response = await axiosInstance.get<GetAchievementsResponse>(
    API_ENDPOINTS.achievements.base
  );
  return response.data.achievements || [];
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
