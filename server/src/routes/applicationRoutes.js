import { Router } from "express";
import {
  submitApplication,
  listApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  submitApplicationRules,
  listApplicationsRules,
  updateStatusRules,
} from "../validators/applicationValidator.js";
import rateLimit from "express-rate-limit";

// Rate limit application submissions: 5 per 15 minutes per IP
const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many applications submitted. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

// Public
router.post("/", applyLimiter, submitApplicationRules, validateRequest, submitApplication);

// Admin only
router.get("/", requireAuth, requireAdmin, listApplicationsRules, validateRequest, listApplications);
router.patch("/:id/status", requireAuth, requireAdmin, updateStatusRules, validateRequest, updateApplicationStatus);

export default router;
