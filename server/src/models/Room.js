const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    roomType: {
      type: String,
      enum: ["Single", "Shared", "Apartment"],
      default: "Single"
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: ""
    },
    contactNumber: {
      type: String,
      required: true
    },
    locationName: {
      type: String,
      trim: true
    },
    googleMapsLink: {
      type: String,
      required: true,
      trim: true
    },
    images: {
      type: [String],
      validate: [v => v.length > 0, "At least one room image is required"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Room", roomSchema);
