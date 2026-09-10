import pool from "../config/db.js";

export const createAdminsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin';
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
  `;

  await pool.query(query);
};

export const findAdminByEmail = async (email) => {
  const query = `
    SELECT
      id,
      name,
      email,
      password_hash,
      role,
      is_active,
      created_at,
      updated_at
    FROM admins
    WHERE LOWER(email) = LOWER($1)
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
};

export const findAdminById = async (id) => {
  const query = `
    SELECT
      id,
      name,
      email,
      role,
      is_active,
      created_at,
      updated_at
    FROM admins
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

export const createAdmin = async ({ name, email, passwordHash, role = "admin" }) => {
  const query = `
    INSERT INTO admins (name, email, password_hash, role)
    VALUES ($1, LOWER($2), $3, $4)
    RETURNING id, name, email, role, is_active, created_at, updated_at
  `;
  const values = [name, email, passwordHash, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
};
