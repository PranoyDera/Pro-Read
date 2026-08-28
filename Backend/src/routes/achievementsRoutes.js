import { Router } from "express";
import {
  createAchievement,
  deleteAchievement,
  getAchievements,
  getSingleAchievement,
  updateAchievement
} from "../controllers/achievementsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { uploadAchievementIcon } from "../middleware/uploadMiddleware.js";

const achievementsRouter = Router();

achievementsRouter.get("/", getAchievements);
achievementsRouter.get("/:id", getSingleAchievement);
achievementsRouter.post("/", requireAuth, uploadAchievementIcon.single("icon"), createAchievement);
achievementsRouter.put("/:id", requireAuth, uploadAchievementIcon.single("icon"), updateAchievement);
achievementsRouter.delete("/:id", requireAuth, deleteAchievement);

export default achievementsRouter;
