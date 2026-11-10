import { body, param, query } from "express-validator";
import { DOMAINS, TYPES, MODES } from "../models/Opportunity.js";

export const createOpportunityRules = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 200 }),
  body("companyName").trim().notEmpty().withMessage("Company name is required").isLength({ max: 120 }),
  body("domain").isIn(DOMAINS).withMessage(`Domain must be one of: ${DOMAINS.join(", ")}`),
  body("location").trim().notEmpty().withMessage("Location is required").isLength({ max: 100 }),
  body("workMode").isIn(MODES).withMessage(`Work mode must be one of: ${MODES.join(", ")}`),
  body("type").isIn(TYPES).withMessage(`Type must be one of: ${TYPES.join(", ")}`),
  body("pay").optional({ values: "falsy" }).trim().isLength({ max: 80 }),
  body("deadline").optional({ values: "falsy" }).isISO8601().withMessage("Deadline must be a valid date"),
  body("description").trim().notEmpty().withMessage("Description is required")
    .isLength({ min: 20, max: 5000 }).withMessage("Description must be 20–5000 characters"),
  body("responsibilities").optional().isArray(),
  body("responsibilities.*").optional().isString().trim(),
  body("requirements").optional().isArray(),
  body("requirements.*").optional().isString().trim(),
  body("applicationLink").optional({ values: "falsy" }).trim().isURL().withMessage("Application link must be a valid URL"),
];

export const updateOpportunityRules = [
  param("id").isMongoId().withMessage("Invalid opportunity ID"),
  body("title").optional().trim().notEmpty().isLength({ max: 200 }),
  body("companyName").optional().trim().notEmpty().isLength({ max: 120 }),
  body("domain").optional().isIn(DOMAINS),
  body("location").optional().trim().notEmpty().isLength({ max: 100 }),
  body("workMode").optional().isIn(MODES),
  body("type").optional().isIn(TYPES),
  body("pay").optional({ values: "falsy" }).trim().isLength({ max: 80 }),
  body("deadline").optional({ values: "falsy" }).isISO8601(),
  body("description").optional().trim().isLength({ min: 20, max: 5000 }),
  body("responsibilities").optional().isArray(),
  body("requirements").optional().isArray(),
  body("applicationLink").optional({ values: "falsy" }).trim().isURL(),
];

export const idParamRule = [
  param("id").isMongoId().withMessage("Invalid opportunity ID"),
];

export const listQueryRules = [
  query("search").optional().trim().escape(),
  query("domain").optional().isIn(DOMAINS),
  query("type").optional().isIn(TYPES),
  query("mode").optional().isIn(MODES),
  query("location").optional().trim(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];
