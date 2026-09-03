import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserById
} from "../models/userModel.js";
import { generateToken } from "../utils/token.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhoneNumber = (phoneNumber) =>
  /^\+?[0-9][0-9\s-]{6,19}$/.test(phoneNumber);

export const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, gender, profilePic } = req.body;

    if (!name || !email || !password || !phoneNumber || !gender) {
      return res.status(400).json({
        message: "name, email, password, phoneNumber, and gender are required"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedPhoneNumber = String(phoneNumber).trim();
    if (!isValidPhoneNumber(normalizedPhoneNumber)) {
      return res.status(400).json({
        message: "Please provide a valid phoneNumber (digits, space, hyphen, optional +)"
      });
    }

    const normalizedGender = String(gender).trim();
    if (!normalizedGender) {
      return res.status(400).json({ message: "gender is required" });
    }

    const normalizedProfilePic = profilePic ? String(profilePic).trim() : null;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      phoneNumber: normalizedPhoneNumber,
      gender: normalizedGender,
      profilePic: normalizedProfilePic,
      passwordHash
    });
    const token = generateToken({ userId: user.id, email: user.email });

    return res.status(201).json({
      message: "Signup successful",
      token,
      user
    });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        gender: user.gender,
        profile_pic: user.profile_pic,
        cover_pic: user.cover_pic,
        role: user.role,
        is_verified: user.is_verified,
        bio: user.bio,
        reason: user.reason,
        birth_date: user.birth_date,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch user profile", error: error.message });
  }
};

