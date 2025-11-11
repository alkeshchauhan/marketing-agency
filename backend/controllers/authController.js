import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // 🔹 Step 1: Get data from request
    const { name, email, password, gender, profilePicture } = req.body;

    // 🔹 Step 2: Validation check
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // 🔹 Step 3: Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔹 Step 4: Hash password
    const hash = await bcrypt.hash(password, 10);

    // 🔹 Step 5: Create new user in DB
    const user = await User.create({
      name,
      email,
      password: hash,
      gender,
      profilePicture: profilePicture || null,
      role: "user",
      status: "inactive",
      created_at: new Date(),
      updated_at: new Date(),
    });

    // 🔹 Step 6: Create JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔹 Step 7: Send success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        profilePicture: user.profilePicture || null,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const seedAdmin = async (req, res) => {
  try {
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount > 0) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    const hash = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hash,
      role: "admin",
      status: "active",
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("❌ Seed Admin Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // console.log(user);
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        profilePicture: user.profilePicture || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
