import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Protected admin routes
router.get("/", verifyToken, adminOnly, getSettings);
router.put("/", verifyToken, adminOnly, updateSettings);

export default router;