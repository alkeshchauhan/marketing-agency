import express from "express";
import { register, login, seedAdmin } from "../controllers/authController.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/seed-admin", seedAdmin);

export default router;
