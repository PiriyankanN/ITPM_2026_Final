const FoodService = require("../models/FoodService");

const createFoodService = async (req, res) => {
  try {
    const { restaurantName, location, mealType } = req.body;
    if (!restaurantName || !location || !mealType) {
      return res.status(400).json({ message: "Please provide essential fields: Restaurant Name, Location, and Meal Type" });
    }
    const foodService = await FoodService.create(req.body);
    res.status(201).json(foodService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFoodServices = async (req, res) => {
  try {
    const { location, mealType, foodType } = req.query;
    const filters = {};

    if (location) {
      filters.location = { $regex: location, $options: "i" };
    }

    if (mealType) {
      filters.mealType = mealType;
    }

    if (foodType) {
      filters.foodType = { $regex: foodType, $options: "i" };
    }

    const foodServices = await FoodService.find(filters).sort({ createdAt: -1 });
    res.json(foodServices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFoodService = async (req, res) => {
  try {
    const { restaurantName, location, mealType } = req.body;
    if (!restaurantName || !location || !mealType) {
      return res.status(400).json({ message: "Restaurant Name, Location, and Meal Type are required" });
    }
    const updated = await FoodService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteFoodService = async (req, res) => {
  try {
    await FoodService.findByIdAndDelete(req.params.id);
    res.json({ message: "Food service removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFoodServiceById = async (req, res) => {
  try {
    const foodService = await FoodService.findById(req.params.id);
    if (!foodService) {
      return res.status(404).json({ message: "Food service not found" });
    }
    res.json(foodService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFoodService,
  getFoodServices,
  updateFoodService,
  deleteFoodService,
  getFoodServiceById
};
