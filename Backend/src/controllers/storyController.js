import { uploadBufferToCloudinary } from "../config/cloudinary.js";
import {
  addStoryComment as addStoryCommentInDb,
  createDraftInDb,
  createStory as createStoryInDb,
  deleteDraftInDb,
  getAuthorDrafts as getAuthorDraftsFromDb,
  getAuthorDraftById as getAuthorDraftByIdFromDb,
  getAuthorPublishedStories as getAuthorPublishedStoriesFromDb,
  getDraftById as getDraftByIdFromDb,
  getPublishedStories as getPublishedStoriesFromDb,
  getStoryById as getStoryByIdFromDb,
  getStoryComments as getStoryCommentsFromDb,
  hardDeleteDraftInDb,
  recordStoryRead as recordStoryReadInDb,
  setStoryBlockStatus as setStoryBlockStatusInDb,
  softDeleteStory as softDeleteStoryInDb,
  toggleStoryLike as toggleStoryLikeInDb,
  updateDraftInDb,
  updateStory as updateStoryInDb
} from "../models/storyModel.js";

// Helper function to calculate read time from story description / text content
export const calculateReadTime = (content) => {
  if (!content) return "~1 min read";
  // Strip HTML tags if any (e.g. from rich text editor)
  const plainText = String(content).replace(/<[^>]*>/g, " ").trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  // Standard reading speed average: 200-225 words per minute
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `~${minutes} min read`;
};

