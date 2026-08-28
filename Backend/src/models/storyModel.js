import pool from "../config/db.js";

export const createStoriesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS stories (
      id SERIAL PRIMARY KEY,
      author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      cover_pic TEXT,
      status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published'
      is_blocked BOOLEAN DEFAULT FALSE,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await pool.query(query);
};

export const createStory = async ({ authorId, title, description, coverPic, status = 'draft' }) => {
  const query = `
    INSERT INTO stories (author_id, title, description, cover_pic, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, author_id, title, description, cover_pic, status, is_blocked, is_deleted, created_at, updated_at
  `;
  const values = [authorId, title, description, coverPic || null, status];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getStoryById = async (id) => {
  const query = `
    SELECT s.id, s.author_id, s.title, s.description, s.cover_pic, s.status, s.is_blocked, s.is_deleted, s.created_at, s.updated_at,
           u.name AS author_name, u.email AS author_email, u.profile_pic AS author_profile_pic
    FROM stories s
    JOIN users u ON s.author_id = u.id
    WHERE s.id = $1 AND s.is_deleted = FALSE
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

export const updateStory = async (id, authorId, { title, description, coverPic, status }) => {
  const existingStory = await getStoryById(id);
  
  if (!existingStory) {
    throw new Error("Story not found");
  }

  if (existingStory.author_id !== authorId) {
    throw new Error("Unauthorized to edit this story");
  }

  if (existingStory.status === "published") {
    throw new Error("Published stories cannot be edited");
  }

  const setClauses = [];
  const values = [id, authorId];
  let paramIdx = 3;

  if (title !== undefined) {
    setClauses.push(`title = $${paramIdx}`);
    values.push(title);
    paramIdx++;
  }
  if (description !== undefined) {
    setClauses.push(`description = $${paramIdx}`);
    values.push(description);
    paramIdx++;
  }
  if (coverPic !== undefined) {
    setClauses.push(`cover_pic = $${paramIdx}`);
    values.push(coverPic);
    paramIdx++;
  }
  if (status !== undefined) {
    setClauses.push(`status = $${paramIdx}`);
    values.push(status);
    paramIdx++;
  }

  if (setClauses.length === 0) return existingStory;

  setClauses.push("updated_at = NOW()");

  const query = `
    UPDATE stories
    SET ${setClauses.join(", ")}
    WHERE id = $1 AND author_id = $2 AND status = 'draft' AND is_deleted = FALSE
    RETURNING id, author_id, title, description, cover_pic, status, is_blocked, is_deleted, created_at, updated_at
  `;

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const setStoryBlockStatus = async (id, isBlocked) => {
  const query = `
    UPDATE stories
    SET is_blocked = $2, updated_at = NOW()
    WHERE id = $1 AND is_deleted = FALSE
    RETURNING id, author_id, title, description, cover_pic, status, is_blocked, is_deleted, created_at, updated_at
  `;
  const { rows } = await pool.query(query, [id, isBlocked]);
  return rows[0] || null;
};

export const softDeleteStory = async (id, authorId, isAdmin = false) => {
  let query;
  let values;

  if (isAdmin) {
    query = `
      UPDATE stories
      SET is_deleted = TRUE, updated_at = NOW()
      WHERE id = $1 AND is_deleted = FALSE
      RETURNING id, author_id, title, description, cover_pic, status, is_blocked, is_deleted, created_at, updated_at
    `;
    values = [id];
  } else {
    query = `
      UPDATE stories
      SET is_deleted = TRUE, updated_at = NOW()
      WHERE id = $1 AND author_id = $2 AND is_deleted = FALSE
      RETURNING id, author_id, title, description, cover_pic, status, is_blocked, is_deleted, created_at, updated_at
    `;
    values = [id, authorId];
  }

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const getAuthorDrafts = async (authorId) => {
  const query = `
    SELECT id, author_id, title, description, cover_pic, status, is_blocked, is_deleted, created_at, updated_at
    FROM stories
    WHERE author_id = $1 AND status = 'draft' AND is_deleted = FALSE
    ORDER BY updated_at DESC
  `;
  const { rows } = await pool.query(query, [authorId]);
  return rows;
};

export const getPublishedStories = async () => {
  const query = `
    SELECT s.id, s.author_id, s.title, s.description, s.cover_pic, s.status, s.is_blocked, s.is_deleted, s.created_at, s.updated_at,
           u.name AS author_name, u.email AS author_email, u.profile_pic AS author_profile_pic
    FROM stories s
    JOIN users u ON s.author_id = u.id
    WHERE s.status = 'published' AND s.is_blocked = FALSE AND s.is_deleted = FALSE
    ORDER BY s.created_at DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
};
