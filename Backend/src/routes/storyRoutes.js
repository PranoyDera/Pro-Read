import { Router } from "express";
import {
  blockStory,
  createStory,
  deleteStory,
  getMyDrafts,
  getPublishedStories,
  getSingleStory,
  updateStory
} from "../controllers/storyController.js";
import { requireAuth, requireAuthor } from "../middleware/authMiddleware.js";
import { uploadStoryCover } from "../middleware/uploadMiddleware.js";

const storyRouter = Router();

storyRouter.get("/", getPublishedStories);
storyRouter.get("/drafts", requireAuth, requireAuthor, getMyDrafts);
storyRouter.get("/:id", getSingleStory);
storyRouter.post("/", requireAuth, requireAuthor, uploadStoryCover.single("coverPic"), createStory);
storyRouter.put("/:id", requireAuth, requireAuthor, uploadStoryCover.single("coverPic"), updateStory);
storyRouter.patch("/:id/block", requireAuth, blockStory);
storyRouter.delete("/:id", requireAuth, deleteStory);

export default storyRouter;