import { pool } from "../../config/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../../config"
const registerUser = async (payload: any) => {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [payload.email]);
    if (userResult.rows.length > 0) {
        throw new Error('User already exists');
    }

    const { name, email, password, phone, role } = payload;
    const hashPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
        `INSERT INTO users(name, email, password, phone, role) 
         VALUES($1, $2, $3, $4, $5) 
         RETURNING id, name, email, phone, role, created_at, updated_at`,
        [name, email, hashPassword, phone, role]
    );

    return result.rows[0];
};

const loginUser = async (email: string, password: string) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    )
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    if (!config.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        config.JWT_SECRET,
        { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
}
const authService = {
    loginUser,
    registerUser
}
export default authService
