import express from "express";
import { register, login, logout, getProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";


const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", authMiddleware, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get logged-in user profile
 * @access  Private
 */
router.get("/me", authMiddleware, getProfile);

export default router;
