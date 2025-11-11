import express from "express";
import { register } from "../controllers/authController.js";
import multer from "multer";

const router = express.Router();

// ✅ Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Route
router.post("/register", upload.single("profilePic"), register);

export default router;
