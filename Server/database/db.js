// Correctly import Sequelize and DataTypes
const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize with the database credentials
const sequelize = new Sequelize("Shipping_Service", "postgres", "8908576665", {
  host: "localhost",
  dialect: "postgres", // Use the appropriate dialect for your database
});

// Define models using the sequelize instance after initialization
const users = require("../model/users")(sequelize, DataTypes);
const roles = require("../model/roles")(sequelize, DataTypes);
const shipment_locations = require("../model/shipment_locations")(
  sequelize,
  DataTypes
);
const shipments = require("../model/shipments")(sequelize, DataTypes);

// Sync the database (this will ensure all models are created in the database)
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.log("Error syncing database:", err));

// Export the sequelize instance and models
module.exports = {
  sequelize,
  models: { users, roles, shipment_locations, shipments },
};
