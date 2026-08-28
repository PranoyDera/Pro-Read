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
    SELECT id, name, email, phone_number, gender, profile_pic, role, is_verified, bio, reason, birth_date, created_at, updated_at
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
  passwordHash
}) => {
  const query = `
    INSERT INTO users (name, email, phone_number, gender, profile_pic, password_hash, role, is_verified)
    VALUES ($1, $2, $3, $4, $5, $6, 'reader', FALSE)
    RETURNING id, name, email, phone_number, gender, profile_pic, role, is_verified, bio, reason, birth_date, created_at, updated_at
  `;
  const values = [
    name,
    email.toLowerCase(),
    phoneNumber,
    gender,
    profilePic || null,
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
    RETURNING id, name, email, phone_number, gender, profile_pic, role, is_verified, bio, reason, birth_date, created_at, updated_at
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
    RETURNING id, name, email, phone_number, gender, profile_pic, role, is_verified, bio, reason, birth_date, created_at, updated_at
  `;

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};
