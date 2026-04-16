require("dotenv").config();
const connectDatabase = require("./config/db");
const app = require("./app");

// Connect DB
connectDatabase();

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});