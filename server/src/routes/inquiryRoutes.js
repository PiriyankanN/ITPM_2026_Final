const express = require("express");
const {
  createInquiry,
  getAllInquiries,
  getMyInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  createPublicInquiry
} = require("../controllers/inquiryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createInquiry);
router.post("/public", createPublicInquiry);
router.get("/my", protect, getMyInquiries);
router.get("/:id", protect, getInquiryById);

// Admin Routes
router.get("/admin/all", protect, adminOnly, getAllInquiries);
router.get("/admin/:id", protect, adminOnly, getInquiryById); // Admin uses same controller but different route prefix
router.put("/admin/:id", protect, adminOnly, updateInquiryStatus);
router.delete("/admin/:id", protect, adminOnly, deleteInquiry);

module.exports = router;
