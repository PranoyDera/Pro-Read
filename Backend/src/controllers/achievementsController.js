import {
  createAchievement as createAchievementInDb,
  deleteAchievement as deleteAchievementFromDb,
  getAchievementById,
  getAllAchievements as getAllAchievementsFromDb,
  updateAchievement as updateAchievementInDb
} from "../models/achievementsModel.js";

export const getAchievements = async (req, res) => {
  try {
    const achievements = await getAllAchievementsFromDb();
    return res.status(200).json({ achievements });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch achievements", error: error.message });
  }
};

export const getSingleAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await getAchievementById(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    return res.status(200).json({ achievement });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch achievement", error: error.message });
  }
};

export const createAchievement = async (req, res) => {
  try {
    const { title, description, rule } = req.body;

    if (!title || !description || !rule) {
      return res
        .status(400)
        .json({ message: "title, description, and rule are required" });
    }

    let normalizedRule = rule;
    if (typeof rule === "object") {
      normalizedRule = JSON.stringify(rule);
    } else {
      try {
        JSON.parse(rule);
        normalizedRule = rule;
      } catch (e) {
        normalizedRule = String(rule).trim();
      }
    }

    let icon = req.body.icon || null;
    if (req.file) {
      icon = `/uploads/achievements/${req.file.filename}`;
    }

    const newAchievement = await createAchievementInDb({
      title: String(title).trim(),
      description: String(description).trim(),
      rule: normalizedRule,
      icon
    });

    return res.status(201).json({
      message: "Achievement created successfully",
      achievement: newAchievement
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create achievement", error: error.message });
  }
};

export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, rule } = req.body;

    const existing = await getAchievementById(id);
    if (!existing) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    const updates = {};
    if (title !== undefined) updates.title = String(title).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (rule !== undefined) {
      if (typeof rule === "object") {
        updates.rule = JSON.stringify(rule);
      } else {
        try {
          JSON.parse(rule);
          updates.rule = rule;
        } catch (e) {
          updates.rule = String(rule).trim();
        }
      }
    }

    if (req.file) {
      updates.icon = `/uploads/achievements/${req.file.filename}`;
    } else if (req.body.icon !== undefined) {
      updates.icon = req.body.icon;
    }

    const updated = await updateAchievementInDb(id, updates);

    return res.status(200).json({
      message: "Achievement updated successfully",
      achievement: updated
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update achievement", error: error.message });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteAchievementFromDb(id);

    if (!deleted) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    return res.status(200).json({ message: "Achievement deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete achievement", error: error.message });
  }
};
