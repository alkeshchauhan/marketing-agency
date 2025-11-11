import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/system.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // ✅ JSON parse karega
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => res.send("Backend running..."));

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => console.log(`✅ Server running on port ${process.env.PORT}`));
});
