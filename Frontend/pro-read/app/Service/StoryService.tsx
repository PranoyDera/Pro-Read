import { API_ENDPOINTS } from "@/app/Constants/Common";
import axiosInstance from "@/app/api/api";

export type StoryItem = {
  id: number;
  author_id: number;
  title: string;
  description: string;
  cover_pic: string | null;
  genre: string;
  read_time: string;
  status: "draft" | "published";
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

export type StoryComment = {
  id: number;
  story_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_profile_pic: string | null;
};

export type CreateStoryPayload = {
  title: string;
  description: string;
  genre?: string;
  coverPic?: File | string | null;
  status?: "draft" | "published";
};

export type CreateDraftPayload = {
  title?: string;
  description?: string;
  genre?: string;
  coverPic?: File | string | null;
};

export type UpdateDraftPayload = {
  title?: string;
  description?: string;
  genre?: string;
  coverPic?: File | string | null;
  publish?: boolean;
  status?: "draft" | "published";
};

export type SingleStoryResponse = {
  message?: string;
  story?: StoryItem;
  draft?: StoryItem;
};

export type SingleDraftResponse = {
  message?: string;
  draft?: StoryItem;
  story?: StoryItem;
};

export type PublishedStoriesResponse = {
  stories: StoryItem[];
};

export type DraftsResponse = {
  drafts: StoryItem[];
};

export type CreateStoryResponse = {
  message: string;
  story: StoryItem;
};

export type CreateDraftResponse = {
  message: string;
  draft: StoryItem;
};

export type UpdateDraftResponse = {
  message: string;
  draft: StoryItem;
};

export type LikeResponse = {
  message: string;
  liked: boolean;
};

export type AddCommentResponse = {
  message: string;
  comment: StoryComment;
};

export type CommentsResponse = {
  comments: StoryComment[];
};

export type GenericResponse = {
  message: string;
  story?: StoryItem;
};

// --- Helper to convert payload into FormData when file is present ---
const toFormData = (payload: Record<string, any>): FormData | Record<string, any> => {
  const hasFile = Object.values(payload).some(
    (val) => typeof window !== "undefined" && val instanceof File
  );
  if (!hasFile) return payload;

  const formData = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      if (val instanceof File) {
        formData.append(key, val);
      } else {
        formData.append(key, String(val));
      }
    }
  });
  return formData;
};

// 1. Get Published Stories
export const getPublishedStories = async (): Promise<PublishedStoriesResponse> => {
  const response = await axiosInstance.get<PublishedStoriesResponse>(
    API_ENDPOINTS.stories.base
  );
  return response.data;
};

// 2. Get Author's Saved Drafts
export const getMyDrafts = async (): Promise<DraftsResponse> => {
  const response = await axiosInstance.get<DraftsResponse>(
    API_ENDPOINTS.stories.drafts
  );
  return response.data;
};

// 2a. Get Single Draft by Author ID and Draft ID
export const getSingleDraft = async (
  authorId: string | number,
  id: string | number
): Promise<SingleStoryResponse> => {
  const response = await axiosInstance.get<SingleStoryResponse>(
    API_ENDPOINTS.stories.draftSingle(authorId, id)
  );
  return response.data;
};

// 2b. Get Logged-in Author's Published Stories
export const getMyPublishedStories = async (): Promise<PublishedStoriesResponse> => {
  const response = await axiosInstance.get<PublishedStoriesResponse>(
    API_ENDPOINTS.stories.myPublished
  );
  return response.data;
};

// 3. Get Single Story Details (tracks read count)
export const getSingleStory = async (
  id: string | number
): Promise<SingleStoryResponse> => {
  const response = await axiosInstance.get<SingleStoryResponse>(
    API_ENDPOINTS.stories.single(id)
  );
  return response.data;
};

// 4. Create Story (Draft or Publish)
export const createStory = async (
  payload: CreateStoryPayload
): Promise<CreateStoryResponse> => {
  const body = toFormData(payload);
  const response = await axiosInstance.post<CreateStoryResponse>(
    API_ENDPOINTS.stories.base,
    body
  );
  return response.data;
};

// 5. Create Draft
export const createDraft = async (
  payload: CreateDraftPayload
): Promise<CreateDraftResponse> => {
  const body = toFormData(payload);
  const response = await axiosInstance.post<CreateDraftResponse>(
    API_ENDPOINTS.stories.drafts,
    body
  );
  return response.data;
};

// 6. Update Draft (or Publish Draft)
export const updateDraft = async (
  id: string | number,
  payload: UpdateDraftPayload
): Promise<UpdateDraftResponse> => {
  const body = toFormData(payload);
  const response = await axiosInstance.put<UpdateDraftResponse>(
    API_ENDPOINTS.stories.draftUpdate(id),
    body
  );
  return response.data;
};

// 7. Toggle Like on Story
export const toggleLikeStory = async (
  id: string | number
): Promise<LikeResponse> => {
  const response = await axiosInstance.post<LikeResponse>(
    API_ENDPOINTS.stories.like(id)
  );
  return response.data;
};

// 8. Add Comment to Story
export const addCommentToStory = async (
  id: string | number,
  content: string
): Promise<AddCommentResponse> => {
  const response = await axiosInstance.post<AddCommentResponse>(
    API_ENDPOINTS.stories.comments(id),
    { content }
  );
  return response.data;
};

// 9. Get Story Comments
export const getStoryComments = async (
  id: string | number
): Promise<CommentsResponse> => {
  const response = await axiosInstance.get<CommentsResponse>(
    API_ENDPOINTS.stories.comments(id)
  );
  return response.data;
};

// 10. Block / Unblock Story (Admin/Moderation)
export const blockStory = async (
  id: string | number,
  isBlocked: boolean = true
): Promise<GenericResponse> => {
  const response = await axiosInstance.patch<GenericResponse>(
    API_ENDPOINTS.stories.block(id),
    { isBlocked }
  );
  return response.data;
};

// 11. Delete Story (Soft delete)
export const deleteStory = async (
  id: string | number
): Promise<GenericResponse> => {
  const response = await axiosInstance.delete<GenericResponse>(
    API_ENDPOINTS.stories.single(id)
  );
  return response.data;
};

export const storyService = {
  getPublishedStories,
  getMyDrafts,
  getMyPublishedStories,
  getSingleStory,
  createStory,
  createDraft,
  updateDraft,
  toggleLikeStory,
  addCommentToStory,
  getStoryComments,
  blockStory,
  deleteStory,
};
