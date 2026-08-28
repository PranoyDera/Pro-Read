import {
  createStory as createStoryInDb,
  getAuthorDrafts as getAuthorDraftsFromDb,
  getPublishedStories as getPublishedStoriesFromDb,
  getStoryById as getStoryByIdFromDb,
  setStoryBlockStatus as setStoryBlockStatusInDb,
  softDeleteStory as softDeleteStoryInDb,
  updateStory as updateStoryInDb
} from "../models/storyModel.js";

export const createStory = async (req, res) => {
  try {
    const authorId = req.user.userId;
    const { title, description, status } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description are required" });
    }

    let coverPic = req.body.coverPic || null;
    if (req.file) {
      coverPic = `/uploads/stories/${req.file.filename}`;
    }

    const storyStatus = status === "published" ? "published" : "draft";

    const story = await createStoryInDb({
      authorId,
      title: String(title).trim(),
      description: String(description).trim(),
      coverPic,
      status: storyStatus
    });

    return res.status(201).json({
      message: storyStatus === "published" ? "Story published successfully" : "Draft saved successfully",
      story
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create story", error: error.message });
  }
};

export const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user.userId;
    const { title, description, status } = req.body;

    const existingStory = await getStoryByIdFromDb(id);
    if (!existingStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (existingStory.author_id !== authorId) {
      return res.status(403).json({ message: "Unauthorized to edit this story" });
    }

    if (existingStory.status === "published") {
      return res.status(400).json({ message: "Published stories cannot be edited" });
    }

    const updates = {};
    if (title !== undefined) updates.title = String(title).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (status !== undefined) updates.status = status;

    if (req.file) {
      updates.coverPic = `/uploads/stories/${req.file.filename}`;
    } else if (req.body.coverPic !== undefined) {
      updates.coverPic = req.body.coverPic;
    }

    const updatedStory = await updateStoryInDb(id, authorId, updates);

    return res.status(200).json({
      message: "Story updated successfully",
      story: updatedStory
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update story", error: error.message });
  }
};

export const getSingleStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await getStoryByIdFromDb(id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // If draft, only author can view
    if (story.status === "draft") {
      if (!req.user || req.user.userId !== story.author_id) {
        return res.status(403).json({ message: "Access denied to draft story" });
      }
    }

    // If blocked, non-author cannot view
    if (story.is_blocked) {
      if (!req.user || req.user.userId !== story.author_id) {
        return res.status(403).json({ message: "This story has been blocked" });
      }
    }

    return res.status(200).json({ story });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch story", error: error.message });
  }
};

export const getPublishedStories = async (req, res) => {
  try {
    const stories = await getPublishedStoriesFromDb();
    return res.status(200).json({ stories });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch published stories", error: error.message });
  }
};

export const getMyDrafts = async (req, res) => {
  try {
    const authorId = req.user.userId;
    const drafts = await getAuthorDraftsFromDb(authorId);
    return res.status(200).json({ drafts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch drafts", error: error.message });
  }
};

export const blockStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const blockedStory = await setStoryBlockStatusInDb(id, isBlocked !== undefined ? Boolean(isBlocked) : true);

    if (!blockedStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    return res.status(200).json({
      message: `Story ${blockedStory.is_blocked ? "blocked" : "unblocked"} successfully`,
      story: blockedStory
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update block status", error: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const isAdmin = req.user.role === "admin";

    const deleted = await softDeleteStoryInDb(id, userId, isAdmin);

    if (!deleted) {
      return res.status(404).json({ message: "Story not found or unauthorized to delete" });
    }

    return res.status(200).json({ message: "Story deleted successfully (soft delete)" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete story", error: error.message });
  }
};
