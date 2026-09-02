import {
  evaluateAndAwardAchievements,
  getUserAchievements
} from "../models/achievementsModel.js";
import {
  findUserByEmail,
  findUserById,
  getAllAuthorsWithStories,
  updateUserProfile,
  updateUserRoleToAuthor
} from "../models/userModel.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhoneNumber = (phoneNumber) =>
  /^\+?[0-9][0-9\s-]{6,19}$/.test(phoneNumber);

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phoneNumber, gender, profilePic, bio, reason, birthDate } = req.body;

    const existingUser = await findUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};

    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      updates.name = trimmedName;
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();
      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({ message: "Please provide a valid email" });
      }
      if (normalizedEmail !== existingUser.email) {
        const emailCheck = await findUserByEmail(normalizedEmail);
        if (emailCheck) {
          return res.status(409).json({ message: "Email is already in use" });
        }
      }
      updates.email = normalizedEmail;
    }

    if (phoneNumber !== undefined) {
      const trimmedPhone = String(phoneNumber).trim();
      if (trimmedPhone && !isValidPhoneNumber(trimmedPhone)) {
        return res.status(400).json({
          message: "Please provide a valid phoneNumber (digits, space, hyphen, optional +)"
        });
      }
      updates.phoneNumber = trimmedPhone || null;
    }

    if (gender !== undefined) {
      const trimmedGender = String(gender).trim();
      updates.gender = trimmedGender || null;
    }

    if (profilePic !== undefined) {
      const trimmedPic = String(profilePic).trim();
      updates.profilePic = trimmedPic || null;
    }

    if (bio !== undefined) {
      const trimmedBio = String(bio).trim();
      updates.bio = trimmedBio || null;
    }

    if (reason !== undefined) {
      const trimmedReason = String(reason).trim();
      updates.reason = trimmedReason || null;
    }

    if (birthDate !== undefined) {
      updates.birthDate = birthDate || null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const updatedUser = await updateUserProfile(userId, updates);

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

export const becomeAuthor = async (req, res) => {
  try {
    const { birthDate, bio, reason } = req.body;

    if (!birthDate) {
      return res.status(400).json({ message: "birthDate is required" });
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await updateUserRoleToAuthor({
      userId: req.user.userId,
      birthDate,
      bio: bio ? String(bio).trim() : null,
      reason: reason ? String(reason).trim() : null
    });

    return res.status(200).json({
      message: "User role upgraded to author successfully",
      user: updatedUser
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update role to author", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const createdYear = user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();

    const readingStats = {
      booksReadThisYear: 84,
      annualGoal: 100,
      booksRemaining: 16,
      dayStreak: 42,
      hoursImmersed: 312,
      reviewsCount: 10,
      genresCount: 5
    };

    let userUnlockedAchievements = [];
    try {
      // Automatically evaluate rules & unlock eligible achievements for user
      await evaluateAndAwardAchievements(userId, {
        booksRead: readingStats.booksReadThisYear,
        dayStreak: readingStats.dayStreak,
        hoursImmersed: readingStats.hoursImmersed,
        reviewsCount: readingStats.reviewsCount,
        genresCount: readingStats.genresCount
      });

      userUnlockedAchievements = await getUserAchievements(userId);
    } catch (achError) {
      console.error("Error evaluating achievements:", achError.message);
    }

    const profileData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phone_number,
        gender: user.gender,
        profilePic: user.profile_pic,
        role: user.role,
        isVerified: user.is_verified,
        bio: user.bio,
        reason: user.reason,
        birthDate: user.birth_date,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        tagline: `Bibliophile since ${createdYear} • ${user.role === 'author' ? 'Author' : 'Premium Member'}`
      },
      tags: ["Philosophical Fiction", "Modern History"],
      readingStats,
      unlockedAchievements: userUnlockedAchievements
    };

    return res.status(200).json(profileData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch user profile", error: error.message });
  }
};

export const getAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsWithStories();
    return res.status(200).json({
      message: "Authors fetched successfully",
      count: authors.length,
      authors
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch authors", error: error.message });
  }
};

