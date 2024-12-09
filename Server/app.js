require("dotenv").config();
const express = require("express"); // pass the express lib power to express variable
const roles = require("./model/init-models");
const shipment_locations = require("./model/init-models");
const shipments = require("./model/init-models");
const users = require("./model/init-models");

//Creating express object
const app = express(); // so that app. can acesses all the methods of the express

// Handling GET request
app.get("/", (req, res) => {
  res.send("A simple Node App is " + "running on this server");
  res.end();
});

// // Test the database connection
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connected successfully.");

//     // Sync models if necessary (optional in production)
//     await sequelize.sync();
//     console.log("Models are synchronized.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// })();

//port number
const PORT = process.env.PORT || 3000;

// Server setup
app.listen(PORT, console.log(`Server started on port ${PORT}`));
