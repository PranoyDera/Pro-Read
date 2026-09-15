import pool from "../config/db.js";

export const createStoriesTable = async () => {
  const query = `
    -- Drafts Table
    CREATE TABLE IF NOT EXISTS drafts (
      id SERIAL PRIMARY KEY,
      author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      cover_pic TEXT,
      genre VARCHAR(100) DEFAULT 'General',
      read_time VARCHAR(50) DEFAULT '1 min read',
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Stories Table (Published Stories)
    CREATE TABLE IF NOT EXISTS stories (
      id SERIAL PRIMARY KEY,
      author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      cover_pic TEXT,
      genre VARCHAR(100) DEFAULT 'General',
      read_time VARCHAR(50) DEFAULT '1 min read',
      status VARCHAR(20) DEFAULT 'published',
      is_featured BOOLEAN DEFAULT FALSE,
      is_blocked BOOLEAN DEFAULT FALSE,
      is_deleted BOOLEAN DEFAULT FALSE,
      reports INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Ensure newly added columns exist in case table was already created
    ALTER TABLE drafts ADD COLUMN IF NOT EXISTS genre VARCHAR(100) DEFAULT 'General';
    ALTER TABLE drafts ADD COLUMN IF NOT EXISTS read_time VARCHAR(50) DEFAULT '1 min read';
    ALTER TABLE stories ADD COLUMN IF NOT EXISTS genre VARCHAR(100) DEFAULT 'General';
    ALTER TABLE stories ADD COLUMN IF NOT EXISTS read_time VARCHAR(50) DEFAULT '1 min read';
    ALTER TABLE stories ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
    ALTER TABLE stories ADD COLUMN IF NOT EXISTS reports INT DEFAULT 0;

    -- Story Likes Table
    CREATE TABLE IF NOT EXISTS story_likes (
      id SERIAL PRIMARY KEY,
      story_id INT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(story_id, user_id)
    );

    -- Story Comments Table
    CREATE TABLE IF NOT EXISTS story_comments (
      id SERIAL PRIMARY KEY,
      story_id INT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Story Reads Table (tracks user / visitor reads)
    CREATE TABLE IF NOT EXISTS story_reads (
      id SERIAL PRIMARY KEY,
      story_id INT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id INT REFERENCES users(id) ON DELETE SET NULL,
      ip_address VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Story Reports Table (detailed user reports on stories)
    CREATE TABLE IF NOT EXISTS story_reports (
      id SERIAL PRIMARY KEY,
      story_id INT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id INT REFERENCES users(id) ON DELETE SET NULL,
      reason VARCHAR(100) NOT NULL,
      details TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await pool.query(query);
};

// ================= DRAFTS MODEL FUNCTIONS =================

export const createDraftInDb = async ({
  authorId,
  title,
  description,
  coverPic,
  genre = 'General',
  readTime = '1 min read'
}) => {
  const query = `
    INSERT INTO drafts (author_id, title, description, cover_pic, genre, read_time)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, author_id, title, description, cover_pic, genre, read_time, is_deleted, created_at, updated_at
  `;
  const values = [authorId, title, description, coverPic || null, genre, readTime];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAuthorDraftById = async (draftId, authorId) => {
  const query = `
    SELECT d.id, d.author_id, d.title, d.description, d.cover_pic, d.genre, d.read_time, d.is_deleted, d.created_at, d.updated_at,
           u.name AS author_name, u.email AS author_email, u.profile_pic AS author_profile_pic
    FROM drafts d
    JOIN users u ON d.author_id = u.id
    WHERE d.id = $1 AND d.author_id = $2 AND d.is_deleted = FALSE
  `;
  const { rows } = await pool.query(query, [draftId, authorId]);
  return rows[0] || null;
};

export const getDraftById = async (draftId) => {
  const query = `
    SELECT d.id, d.author_id, d.title, d.description, d.cover_pic, d.genre, d.read_time, d.is_deleted, d.created_at, d.updated_at,
           u.name AS author_name, u.email AS author_email, u.profile_pic AS author_profile_pic
    FROM drafts d
    JOIN users u ON d.author_id = u.id
    WHERE d.id = $1 AND d.is_deleted = FALSE
  `;
  const { rows } = await pool.query(query, [draftId]);
  return rows[0] || null;
};

export const getAuthorDrafts = async (authorId, options = {}) => {
  const { search, limit, offset } = options;

  let whereClauses = ["d.author_id = $1", "d.is_deleted = FALSE"];
  let values = [authorId];
  let paramIdx = 2;

  if (search && String(search).trim() !== "") {
    whereClauses.push(`(d.title ILIKE $${paramIdx} OR d.description ILIKE $${paramIdx} OR d.genre ILIKE $${paramIdx})`);
    values.push(`%${String(search).trim()}%`);
    paramIdx++;
  }

  const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

  if (limit === undefined && offset === undefined && !search) {
    const query = `
      SELECT d.id, d.author_id, d.title, d.description, d.cover_pic, d.genre, d.read_time, d.is_deleted, d.created_at, d.updated_at
      FROM drafts d
      ${whereSql}
      ORDER BY d.updated_at DESC
    `;
    const { rows } = await pool.query(query, values);
    return rows;
  }

  const countQuery = `
    SELECT COUNT(*)::INT AS total
    FROM drafts d
    ${whereSql}
  `;
  const countRes = await pool.query(countQuery, values);
  const total = countRes.rows[0]?.total || 0;

  let paginationSql = "";
  const queryValues = [...values];

  if (limit !== undefined) {
    paginationSql += ` LIMIT $${paramIdx}`;
    queryValues.push(limit);
    paramIdx++;
  }

  if (offset !== undefined) {
    paginationSql += ` OFFSET $${paramIdx}`;
    queryValues.push(offset);
    paramIdx++;
  }

  const query = `
    SELECT d.id, d.author_id, d.title, d.description, d.cover_pic, d.genre, d.read_time, d.is_deleted, d.created_at, d.updated_at
    FROM drafts d
    ${whereSql}
    ORDER BY d.updated_at DESC
    ${paginationSql}
  `;
  const { rows } = await pool.query(query, queryValues);
  return { drafts: rows, total };
};

export const updateDraftInDb = async (id, authorId, { title, description, coverPic, genre, readTime }) => {
  const existingDraft = await getAuthorDraftById(id, authorId);
  
  if (!existingDraft) {
    throw new Error("Draft not found or unauthorized");
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
  if (genre !== undefined) {
    setClauses.push(`genre = $${paramIdx}`);
    values.push(genre);
    paramIdx++;
  }
  if (readTime !== undefined) {
    setClauses.push(`read_time = $${paramIdx}`);
    values.push(readTime);
    paramIdx++;
  }

  if (setClauses.length === 0) return existingDraft;

  setClauses.push("updated_at = NOW()");

  const query = `
    UPDATE drafts
    SET ${setClauses.join(", ")}
    WHERE id = $1 AND author_id = $2 AND is_deleted = FALSE
    RETURNING id, author_id, title, description, cover_pic, genre, read_time, is_deleted, created_at, updated_at
  `;

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const deleteDraftInDb = async (id, authorId) => {
  const query = `
    UPDATE drafts
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1 AND author_id = $2 AND is_deleted = FALSE
    RETURNING id
  `;
  const { rows } = await pool.query(query, [id, authorId]);
  return rows[0] || null;
};

export const hardDeleteDraftInDb = async (id, authorId) => {
  const query = `
    DELETE FROM drafts
    WHERE id = $1 AND author_id = $2
    RETURNING id
  `;
  const { rows } = await pool.query(query, [id, authorId]);
  return rows[0] || null;
};

// ================= STORIES (PUBLISHED) MODEL FUNCTIONS =================

export const createStory = async ({
  authorId,
  title,
  description,
  coverPic,
  genre = 'General',
  readTime = '1 min read',
  status = 'published'
}) => {
  const query = `
    INSERT INTO stories (author_id, title, description, cover_pic, genre, read_time, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, author_id, title, description, cover_pic, genre, read_time, status, is_featured, is_blocked, is_deleted, created_at, updated_at
  `;
  const values = [authorId, title, description, coverPic || null, genre, readTime, status];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getStoryById = async (id) => {
  const query = `
    SELECT s.id, s.author_id, s.title, s.description, s.cover_pic, s.genre, s.read_time, s.status, s.is_featured, s.is_blocked, s.is_deleted, s.reports, s.created_at, s.updated_at,
           u.name AS author_name, u.email AS author_email, u.profile_pic AS author_profile_pic,
           COALESCE(l.likes_count, 0)::INT AS likes_count,
           COALESCE(c.comments_count, 0)::INT AS comments_count,
           COALESCE(r.reads_count, 0)::INT AS reads_count
    FROM stories s
    JOIN users u ON s.author_id = u.id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS likes_count FROM story_likes GROUP BY story_id
    ) l ON s.id = l.story_id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS comments_count FROM story_comments GROUP BY story_id
    ) c ON s.id = c.story_id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS reads_count FROM story_reads GROUP BY story_id
    ) r ON s.id = r.story_id
    WHERE s.id = $1 AND s.is_deleted = FALSE
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

