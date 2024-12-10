// app.js
require("dotenv").config(); // Load environment variables from .env file
require("./utils/scheduler");
const express = require("express");
const cookieParser = require("cookie-parser");
const { sequelize, models } = require("./database/db"); // Import sequelize and models
const { users, roles, shipments, shipment_locations } =
  require("./database/db").models;

const userRoutes = require("./routes/users");
const shippingRoutes = require("./routes/shipping");
const locationRoutes = require("./routes/location");

// Create express app
const app = express();

const cors = require("cors");
//Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

// Middleware setup
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
const bodyParser = require("body-parser");
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser());

// Simple GET route to test if server is running
app.get("/", (req, res) => {
  res.send("A simple Node App is running on this server");
});

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Use all routes from routes.js
app.use("/", userRoutes); // it will apply all the routes defined in routes.js
app.use("/", shippingRoutes);
app.use("/", locationRoutes);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
