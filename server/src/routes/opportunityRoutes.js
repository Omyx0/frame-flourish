import { Router } from "express";
import {
  listOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getDomainCounts,
  getLocations,
} from "../controllers/opportunityController.js";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createOpportunityRules,
  updateOpportunityRules,
  idParamRule,
  listQueryRules,
} from "../validators/opportunityValidator.js";

const router = Router();

// Public
router.get("/", listQueryRules, validateRequest, listOpportunities);
router.get("/domains", getDomainCounts);
router.get("/locations", getLocations);
router.get("/:id", idParamRule, validateRequest, getOpportunityById);

// Admin only
router.post("/", requireAuth, requireAdmin, createOpportunityRules, validateRequest, createOpportunity);
router.patch("/:id", requireAuth, requireAdmin, updateOpportunityRules, validateRequest, updateOpportunity);
router.delete("/:id", requireAuth, requireAdmin, idParamRule, validateRequest, deleteOpportunity);

export default router;
