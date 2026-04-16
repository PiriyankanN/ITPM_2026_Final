const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const foodRoutes = require("./routes/foodServiceRoutes");
const busRoutes = require("./routes/busRouteRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Student Living Assistant API is running."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/routes", busRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
