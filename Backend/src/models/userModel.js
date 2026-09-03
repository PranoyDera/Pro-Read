import pool from "../config/db.js";

export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone_number VARCHAR(20),
      gender VARCHAR(30),
      profile_pic TEXT,
      cover_pic TEXT,
      role VARCHAR(20) DEFAULT 'reader',
      is_verified BOOLEAN DEFAULT FALSE,
      bio TEXT,
      reason TEXT,
      birth_date DATE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await pool.query(query);
  await pool.query(
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20)"
  );
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(30)");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_pic TEXT");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS cover_pic TEXT");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'reader'");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS reason TEXT");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE");
};

export const findUserByEmail = async (email) => {
  const query = `
    SELECT
      id,
      name,
      email,
      phone_number,
      gender,
      profile_pic,
      cover_pic,
      role,
      is_verified,
      bio,
      reason,
      birth_date,
      password_hash,
      created_at,
      updated_at
    FROM users
    WHERE email = $1
  `;
  const { rows } = await pool.query(query, [email.toLowerCase()]);
  return rows[0] || null;
};

export const findUserById = async (userId) => {
  const query = `
    SELECT id, name, email, phone_number, gender, profile_pic, cover_pic, role, is_verified, bio, reason, birth_date, created_at, updated_at
    FROM users
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0] || null;
};

export const createUser = async ({
  name,
  email,
  phoneNumber,
  gender,
  profilePic,
  coverPic,
  passwordHash
}) => {
  const query = `
    INSERT INTO users (name, email, phone_number, gender, profile_pic, cover_pic, password_hash, role, is_verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'reader', FALSE)
    RETURNING id, name, email, phone_number, gender, profile_pic, cover_pic, role, is_verified, bio, reason, birth_date, created_at, updated_at
  `;
  const values = [
    name,
    email.toLowerCase(),
    phoneNumber,
    gender,
    profilePic || null,
    coverPic || null,
    passwordHash
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const updateUserRoleToAuthor = async ({ userId, birthDate, bio, reason }) => {
  const query = `
    UPDATE users
    SET role = 'author',
        birth_date = $2,
        bio = $3,
        reason = $4,
        updated_at = NOW()
    WHERE id = $1
    RETURNING id, name, email, phone_number, gender, profile_pic, cover_pic, role, is_verified, bio, reason, birth_date, created_at, updated_at
  `;
  const values = [userId, birthDate, bio || null, reason || null];
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const updateUserProfile = async (userId, fieldsToUpdate) => {
  const allowedFields = {
    name: "name",
    email: "email",
    phoneNumber: "phone_number",
    gender: "gender",
    profilePic: "profile_pic",
    coverPic: "cover_pic",
    bio: "bio",
    reason: "reason",
    birthDate: "birth_date"
  };

  const setClauses = [];
  const values = [userId];
  let paramIdx = 2;

  for (const [key, val] of Object.entries(fieldsToUpdate)) {
    if (allowedFields[key] && val !== undefined) {
      setClauses.push(`${allowedFields[key]} = $${paramIdx}`);
      values.push(val);
      paramIdx++;
    }
  }

  if (setClauses.length === 0) {
    return null;
  }

  setClauses.push("updated_at = NOW()");

  const query = `
    UPDATE users
    SET ${setClauses.join(", ")}
    WHERE id = $1
    RETURNING id, name, email, phone_number, gender, profile_pic, cover_pic, role, is_verified, bio, reason, birth_date, created_at, updated_at
  `;

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const getAllAuthorsWithStories = async () => {
  const query = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.phone_number,
      u.gender,
      u.profile_pic,
      u.cover_pic,
      u.role,
      u.is_verified,
      u.bio,
      u.reason,
      u.birth_date,
      u.created_at,
      u.updated_at,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', s.id,
            'title', s.title,
            'description', s.description,
            'cover_pic', s.cover_pic,
            'genre', s.genre,
            'read_time', s.read_time,
            'status', s.status,
            'likes_count', COALESCE(l.likes_count, 0),
            'comments_count', COALESCE(c.comments_count, 0),
            'reads_count', COALESCE(r.reads_count, 0),
            'created_at', s.created_at,
            'updated_at', s.updated_at
          ) ORDER BY s.created_at DESC
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'
      ) AS stories,
      COUNT(s.id)::INT AS total_stories_count,
      COALESCE(SUM(l.likes_count), 0)::INT AS total_likes_count,
      COALESCE(SUM(r.reads_count), 0)::INT AS total_reads_count
    FROM users u
    LEFT JOIN stories s ON u.id = s.author_id AND s.is_deleted = FALSE AND s.status = 'published'
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS likes_count FROM story_likes GROUP BY story_id
    ) l ON s.id = l.story_id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS comments_count FROM story_comments GROUP BY story_id
    ) c ON s.id = c.story_id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS reads_count FROM story_reads GROUP BY story_id
    ) r ON s.id = r.story_id
    WHERE u.role = 'author'
    GROUP BY u.id
    ORDER BY total_reads_count DESC, u.created_at DESC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};
