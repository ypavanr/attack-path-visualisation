import express from "express";
import { loginUser } from "../controllers/authController.js";

const router = express.Router();

// @route   POST /api/auth/login
router.post("/login", loginUser);

// You can add /register or /logout here later

export default router;
