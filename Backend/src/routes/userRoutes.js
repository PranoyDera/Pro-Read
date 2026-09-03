import { Router } from "express";
import { becomeAuthor, getAuthors, getUserProfile, updateUser, uploadCoverImage } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { uploadUserCover } from "../middleware/uploadMiddleware.js";

const userRouter = Router();

userRouter.get("/authors", getAuthors);
userRouter.get("/profile", requireAuth, getUserProfile);
userRouter.put("/update", requireAuth, uploadUserCover.single("coverPic"), updateUser);
userRouter.patch("/update", requireAuth, uploadUserCover.single("coverPic"), updateUser);
userRouter.post("/upload-cover", requireAuth, uploadUserCover.single("coverPic"), uploadCoverImage);
userRouter.post("/become-author", requireAuth, becomeAuthor);

export default userRouter;
