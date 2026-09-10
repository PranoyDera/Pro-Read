import { verifyToken } from "../utils/token.js";
import { findUserById } from "../models/userModel.js";
import { findAdminById } from "../models/adminModel.js";

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

export const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    // Support admin token (adminId) or user token with admin role
    const adminId = decoded.adminId || decoded.userId;
    if (!adminId) {
      return res.status(401).json({ message: "Invalid admin token" });
    }

    // Check in admins table first
    if (decoded.adminId) {
      const admin = await findAdminById(decoded.adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (admin.is_active === false) {
        return res.status(403).json({ message: "Admin account is deactivated" });
      }

      req.admin = admin;
      req.user = { ...decoded, role: admin.role || "admin" };
      return next();
    }

    // Fallback: check if standard user has admin role
    const user = await findUserById(adminId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Administrator privileges required." });
    }

    req.admin = user;
    req.user = { ...decoded, role: user.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};

