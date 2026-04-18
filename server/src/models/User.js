const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    profileImage: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    preferences: {
      budget: { type: Number, default: 0 },
      location: { type: String, default: "" },
      roomType: { type: String, enum: ["Single", "Shared", "Apartment", ""], default: "" }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
