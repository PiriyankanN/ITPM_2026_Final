const BusRoute = require("../models/BusRoute");

const createBusRoute = async (req, res) => {
  try {
    const { routeName, startLocation, endLocation, mainStops } = req.body;
    if (!routeName || !startLocation || !endLocation || !mainStops) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    const busRoute = await BusRoute.create(req.body);
    res.status(201).json(busRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBusRoutes = async (req, res) => {
  try {
    const { search } = req.query;
    const filters = {};

    // One search field can match a route name, a landmark, or a stop.
    if (search) {
      filters.$or = [
        { routeName: { $regex: search, $options: "i" } },
        { nearbyLandmark: { $regex: search, $options: "i" } },
        { mainStops: { $elemMatch: { $regex: search, $options: "i" } } }
      ];
    }

    const routes = await BusRoute.find(filters).sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBusRoute = async (req, res) => {
  try {
    const { routeName, startLocation, destination, timing } = req.body;
    if (!routeName || !startLocation || !destination || !timing) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    const updated = await BusRoute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBusRoute = async (req, res) => {
  try {
    await BusRoute.findByIdAndDelete(req.params.id);
    res.json({ message: "Bus route removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBusRouteById = async (req, res) => {
  try {
    const busRoute = await BusRoute.findById(req.params.id);
    if (!busRoute) {
      return res.status(404).json({ message: "Bus route not found" });
    }
    res.json(busRoute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBusRoute,
  getBusRoutes,
  getBusRouteById,
  updateBusRoute,
  deleteBusRoute
};
