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
    SELECT id, name, email, phone_number, gender, profile_pic, created_at, updated_at
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
    INSERT INTO users (name, email, phone_number, gender, profile_pic, password_hash)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, email, phone_number, gender, profile_pic, created_at, updated_at
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
