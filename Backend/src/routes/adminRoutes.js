import { Router } from "express";
import {
  adminLogin,
  getCurrentAdmin,
  registerAdmin
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const adminRouter = Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/register", registerAdmin);
adminRouter.get("/me", requireAdmin, getCurrentAdmin);

export default adminRouter;
