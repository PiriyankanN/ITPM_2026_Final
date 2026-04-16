const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // Optional for guest inquiries
    },
    guestName: {
      type: String,
      trim: true
    },
    guestEmail: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    referenceNumber: {
      type: String,
      required: true,
      unique: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: false // Optional if it's a general complaint
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "In Review", "Resolved", "Rejected"],
      default: "Pending"
    },
    adminRemark: {
      type: String,
      default: ""
    },
    evidenceUrl: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      enum: ["Room", "Food", "Transport", "General"],
      default: "General"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
