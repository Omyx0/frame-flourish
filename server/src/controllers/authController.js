import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { success, fail, serverError } from "../utils/apiResponse.js";

const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_MAX_AGE }
  );
}

function setTokenCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: TOKEN_MAX_AGE * 1000,
    path: "/",
  });
}

/**
 * POST /api/auth/login
 * Admin sign-in.
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return fail(res, "Email and password are required", 400);
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return fail(res, "Invalid credentials", 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return fail(res, "Invalid credentials", 401);
    }

    const token = signToken(admin);
    setTokenCookie(res, token);

    return success(res, { token, admin: admin.toJSON() });
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * POST /api/auth/logout
 * Clear the auth cookie.
 */
export async function logout(req, res) {
  res.clearCookie("token", { path: "/" });
  return success(res, { message: "Logged out" });
}

/**
 * GET /api/auth/me
 * Get the current authenticated admin.
 */
export async function getMe(req, res) {
  try {
    const admin = await Admin.findById(req.admin.id).select("-passwordHash");
    if (!admin) return fail(res, "Admin not found", 404);
    return success(res, admin);
  } catch (error) {
    return serverError(res, error);
  }
}
