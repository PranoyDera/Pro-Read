import bcrypt from "bcrypt";
import {
  createAdmin,
  findAdminByEmail,
  findAdminById
} from "../models/adminModel.js";
import { generateToken } from "../utils/token.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (admin.is_active === false) {
      return res.status(403).json({ message: "Admin account is deactivated" });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role || "admin"
    });

    return res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        is_active: admin.is_active,
        created_at: admin.created_at,
        updated_at: admin.updated_at
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Admin login failed", error: error.message });
  }
};

export const getCurrentAdmin = async (req, res) => {
  try {
    const adminId = req.admin?.adminId || req.admin?.id;
    const admin = await findAdminById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ admin });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch admin profile", error: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await createAdmin({
      name,
      email,
      passwordHash,
      role: role || "admin"
    });

    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role || "admin"
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin
    });
  } catch (error) {
    return res.status(500).json({ message: "Admin registration failed", error: error.message });
  }
};
