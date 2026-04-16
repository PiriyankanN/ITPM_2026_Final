"use strict";

const User = require("../models/User");

// Get logged in user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage, email, address, preferences } = req.body;
    
    // Find the user to update
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Allow clearing fields with empty strings, but keep existing value if undefined
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (address !== undefined) user.address = address;

    // Handle nested preferences object
    if (preferences) {
      if (preferences.budget !== undefined) user.preferences.budget = preferences.budget;
      if (preferences.location !== undefined) user.preferences.location = preferences.location;
      if (preferences.roomType !== undefined) user.preferences.roomType = preferences.roomType;
    }

    const updatedUser = await user.save();
    
    // Return updated user without password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
