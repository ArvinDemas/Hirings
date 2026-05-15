import { query } from "../../config/db.js";

function mapUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUserWithPassword(row) {
  if (!row) {
    return null;
  }

  return {
    ...mapUser(row),
    passwordHash: row.password_hash,
  };
}

async function create({ fullName, email, passwordHash }) {
  const result = await query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email, role, created_at, updated_at`,
    [fullName, email, passwordHash]
  );

  return mapUser(result.rows[0]);
}

async function findByEmail(email) {
  const result = await query(
    `SELECT id, full_name, email, password_hash, role, created_at, updated_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  return mapUserWithPassword(result.rows[0]);
}

async function findById(id) {
  const result = await query(
    `SELECT id, full_name, email, role, created_at, updated_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id]
  );

  return mapUser(result.rows[0]);
}

function toPublicUser(user) {
  return mapUser({
    id: user.id,
    full_name: user.fullName,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  });
}

export const authRepository = {
  create,
  findByEmail,
  findById,
  toPublicUser,
};
