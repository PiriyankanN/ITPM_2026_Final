const express = require("express");
const {
  createBusRoute,
  getBusRoutes,
  getBusRouteById,
  updateBusRoute,
  deleteBusRoute
} = require("../controllers/busRouteController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createBusRoute);
router.get("/", getBusRoutes);
router.get("/:id", getBusRouteById);
router.put("/:id", protect, adminOnly, updateBusRoute);
router.delete("/:id", protect, adminOnly, deleteBusRoute);

module.exports = router;
