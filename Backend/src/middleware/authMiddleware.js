import { verifyToken } from "../utils/token.js";
import { findUserById } from "../models/userModel.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAuthor = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "author") {
      return res.status(403).json({ message: "Access denied. Only authors can perform this action." });
    }

    req.currentUser = user;
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Authorization check failed", error: error.message });
  }
};