export const updateStory = async (id, authorId, { title, description, coverPic, genre, readTime, status }) => {
  const existingStory = await getStoryById(id);
  
  if (!existingStory) {
    throw new Error("Story not found");
  }

  if (existingStory.author_id !== authorId) {
    throw new Error("Unauthorized to edit this story");
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
  if (genre !== undefined) {
    setClauses.push(`genre = $${paramIdx}`);
    values.push(genre);
    paramIdx++;
  }
  if (readTime !== undefined) {
    setClauses.push(`read_time = $${paramIdx}`);
    values.push(readTime);
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
    WHERE id = $1 AND author_id = $2 AND is_deleted = FALSE
    RETURNING id, author_id, title, description, cover_pic, genre, read_time, status, is_featured, is_blocked, is_deleted, created_at, updated_at
  `;

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const setStoryBlockStatus = async (id, isBlocked) => {
  const query = `
    UPDATE stories
    SET is_blocked = $2, updated_at = NOW()
    WHERE id = $1 AND is_deleted = FALSE
    RETURNING id, author_id, title, description, cover_pic, genre, read_time, status, is_featured, is_blocked, is_deleted, created_at, updated_at
  `;
  const { rows } = await pool.query(query, [id, isBlocked]);
  return rows[0] || null;
};

export const setStoryFeaturedStatus = async (id, isFeatured) => {
  // Check if story exists and is not deleted
  const existingStory = await getStoryById(id);
  if (!existingStory) {
    const error = new Error("Story not found");
    error.statusCode = 404;
    throw error;
  }

  // If attempting to mark this story as featured, ensure no other story is already featured
  if (isFeatured) {
    const checkQuery = `
      SELECT id, title, is_featured
      FROM stories
      WHERE is_featured = TRUE AND is_deleted = FALSE AND id != $1
      LIMIT 1
    `;
    const { rows: conflictRows } = await pool.query(checkQuery, [id]);
    if (conflictRows.length > 0) {
      const current = conflictRows[0];
      const error = new Error(`Story "${current.title}" (ID: ${current.id}) is already featured. Unfeature it before featuring this story.`);
      error.statusCode = 409;
      error.currentFeaturedStory = current;
      throw error;
    }
  }

  const updateQuery = `
    UPDATE stories
    SET is_featured = $2, updated_at = NOW()
    WHERE id = $1 AND is_deleted = FALSE
    RETURNING id, author_id, title, description, cover_pic, genre, read_time, status, is_featured, is_blocked, is_deleted, created_at, updated_at
  `;
  const { rows } = await pool.query(updateQuery, [id, isFeatured]);
  return rows[0] || null;
};

export const getFeaturedStory = async () => {
  const query = `
    SELECT s.id, s.author_id, s.title, s.description, s.cover_pic, s.genre, s.read_time, s.status, s.is_featured, s.is_blocked, s.is_deleted, s.reports, s.created_at, s.updated_at,
           u.name AS author_name, u.email AS author_email, u.profile_pic AS author_profile_pic,
           COALESCE(l.likes_count, 0)::INT AS likes_count,
           COALESCE(c.comments_count, 0)::INT AS comments_count,
           COALESCE(r.reads_count, 0)::INT AS reads_count
    FROM stories s
    JOIN users u ON s.author_id = u.id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS likes_count FROM story_likes GROUP BY story_id
    ) l ON s.id = l.story_id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS comments_count FROM story_comments GROUP BY story_id
    ) c ON s.id = c.story_id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS reads_count FROM story_reads GROUP BY story_id
    ) r ON s.id = r.story_id
    WHERE s.is_featured = TRUE AND s.is_blocked = FALSE AND s.is_deleted = FALSE
    ORDER BY s.updated_at DESC
    LIMIT 1
  `;
  const { rows } = await pool.query(query);
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
      RETURNING id, author_id, title, description, cover_pic, genre, read_time, status, is_featured, is_blocked, is_deleted, created_at, updated_at
    `;
    values = [id];
  } else {
    query = `
      UPDATE stories
      SET is_deleted = TRUE, updated_at = NOW()
      WHERE id = $1 AND author_id = $2 AND is_deleted = FALSE
      RETURNING id, author_id, title, description, cover_pic, genre, read_time, status, is_featured, is_blocked, is_deleted, created_at, updated_at
    `;
    values = [id, authorId];
  }

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const getAuthorPublishedStories = async (authorId, options = {}) => {
  const { search, limit, offset } = options;

  let whereClauses = ["s.author_id = $1", "s.is_deleted = FALSE"];
  let values = [authorId];
  let paramIdx = 2;

  if (search && String(search).trim() !== "") {
    whereClauses.push(`(s.title ILIKE $${paramIdx} OR s.description ILIKE $${paramIdx} OR s.genre ILIKE $${paramIdx})`);
    values.push(`%${String(search).trim()}%`);
    paramIdx++;
  }

  const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

  if (limit === undefined && offset === undefined && !search) {
    const query = `
      SELECT s.id, s.author_id, s.title, s.description, s.cover_pic, s.genre, s.read_time, s.status, s.is_featured, s.is_blocked, s.is_deleted, s.reports, s.created_at, s.updated_at,
             u.name AS author_name, u.email AS author_email, u.profile_pic AS author_profile_pic,
             COALESCE(l.likes_count, 0)::INT AS likes_count,
             COALESCE(c.comments_count, 0)::INT AS comments_count,
             COALESCE(r.reads_count, 0)::INT AS reads_count
      FROM stories s
      JOIN users u ON s.author_id = u.id
      LEFT JOIN (
        SELECT story_id, COUNT(*) AS likes_count FROM story_likes GROUP BY story_id
      ) l ON s.id = l.story_id
      LEFT JOIN (
        SELECT story_id, COUNT(*) AS comments_count FROM story_comments GROUP BY story_id
      ) c ON s.id = c.story_id
      LEFT JOIN (
        SELECT story_id, COUNT(*) AS reads_count FROM story_reads GROUP BY story_id
      ) r ON s.id = r.story_id
      ${whereSql}
      ORDER BY s.created_at DESC
    `;
    const { rows } = await pool.query(query, values);
    return rows;
  }

  const countQuery = `
    SELECT COUNT(*)::INT AS total
    FROM stories s
    ${whereSql}
  `;
  const countRes = await pool.query(countQuery, values);
  const total = countRes.rows[0]?.total || 0;

  let paginationSql = "";
  const queryValues = [...values];

  if (limit !== undefined) {
    paginationSql += ` LIMIT $${paramIdx}`;
    queryValues.push(limit);
    paramIdx++;
  }

  if (offset !== undefined) {
    paginationSql += ` OFFSET $${paramIdx}`;
    queryValues.push(offset);
    paramIdx++;
  }

  const query = `
    SELECT s.id, s.author_id, s.title, s.description, s.cover_pic, s.genre, s.read_time, s.status, s.is_featured, s.is_blocked, s.is_deleted, s.reports, s.created_at, s.updated_at,
           u.name AS author_name, u.email AS author_email, u.profile_pic AS author_profile_pic,
           COALESCE(l.likes_count, 0)::INT AS likes_count,
           COALESCE(c.comments_count, 0)::INT AS comments_count,
           COALESCE(r.reads_count, 0)::INT AS reads_count
    FROM stories s
    JOIN users u ON s.author_id = u.id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS likes_count FROM story_likes GROUP BY story_id
    ) l ON s.id = l.story_id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS comments_count FROM story_comments GROUP BY story_id
    ) c ON s.id = c.story_id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS reads_count FROM story_reads GROUP BY story_id
    ) r ON s.id = r.story_id
    ${whereSql}
    ORDER BY s.created_at DESC
    ${paginationSql}
  `;
  const { rows } = await pool.query(query, queryValues);
  return { stories: rows, total };
};

