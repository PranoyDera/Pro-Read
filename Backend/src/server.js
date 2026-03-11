import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkDbConnection } from "./config/db.js";
import { createUsersTable } from "./models/userModel.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRouter);

const startServer = async () => {
  try {
    await checkDbConnection();
    await createUsersTable();
    console.log("Users table is ready");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
