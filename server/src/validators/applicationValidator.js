import { body, query } from "express-validator";

export const submitApplicationRules = [
  body("opportunityId").isMongoId().withMessage("Invalid opportunity ID"),
  body("fullName").trim().notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 120 }).withMessage("Name must be 2–120 characters"),
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required")
    .matches(/^[+\d][\d\s-]{7,}$/).withMessage("Enter a valid phone number"),
  body("resumeUrl").optional({ values: "falsy" }).trim().isURL().withMessage("Resume URL must be a valid URL"),
  body("coverLetter").optional({ values: "falsy" }).trim()
    .isLength({ max: 1500 }).withMessage("Cover letter must be under 1500 characters"),
];

export const listApplicationsRules = [
  query("opportunityId").optional().isMongoId(),
  query("status").optional().isIn(["New", "Reviewing", "Shortlisted", "Rejected"]),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
];

export const updateStatusRules = [
  body("status").isIn(["New", "Reviewing", "Shortlisted", "Rejected"])
    .withMessage("Status must be one of: New, Reviewing, Shortlisted, Rejected"),
];
