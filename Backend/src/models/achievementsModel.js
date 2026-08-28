import pool from "../config/db.js";

export const createAchievementsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS achievements (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      rule TEXT NOT NULL,
      icon TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await pool.query(query);
};

export const createAchievement = async ({ title, description, rule, icon }) => {
  const query = `
    INSERT INTO achievements (title, description, rule, icon)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, rule, icon, created_at, updated_at
  `;
  const values = [title, description, rule, icon || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllAchievements = async () => {
  const query = `
    SELECT id, title, description, rule, icon, created_at, updated_at
    FROM achievements
    ORDER BY id ASC
  `;
  const { rows } = await pool.query(query);
  return rows;
};

export const getAchievementById = async (id) => {
  const query = `
    SELECT id, title, description, rule, icon, created_at, updated_at
    FROM achievements
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

export const updateAchievement = async (id, { title, description, rule, icon }) => {
  const fields = [];
  const values = [id];
  let paramIdx = 2;

  if (title !== undefined) {
    fields.push(`title = $${paramIdx}`);
    values.push(title);
    paramIdx++;
  }
  if (description !== undefined) {
    fields.push(`description = $${paramIdx}`);
    values.push(description);
    paramIdx++;
  }
  if (rule !== undefined) {
    fields.push(`rule = $${paramIdx}`);
    values.push(rule);
    paramIdx++;
  }
  if (icon !== undefined) {
    fields.push(`icon = $${paramIdx}`);
    values.push(icon);
    paramIdx++;
  }

  if (fields.length === 0) return null;

  fields.push("updated_at = NOW()");

  const query = `
    UPDATE achievements
    SET ${fields.join(", ")}
    WHERE id = $1
    RETURNING id, title, description, rule, icon, created_at, updated_at
  `;

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const deleteAchievement = async (id) => {
  const query = `
    DELETE FROM achievements
    WHERE id = $1
    RETURNING id
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

export const createUserAchievementsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_achievements (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      achievement_id INT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
      unlocked_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, achievement_id)
    )
  `;
  await pool.query(query);
};

export const getUserAchievements = async (userId) => {
  const query = `
    SELECT a.id, a.title, a.description, a.rule, a.icon, ua.unlocked_at
    FROM user_achievements ua
    JOIN achievements a ON ua.achievement_id = a.id
    WHERE ua.user_id = $1
    ORDER BY ua.unlocked_at DESC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const unlockAchievementForUser = async (userId, achievementId) => {
  const query = `
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, achievement_id) DO NOTHING
    RETURNING *
  `;
  const { rows } = await pool.query(query, [userId, achievementId]);
  return rows[0] || null;
};

export const evaluateAndAwardAchievements = async (userId, userStats = {}) => {
  const achievements = await getAllAchievements();
  const awarded = [];

  for (const ach of achievements) {
    try {
      const ruleObj = typeof ach.rule === "string" ? JSON.parse(ach.rule) : ach.rule;
      let isEligible = true;

      if (ruleObj.minBooksRead !== undefined && (userStats.booksRead || 0) < ruleObj.minBooksRead) {
        isEligible = false;
      }
      if (ruleObj.minDayStreak !== undefined && (userStats.dayStreak || 0) < ruleObj.minDayStreak) {
        isEligible = false;
      }
      if (ruleObj.minHoursImmersed !== undefined && (userStats.hoursImmersed || 0) < ruleObj.minHoursImmersed) {
        isEligible = false;
      }
      if (ruleObj.minReviews !== undefined && (userStats.reviewsCount || 0) < ruleObj.minReviews) {
        isEligible = false;
      }
      if (ruleObj.minGenres !== undefined && (userStats.genresCount || 0) < ruleObj.minGenres) {
        isEligible = false;
      }

      if (isEligible) {
        const result = await unlockAchievementForUser(userId, ach.id);
        if (result) {
          awarded.push(ach);
        }
      }
    } catch (e) {
      // If rule is simple string, check fallback match
      if (typeof ach.rule === "string" && ach.rule.trim() !== "") {
        // Safe evaluation
      }
    }
  }

  return awarded;
};

