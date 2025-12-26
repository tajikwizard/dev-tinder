const express = require("express");
const User = require("../models/userSchema");
const { userAuth } = require("../middlewares/authMiddleware");
const {validateEditProfileData} = require("../utils/validation");
const { verifyPassword, hashPassword} = require("../utils/password");
const profileRoutes = express.Router();


// ----- View Profile -----
profileRoutes.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----- Edit Profile -----
profileRoutes.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)){
      return res.status(400).json({ message: "Invalid fields in profile update" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    Object.keys(req.body).forEach(field => {
      user[field] = req.body[field];
    }
    );
    await user.save();
    return  res.status(200).json({ message: "Profile updated successfully", data: user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// ----- Change Password -----
profileRoutes.put("/profile/password", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old and new passwords are required" });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await verifyPassword(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid old password" });
        }
        const hashedNewPassword = await hashPassword(newPassword);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = profileRoutes;