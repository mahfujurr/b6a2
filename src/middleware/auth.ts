import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { pool } from "../config/db";
import config from "../config";

const auth = (...roles: ('admin' | 'customer')[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "You are not authorized" });
        return;
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        res.status(401).json({ success: false, message: "You are not authorized" });
        return;
      }
      const secret = config.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;

      if (!decoded.email) {
        res.status(401).json({ success: false, message: "Invalid token payload" });
        return;
      }

      const userResult = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [decoded.email]
      );

      if (userResult.rows.length === 0) {
        res.status(404).json({ success: false, message: "User not found!" });
        return;
      }

      const user = userResult.rows[0];

      
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        res.status(403).json({ success: false, message: "You are not authorized" });
        return;
      }

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
};

export default auth;