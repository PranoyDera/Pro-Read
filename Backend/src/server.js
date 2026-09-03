import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkDbConnection } from "./config/db.js";
import { createUsersTable } from "./models/userModel.js";
import { createAchievementsTable } from "./models/achievementsModel.js";
import { createStoriesTable } from "./models/storyModel.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import achievementsRouter from "./routes/achievementsRoutes.js";
import storyRouter from "./routes/storyRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/achievements", achievementsRouter);
app.use("/api/stories", storyRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
  try {
    await checkDbConnection();
    await createUsersTable();
    console.log("Users table is ready");

    await createAchievementsTable();
    console.log("Achievements table is ready");

    await createStoriesTable();
    console.log("Stories table is ready");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
