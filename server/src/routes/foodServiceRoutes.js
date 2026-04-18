const express = require("express");
const {
  createFoodService,
  getFoodServices,
  updateFoodService,
  deleteFoodService,
  getFoodServiceById
} = require("../controllers/foodServiceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createFoodService);
router.get("/", getFoodServices);
router.get("/:id", getFoodServiceById);
router.put("/:id", protect, adminOnly, updateFoodService);
router.delete("/:id", protect, adminOnly, deleteFoodService);

module.exports = router;
