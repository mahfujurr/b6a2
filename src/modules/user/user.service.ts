
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: Record<string, unknown>) => {
  const { name, email, password, role, phone } = payload;
  const hashPassword = await bcrypt.hash(password as string, 12);
  const result = await pool.query(
    `INSERT INTO users(name,email,password,role,phone) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role`,
    [name, email, hashPassword, role, phone]
  );
  return result;
};

const getAllUserIntoDB = async () => {
  const result = await pool.query(
    `SELECT id,name,email,phone,role FROM users`
  );
  return result;
};

const getSingleUserIntoDB = async (email: string) => {
  const result = await pool.query(
    `SELECT id,name,email,phone,role FROM users WHERE email=$1`,
    [email]
  );
  return result;
};

const getUserById = async (id: string) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const updateUserIntoDB = async (id: string, payload: any) => {
  const fields = Object.keys(payload);
  const values = Object.values(payload);

  if (fields.length === 0) return null;

  const allowed = ['name', 'email', 'phone', 'role'];
  const filteredFields: string[] = [];
  const filteredValues: any[] = [];

  fields.forEach((field, i) => {
    if (allowed.includes(field)) {
      filteredFields.push(field);
      filteredValues.push(values[i]);
    }
  });

  if (filteredFields.length === 0) return null;

  const setQuery = filteredFields.map((field, index) => `${field} = $${index + 2}`).join(', ');

  const result = await pool.query(
    `UPDATE users SET ${setQuery} WHERE id = $1 RETURNING id,name,email,phone,role`,
    [id, ...filteredValues]
  );
  return result.rows[0];
};

const deleteUserFromDB = async (id: string) => {

  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error('Cannot delete user with active bookings');
  }

  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result;
};

export const userServices = {
  createUserIntoDB,
  getAllUserIntoDB,
  getSingleUserIntoDB,
  getUserById,
  updateUserIntoDB,
  deleteUserFromDB
};