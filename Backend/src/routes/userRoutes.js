import { Router } from "express";
import { becomeAuthor, getUserProfile, updateUser } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.get("/profile", requireAuth, getUserProfile);
userRouter.put("/update", requireAuth, updateUser);
userRouter.patch("/update", requireAuth, updateUser);
userRouter.post("/become-author", requireAuth, becomeAuthor);

export default userRouter;
