/**
 * Middleware that checks the admin role after requireAuth has run.
 * Must be used after requireAuth.
 */
export default function requireAdmin(req, res, next) {
  if (!req.admin || req.admin.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}
