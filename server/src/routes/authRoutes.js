import { Router } from "express";
import { body } from "express-validator";
import { login, logout, getMe } from "../controllers/authController.js";
import requireAuth from "../middleware/requireAuth.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.post(
  "/login",
  [
    body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required").isLength({ max: 200 }),
  ],
  validateRequest,
  login
);

router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

export default router;
