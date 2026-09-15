import { Router } from "express";
import {
  addCommentToStory,
  blockStory,
  createDraft,
  createStory,
  deleteStory,
  featureStory,
  getFeaturedStory,
  getMyDrafts,
  getMyPublishedStories,
  getPublishedStories,
  getSingleDraft,
  getSingleStory,
  getStoryCommentsController,
  getStoryReportsController,
  reportStoryController,
  toggleLikeStory,
  updateDraft
} from "../controllers/storyController.js";
import { requireAuth, requireAuthor } from "../middleware/authMiddleware.js";
import { uploadStoryCover } from "../middleware/uploadMiddleware.js";

const storyRouter = Router();

storyRouter.get("/", getPublishedStories);
storyRouter.get("/featured", getFeaturedStory);
storyRouter.get("/drafts", requireAuth, requireAuthor, getMyDrafts);
storyRouter.get("/drafts/:authorId/:id", getSingleDraft);
storyRouter.get("/my-published", requireAuth, requireAuthor, getMyPublishedStories);
storyRouter.post("/drafts", requireAuth, requireAuthor, uploadStoryCover.single("coverPic"), createDraft);
storyRouter.put("/drafts/:id", requireAuth, requireAuthor, uploadStoryCover.single("coverPic"), updateDraft);
storyRouter.get("/:id", getSingleStory);
storyRouter.post("/:id/like", requireAuth, toggleLikeStory);
storyRouter.get("/:id/comments", getStoryCommentsController);
storyRouter.post("/:id/comments", requireAuth, addCommentToStory);
storyRouter.post("/:id/report", requireAuth, reportStoryController);
storyRouter.get("/:id/reports", requireAuth, getStoryReportsController);
storyRouter.post("/", requireAuth, requireAuthor, uploadStoryCover.single("coverPic"), createStory);
storyRouter.patch("/:id/block", requireAuth, blockStory);
storyRouter.patch("/:id/feature", requireAuth, featureStory);
storyRouter.delete("/:id", requireAuth, deleteStory);

export default storyRouter;