export const createStory = async (req, res) => {
  try {
    const authorId = req.user.userId;
    const { title, description, genre, status } = req.body;

    const storyStatus = status === "published" ? "published" : "draft";

    let coverPic = req.body.coverPic || null;
    if (req.file && req.file.buffer) {
      try {
        const cloudResult = await uploadBufferToCloudinary(req.file.buffer, "stories");
        coverPic = cloudResult.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary upload failed for story cover:", cloudErr);
      }
    }

    const calculatedTime = calculateReadTime(description);

    if (storyStatus === "published") {
      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Title and description are required to publish a story" });
      }

      const story = await createStoryInDb({
        authorId,
        title: String(title).trim(),
        description: String(description).trim(),
        coverPic,
        genre: genre ? String(genre).trim() : "General",
        readTime: calculatedTime,
        status: "published"
      });

      return res.status(201).json({
        message: "Story published successfully",
        story
      });
    }

    // Otherwise create draft in drafts table
    const draft = await createDraftInDb({
      authorId,
      title: title ? String(title).trim() : "Untitled Draft",
      description: description ? String(description).trim() : "",
      coverPic,
      genre: genre ? String(genre).trim() : "General",
      readTime: calculatedTime
    });

    return res.status(201).json({
      message: "Draft saved successfully",
      draft,
      story: draft
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create story/draft", error: error.message });
  }
};

export const createDraft = async (req, res) => {
  try {
    const authorId = req.user.userId;
    const { title, description, genre } = req.body;

    let coverPic = null;
    if (req.file && req.file.buffer) {
      try {
        const cloudResult = await uploadBufferToCloudinary(req.file.buffer, "stories");
        coverPic = cloudResult.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary upload failed for draft cover:", cloudErr);
      }
    } else if (req.body.coverPic) {
      coverPic = req.body.coverPic;
    }

    const calculatedTime = calculateReadTime(description);

    const draft = await createDraftInDb({
      authorId,
      title: title ? String(title).trim() : "Untitled Draft",
      description: description ? String(description).trim() : "",
      coverPic,
      genre: genre ? String(genre).trim() : "General",
      readTime: calculatedTime
    });

    return res.status(201).json({
      message: "Draft created successfully",
      draft
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create draft", error: error.message });
  }
};

export const updateDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user.userId;
    const { title, description, genre, publish } = req.body;

    const existingDraft = await getAuthorDraftByIdFromDb(id, authorId);
    if (!existingDraft) {
      return res.status(404).json({ message: "Draft not found or unauthorized" });
    }

    let coverPic = existingDraft.cover_pic;
    if (req.file && req.file.buffer) {
      try {
        const cloudResult = await uploadBufferToCloudinary(req.file.buffer, "stories");
        coverPic = cloudResult.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary upload failed for draft update cover:", cloudErr);
      }
    } else if (req.body.coverPic !== undefined && req.body.coverPic !== "null") {
      coverPic = req.body.coverPic;
    }

    const currentTitle = title !== undefined ? String(title).trim() : existingDraft.title;
    const currentDescription = description !== undefined ? String(description).trim() : existingDraft.description;
    const currentGenre = genre !== undefined ? String(genre).trim() : existingDraft.genre;
    const calculatedTime = calculateReadTime(currentDescription);

    // If publishing, create story in stories table and remove draft
    if (publish === true || publish === "true" || req.body.status === "published") {
      if (!currentTitle || !currentDescription) {
        return res.status(400).json({ message: "Title and description are required to publish a story" });
      }

      const publishedStory = await createStoryInDb({
        authorId,
        title: currentTitle,
        description: currentDescription,
        coverPic,
        genre: currentGenre,
        readTime: calculatedTime,
        status: "published"
      });

      // Remove from drafts table once published
      await hardDeleteDraftInDb(id, authorId);

      return res.status(200).json({
        message: "Draft published successfully",
        draft: publishedStory,
        story: publishedStory
      });
    }

    // Update draft in drafts table
    const updatedDraft = await updateDraftInDb(id, authorId, {
      title: currentTitle,
      description: currentDescription,
      coverPic,
      genre: currentGenre,
      readTime: calculatedTime
    });

    return res.status(200).json({
      message: "Draft updated successfully",
      draft: updatedDraft
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update draft", error: error.message });
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

    // Record read count asynchronously for published stories
    if (story.status === "published") {
      const readerUserId = req.user?.userId || null;
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || null;
      recordStoryReadInDb(id, readerUserId, ipAddress).catch(() => {});
    }

    return res.status(200).json({ story });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch story", error: error.message });
  }
};

export const toggleLikeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const story = await getStoryByIdFromDb(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const result = await toggleStoryLikeInDb(id, userId);

    return res.status(200).json({
      message: result.liked ? "Story liked" : "Story unliked",
      ...result
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to toggle like", error: error.message });
  }
};

export const addCommentToStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { content } = req.body;

    if (!content || !String(content).trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const story = await getStoryByIdFromDb(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const comment = await addStoryCommentInDb(id, userId, String(content).trim());

    return res.status(201).json({
      message: "Comment added successfully",
      comment
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

export const getStoryCommentsController = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await getStoryCommentsFromDb(id);
    return res.status(200).json({ comments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch comments", error: error.message });
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

export const getSingleDraft = async (req, res) => {
  try {
    const { authorId, id } = req.params;

    if (!authorId || !id) {
      return res.status(400).json({ message: "Both authorId and draft id parameters are required" });
    }

    const draft = await getAuthorDraftByIdFromDb(id, authorId);

    if (!draft) {
      return res.status(404).json({ message: "Draft not found or unauthorized access" });
    }

    return res.status(200).json({
      message: "Draft fetched successfully",
      draft
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch draft", error: error.message });
  }
};

export const getMyPublishedStories = async (req, res) => {
  try {
    const authorId = req.user.userId;
    const stories = await getAuthorPublishedStoriesFromDb(authorId);
    return res.status(200).json({
      message: "Published stories fetched successfully",
      count: stories.length,
      stories
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch published stories", error: error.message });
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

    // Attempt to delete from stories table
    let deleted = await softDeleteStoryInDb(id, userId, isAdmin);

    // If not found in stories, attempt to delete from drafts table
    if (!deleted) {
      deleted = await deleteDraftInDb(id, userId);
    }

    if (!deleted) {
      return res.status(404).json({ message: "Story/Draft not found or unauthorized to delete" });
    }

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete story/draft", error: error.message });
  }
};
