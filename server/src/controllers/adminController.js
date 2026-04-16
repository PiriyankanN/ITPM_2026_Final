const Room = require("../models/Room");
const FoodService = require("../models/FoodService");
const BusRoute = require("../models/BusRoute");
const Inquiry = require("../models/Inquiry");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    
    const totalRooms = await Room.countDocuments();
    const totalFood = await FoodService.countDocuments();
    const totalRoutes = await BusRoute.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const totalUsers = await User.countDocuments();
    
    
    const pendingInquiries = await Inquiry.countDocuments({ status: "Pending" });
    const inReviewInquiries = await Inquiry.countDocuments({ status: "In Review" });
    const resolvedInquiries = await Inquiry.countDocuments({ status: "Resolved" });
    const rejectedInquiries = await Inquiry.countDocuments({ status: "Rejected" });

    
    const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(3).populate("user", "name");
    const recentRooms = await Room.find().sort({ createdAt: -1 }).limit(3);
    const recentFood = await FoodService.find().sort({ createdAt: -1 }).limit(3);
    
    res.json({
      counts: {
        rooms: totalRooms,
        food: totalFood,
        routes: totalRoutes,
        inquiries: totalInquiries,
        users: totalUsers,
        pendingInquiries
      },
      inquiryBreakdown: {
        pending: pendingInquiries,
        inReview: inReviewInquiries,
        resolved: resolvedInquiries,
        rejected: rejectedInquiries
      },
      recentActivity: {
        inquiries: recentInquiries,
        rooms: recentRooms,
        food: recentFood
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
