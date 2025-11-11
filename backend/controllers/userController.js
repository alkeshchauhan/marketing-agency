import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

export const addUser = async (req, res) => {
  try {
    // Extract fields from request body
    const { name, email, password, gender, profilePicture } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user with profile picture length:", profilePicture?.length || 0);

    // Create user with profile picture
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      profilePicture: profilePicture || null,
      role: "user",
      status: "active"
    });

    // Return the created user (exclude password)
    const { password: _, ...userWithoutPassword } = user.get({ plain: true });
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Add User Error:", error);
    res.status(500).json({ message: "Failed to create user", error: error.message });
  }
};

export const getUserDetail = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
};

export const updateUser = async (req, res) => {
  try {
    // Extract update fields
    const { name, email, password, gender, profilePicture, status } = req.body;

    // Prepare update data
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(gender && { gender }),
      ...(profilePicture !== undefined && { profilePicture: profilePicture || null }),
      ...(status && { status }),
      updated_at: new Date()
    };

    // Only include password if it was provided
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updateData.password = hash;
    }

    // Update user
    await User.update(updateData, { where: { id: req.params.id } });

    // Fetch and return updated user
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return updated user without password
    const { password: _, ...userWithoutPassword } = user.get({ plain: true });
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
};