export const getPublishedStories = async (options = {}) => {
  const { search, limit, offset, genre } = options;

  let whereClauses = ["s.is_blocked = FALSE", "s.is_deleted = FALSE"];
  let values = [];
  let paramIdx = 1;

  if (genre && String(genre).trim() !== "" && String(genre).toLowerCase() !== "all") {
    whereClauses.push(`s.genre = $${paramIdx}`);
    values.push(String(genre).trim());
    paramIdx++;
  }

  if (search && String(search).trim() !== "") {
    whereClauses.push(`(s.title ILIKE $${paramIdx} OR s.description ILIKE $${paramIdx} OR u.name ILIKE $${paramIdx} OR s.genre ILIKE $${paramIdx})`);
    values.push(`%${String(search).trim()}%`);
    paramIdx++;
  }

  const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

  if (limit === undefined && offset === undefined && !search && !genre) {
    const query = `
      SELECT s.id, s.author_id, s.title, s.description, s.cover_pic, s.genre, s.read_time, s.status, s.is_featured, s.is_blocked, s.is_deleted, s.reports, s.created_at, s.updated_at,
             u.name AS author_name, u.email AS author_email, u.profile_pic AS author_profile_pic,
             COALESCE(l.likes_count, 0)::INT AS likes_count,
             COALESCE(c.comments_count, 0)::INT AS comments_count,
             COALESCE(r.reads_count, 0)::INT AS reads_count
      FROM stories s
      JOIN users u ON s.author_id = u.id
      LEFT JOIN (
        SELECT story_id, COUNT(*) AS likes_count FROM story_likes GROUP BY story_id
      ) l ON s.id = l.story_id
      LEFT JOIN (
        SELECT story_id, COUNT(*) AS comments_count FROM story_comments GROUP BY story_id
      ) c ON s.id = c.story_id
      LEFT JOIN (
        SELECT story_id, COUNT(*) AS reads_count FROM story_reads GROUP BY story_id
      ) r ON s.id = r.story_id
      ${whereSql}
      ORDER BY s.is_featured DESC, s.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  const countQuery = `
    SELECT COUNT(*)::INT AS total
    FROM stories s
    JOIN users u ON s.author_id = u.id
    ${whereSql}
  `;
  const countRes = await pool.query(countQuery, values);
  const total = countRes.rows[0]?.total || 0;

  let paginationSql = "";
  const queryValues = [...values];

  if (limit !== undefined) {
    paginationSql += ` LIMIT $${paramIdx}`;
    queryValues.push(limit);
    paramIdx++;
  }

  if (offset !== undefined) {
    paginationSql += ` OFFSET $${paramIdx}`;
    queryValues.push(offset);
    paramIdx++;
  }

  const query = `
    SELECT s.id, s.author_id, s.title, s.description, s.cover_pic, s.genre, s.read_time, s.status, s.is_featured, s.is_blocked, s.is_deleted, s.reports, s.created_at, s.updated_at,
           u.name AS author_name, u.email AS author_email, u.profile_pic AS author_profile_pic,
           COALESCE(l.likes_count, 0)::INT AS likes_count,
           COALESCE(c.comments_count, 0)::INT AS comments_count,
           COALESCE(r.reads_count, 0)::INT AS reads_count
    FROM stories s
    JOIN users u ON s.author_id = u.id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS likes_count FROM story_likes GROUP BY story_id
    ) l ON s.id = l.story_id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS comments_count FROM story_comments GROUP BY story_id
    ) c ON s.id = c.story_id
    LEFT JOIN (
      SELECT story_id, COUNT(*) AS reads_count FROM story_reads GROUP BY story_id
    ) r ON s.id = r.story_id
    ${whereSql}
    ORDER BY s.is_featured DESC, s.created_at DESC
    ${paginationSql}
  `;
  const { rows } = await pool.query(query, queryValues);
  return { stories: rows, total };
};

// Report a story (records report and increments stories.reports counter)
export const reportStory = async (storyId, userId = null, reason = "other", details = "") => {
  // Check story existence
  const existing = await getStoryById(storyId);
  if (!existing) {
    throw new Error("Story not found");
  }

  // Insert report record
  const insertReportQuery = `
    INSERT INTO story_reports (story_id, user_id, reason, details)
    VALUES ($1, $2, $3, $4)
    RETURNING id, story_id, user_id, reason, details, created_at
  `;
  const { rows: reportRows } = await pool.query(insertReportQuery, [
    storyId,
    userId,
    String(reason).trim(),
    details ? String(details).trim() : null
  ]);

  // Increment reports count in stories table
  const updateCountQuery = `
    UPDATE stories
    SET reports = COALESCE(reports, 0) + 1, updated_at = NOW()
    WHERE id = $1
    RETURNING id, reports
  `;
  const { rows: updateRows } = await pool.query(updateCountQuery, [storyId]);

  return {
    report: reportRows[0],
    totalReports: updateRows[0]?.reports || 1
  };
};

export const getStoryReports = async (storyId) => {
  const query = `
    SELECT sr.id, sr.story_id, sr.user_id, sr.reason, sr.details, sr.created_at,
           u.name AS user_name, u.email AS user_email
    FROM story_reports sr
    LEFT JOIN users u ON sr.user_id = u.id
    WHERE sr.story_id = $1
    ORDER BY sr.created_at DESC
  `;
  const { rows } = await pool.query(query, [storyId]);
  return rows;
};

// Interaction Helpers: Track Read, Toggle Like, Add & Get Comments
export const recordStoryRead = async (storyId, userId = null, ipAddress = null) => {
  const query = `
    INSERT INTO story_reads (story_id, user_id, ip_address)
    VALUES ($1, $2, $3)
    RETURNING id, story_id, user_id, ip_address, created_at
  `;
  const { rows } = await pool.query(query, [storyId, userId, ipAddress]);
  return rows[0];
};

export const toggleStoryLike = async (storyId, userId) => {
  const checkQuery = `SELECT id FROM story_likes WHERE story_id = $1 AND user_id = $2`;
  const { rows } = await pool.query(checkQuery, [storyId, userId]);

  if (rows.length > 0) {
    await pool.query(`DELETE FROM story_likes WHERE story_id = $1 AND user_id = $2`, [storyId, userId]);
    return { liked: false };
  } else {
    await pool.query(`INSERT INTO story_likes (story_id, user_id) VALUES ($1, $2)`, [storyId, userId]);
    return { liked: true };
  }
};

export const addStoryComment = async (storyId, userId, content) => {
  const query = `
    INSERT INTO story_comments (story_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, story_id, user_id, content, created_at, updated_at
  `;
  const { rows } = await pool.query(query, [storyId, userId, content]);
  return rows[0];
};

export const getStoryComments = async (storyId, options = {}) => {
  const { search, limit, offset } = options;

  let whereClauses = ["sc.story_id = $1"];
  let values = [storyId];
  let paramIdx = 2;

  if (search && String(search).trim() !== "") {
    whereClauses.push(`(sc.content ILIKE $${paramIdx} OR u.name ILIKE $${paramIdx})`);
    values.push(`%${String(search).trim()}%`);
    paramIdx++;
  }

  const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

  if (limit === undefined && offset === undefined && !search) {
    const query = `
      SELECT sc.id, sc.story_id, sc.user_id, sc.content, sc.created_at, sc.updated_at,
             u.name AS user_name, u.profile_pic AS user_profile_pic
      FROM story_comments sc
      JOIN users u ON sc.user_id = u.id
      ${whereSql}
      ORDER BY sc.created_at ASC
    `;
    const { rows } = await pool.query(query, values);
    return rows;
  }

  const countQuery = `
    SELECT COUNT(*)::INT AS total
    FROM story_comments sc
    JOIN users u ON sc.user_id = u.id
    ${whereSql}
  `;
  const countRes = await pool.query(countQuery, values);
  const total = countRes.rows[0]?.total || 0;

  let paginationSql = "";
  const queryValues = [...values];

  if (limit !== undefined) {
    paginationSql += ` LIMIT $${paramIdx}`;
    queryValues.push(limit);
    paramIdx++;
  }

  if (offset !== undefined) {
    paginationSql += ` OFFSET $${paramIdx}`;
    queryValues.push(offset);
    paramIdx++;
  }

  const query = `
    SELECT sc.id, sc.story_id, sc.user_id, sc.content, sc.created_at, sc.updated_at,
           u.name AS user_name, u.profile_pic AS user_profile_pic
    FROM story_comments sc
    JOIN users u ON sc.user_id = u.id
    ${whereSql}
    ORDER BY sc.created_at ASC
    ${paginationSql}
  `;
  const { rows } = await pool.query(query, queryValues);
  return { comments: rows, total };
};

