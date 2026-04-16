const Inquiry = require("../models/Inquiry");

// Helper to generate reference number
const generateRef = async (type = "INQ") => {
  const count = await Inquiry.countDocuments();
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(4, "0");
  return `${type}-${year}-${sequence}`;
};

// Intelligent keyword-based categorization
const categorizeInquiry = (subject, message) => {
  const content = (subject + " " + message).toLowerCase();
  
  if (content.match(/room|apartment|rent|stay|accommodation|bed|bathroom|housing|living|maintenance|hot water|broken/i)) return "Room";
  if (content.match(/food|meal|dining|canteen|lunch|dinner|breakfast|menu|eat|restaurant|delicious|hunger|spicy/i)) return "Food";
  if (content.match(/bus|route|shuttle|transport|driver|stop|station|time|schedule|delay|location|tracker/i)) return "Transport";
  
  return "General";
};

const createInquiry = async (req, res) => {
  try {
    const { roomId, subject, message, evidenceUrl } = req.body;
    
    if (!subject || !message || subject.trim() === "" || message.trim() === "") {
      return res.status(400).json({ message: "Inquiry subject and message are required and cannot be empty." });
    }

    const referenceNumber = await generateRef(roomId ? "INQ" : "CMP");

    const category = categorizeInquiry(subject, message);

    const inquiry = await Inquiry.create({
      user: req.user._id,
      referenceNumber,
      roomId: roomId || null,
      subject,
      message,
      category,
      evidenceUrl: evidenceUrl || "",
      status: "Pending"
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Get all inquiries
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("user", "name email")
      .populate("roomId", "title location")
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Get my own inquiries
const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user._id })
      .populate("roomId", "title location")
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("roomId", "title location");
    
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    
    // Security check: Only owner or admin can view
    const isOwner = inquiry.user && inquiry.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;
    
    const existingInquiry = await Inquiry.findById(req.params.id);
    if (!existingInquiry) return res.status(404).json({ message: "Inquiry not found" });

    // Block updates if already resolved
    if (existingInquiry.status === "Resolved") {
      return res.status(400).json({ message: "Resolved inquiries cannot be modified." });
    }
    
    // Validate new status if provided
    const allowedStatuses = ["Pending", "In Review", "Resolved", "Rejected"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminRemark },
      { new: true, runValidators: true }
    );

    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json({ message: "Inquiry removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPublicInquiry = async (req, res) => {
  try {
    const { guestName, guestEmail, phone, subject, message } = req.body;
    
    if (!guestName || !guestEmail || !subject || !message) {
      return res.status(400).json({ message: "Name, email, subject, and message are required." });
    }

    const referenceNumber = await generateRef("CMP");

    const category = categorizeInquiry(subject, message);

    const inquiry = await Inquiry.create({
      guestName,
      guestEmail,
      phone: phone || "",
      referenceNumber,
      subject,
      message,
      category,
      status: "Pending"
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getMyInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  createPublicInquiry
};
