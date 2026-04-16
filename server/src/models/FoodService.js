const mongoose = require("mongoose");

const foodServiceSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    mealType: {
      type: String,
      required: true
    },
    priceRange: {
      type: String,
      required: false
    },
    contactInfo: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ""
    },
    googleMapsLink: {
      type: String,
      default: ""
    },
    openingHours: {
      type: String,
      default: ""
    },
    foodType: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    menuItems: [
      {
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        isAvailable: { type: Boolean, default: true }
      }
    ],
    isOpen: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FoodService", foodServiceSchema);
