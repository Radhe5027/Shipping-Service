// Load environment variables from the .env file so they can be accessed via process.env
require("dotenv").config();

// Import the express framework to create an Express app and define routes
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

// Import the sequelize instance and database models to interact with the database
const { sequelize, models } = require("./database/db");

// Destructure specific models from the models object for easier access
const { users, roles, shipments, shipment_locations } =
  require("./database/db").models;

// Import the route handlers for the user, shipping, and location APIs
const userRoutes = require("./routes/users"); // Routes related to user authentication and management
const shippingRoutes = require("./routes/shipping"); // Routes related to shipping (create, update, delete, etc.)
const locationRoutes = require("./routes/location"); // Routes related to shipment location management

// Create a new instance of an Express app
const app = express();

// Import the CORS middleware to allow cross-origin requests from other domains
const cors = require("cors");

// Load the OpenAPI document
const openapiDocument = YAML.parse(fs.readFileSync("./openapi.yaml", "utf8"));

// Serve the OpenAPI document at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
// Use CORS middleware to enable cross-origin requests from the specified frontend URL (localhost:5173)
// CORS helps handle security for cross-origin resource sharing
// .use - used to mount the middleware functions(like - cors)
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL from where requests are allowed
    credentials: true, // Allow cookies and other credentials to be sent with requests
  })
);

// Handle OPTIONS (preflight) requests to ensure CORS is set up correctly for all routes
// Preflight requests are sent by browsers before actual requests to check permissions
app.options("*", cors());

// Middleware setup:
// Middleware to parse URL-encoded data, commonly used for form submissions
// express.urlencoded() is used to parse application/x-www-form-urlencoded data (which is how form data is typically sent).
// req.body holds the parsed form data, which you can access in your route handler.
//express.urlencoded({ extended: true }) is used for handling traditional form submissions (application/x-www-form-urlencoded).
app.use(express.urlencoded({ extended: true }));

// Middleware to parse incoming JSON data in request bodies
// This is useful for handling API requests where the payload is in JSON format
// express.json() is used for handling API requests where the data is sent in JSON format (application/json).
app.use(express.json());

// A simple GET route to test if the server is working
// This can be used to check if the server is up and running during development
app.get("/", (req, res) => {
  res.send("A simple Node App is running on this server");
});

// Logging middleware to log every incoming HTTP request for debugging and monitoring
// Logs the HTTP method (e.g., GET, POST) and the requested URL
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next(); // Pass the request to the next middleware or route handler
});

// Route setup for handling API requests:
// Use imported route modules to handle specific sets of routes

// All user-related routes will be handled by the userRoutes module
app.use("/", userRoutes); // User-related routes (e.g., signup, login, etc.)

// All shipping-related routes will be handled by the shippingRoutes module
app.use("/", shippingRoutes); // Shipping-related routes (e.g., creating shipments, updating statuses, etc.)

// All location-related routes will be handled by the locationRoutes module
app.use("/", locationRoutes); // Location-related routes (e.g., updating shipment location)

// Server setup:
// Set the port for the server to listen on. Default to 3000 if no port is specified in the environment variables
const PORT = process.env.PORT || 3000;

// Start the server on the specified port, and log a message indicating that the server is running
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
