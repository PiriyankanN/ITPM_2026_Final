const Room = require("../models/Room");

const createRoom = async (req, res) => {
  try {
    const { title, location, price, roomType, isAvailable, description, contactNumber, locationName, googleMapsLink, images } = req.body;
    
    // Strict validation
    if (!title || !location || !price || !roomType || isAvailable === undefined || !description || !contactNumber || !locationName || !googleMapsLink || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Please provide all required fields: title, location, price, roomType, availability, description, contact, location name, maps link, and at least one image." });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({ message: "Price must be a positive number." });
    }

    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const { location, roomType, isAvailable, minPrice, maxPrice } = req.query;
    const filters = {};

    if (location) {
      filters.$or = [
        { location: { $regex: location, $options: "i" } },
        { locationName: { $regex: location, $options: "i" } }
      ];
    }

    if (roomType && roomType !== "All") {
      filters.roomType = roomType;
    }

    if (isAvailable === "true") {
      filters.isAvailable = true;
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const rooms = await Room.find(filters).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { title, location, price, roomType, isAvailable, description, contactNumber, locationName, googleMapsLink, images } = req.body;
    
    if (!title || !location || !price || !roomType || isAvailable === undefined || !description || !contactNumber || !locationName || !googleMapsLink || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({ message: "Price must be a positive number." });
    }

    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.preferences) {
      return res.json([]); // No preferences set yet
    }

    const { budget, location, roomType } = user.preferences;
    const allRooms = await Room.find({ isAvailable: true });

    // Scoring algorithm
    const scoredRooms = allRooms.map(room => {
      let score = 0;
      
      // 1. Budget Match (Most important)
      if (budget > 0) {
        if (room.price <= budget) score += 10;
        else if (room.price <= budget * 1.25) score += 5; // Slightly over budget
      }

      // 2. Location Match
      if (location && location.trim() !== "") {
        if (room.location.toLowerCase().includes(location.toLowerCase()) || 
            room.locationName.toLowerCase().includes(location.toLowerCase())) {
          score += 10;
        }
      }

      // 3. Room Type Match
      if (roomType && roomType !== "") {
        if (room.roomType === roomType) score += 5;
      }

      return { ...room.toObject(), matchScore: score };
    });

    // Sort by score descending and take top 4
    const recommendations = scoredRooms
      .filter(r => r.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRecommendations
};
