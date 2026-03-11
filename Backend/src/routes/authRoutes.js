import { Router } from "express";
import {
  getCurrentUser,
  login,
  signup
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, getCurrentUser);

export default authRouter;
