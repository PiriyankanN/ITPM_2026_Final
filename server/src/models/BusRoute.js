const mongoose = require("mongoose");

const busRouteSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      trim: true
    },
    startLocation: {
      type: String,
      required: true,
      trim: true
    },
    endLocation: {
      type: String,
      required: true,
      trim: true
    },
    mainStops: {
      type: [String],
      default: []
    },
    nearbyLandmark: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("BusRoute", busRouteSchema);
